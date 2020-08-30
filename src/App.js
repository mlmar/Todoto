import React from 'react';

/*** CSS ***/
import './App.css';
import './css/main.css';
import './css/mobile.css';


/*** COMPONENTS ***/
import Screen from './js/screen/Screen.js';
import ReminderList from './js/reminder/ReminderList.js';
import Today from './js/reminder/Today.js';

/*** SERVICE ***/
import GoogleAuthService from './js/service/GoogleAuthService.js';
import ReminderService from './js/service/ReminderService.js';

const CLIENT_ID = "995406991758-dvjkt99op5bhk2sg3ha2cg6pvlm6803e.apps.googleusercontent.com";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user : null,

      navItems : [
        "Reminders",
      ],

      selectedIndex : 0,

      reminders : []
    }

    this.googleAuthService = new GoogleAuthService();
    this.reminderService = new ReminderService();

    this.setNav = this.setNav.bind(this);
    this.screen = React.createRef();
    this.today = React.createRef();
    
    this.addReminder = this.addReminder.bind(this);
    this.getReminders = this.getReminders.bind(this);
    this.deleteReminder = this.deleteReminder.bind(this);
    this.deleteManyReminders = this.deleteManyReminders.bind(this);
    this.authListener = this.authListener.bind(this);
  }
  
  /*  callback : set selectedIndex based on navigation selection
   *    @ from Nav component
   */
  setNav(index) {
    this.setState({ selectedIndex : index });
    console.log("selectedIndex = " + index);
  }

  /********************** SERVICE CALLS **********************/

  /*  callback : use api to add classes
   *    @ from ReminderList component
   */
  addReminder(reminder) {
    reminder.email = this.state.user.email;
    var query = {
      reminder : reminder,
      user : this.state.user
    }
    
    this.reminderService.addReminder((response) => {
      if(response.status === 2) {
        this.setState({ user : null});
        console.warn("Unverified request");
      } else {
        console.log(response);
        this.getReminders(this.state.user);
      }
    }, query);  
  }

  /*  get updated list of all reminders
   *    @ from addReminder() or componentDidMount
   */
  getReminders(user) {
    this.reminderService.getReminders((response) => {
      if(response.status === 2) {
        this.setState({ user : null});
        console.warn("Unverified request");
      } else {
        console.log(response);
        this.setState({ reminders : response.data})
      }
    }, { user : user });
  }

  /*  callback : use reminderService to delete single reminder by id
   */
  deleteReminder(id) {
    this.reminderService.deleteReminder((response) => {
      if(response.status === 2) {
        this.setState({ user : null});
        console.warn("Unverified request");
      } else {
       console.log(response);
       this.getReminders(this.state.user);
      }
    }, {id: id, user : this.state.user });
  }

  /*  callbakck : user remidnerService to delete multiple reminders by id
   */
  deleteManyReminders(ids) {
    this.reminderService.deleteManyReminders((response) => {
      if(response.status === 2) {
        this.setState({ user : null});
        console.warn("Unverified request");
      } else {
        console.log(response);
        this.getReminders(this.state.user);
      }
    }, {ids: ids, user : this.state.user });
  }

  /*  Authenticate user sign in with PWA auth then verify user
   */
  authListener() {
    const pwaAuth = document.querySelector("pwa-auth");
    pwaAuth.addEventListener("signin-completed", ev => {
      const signIn = ev.detail;
      if (signIn.error) {
        // if user fails to sign in, do nothing
        this.setState({ user : null });
        console.error("Sign in failed", signIn.error);
      } else {
        // if user signs in, verify user
        this.googleAuthService.verifyUser((response) => {
          if(response.status === 0) {
            this.setState({
              user : signIn
            }, () => {
              console.log(this.state.user) 
              this.getReminders(this.state.user);
            });
          } else {
            this.setState({ user : null });
            console.warn("Could not verify user");
          }
        }, signIn );
      }
    });
  }

   /********************** END SERVICE CALLS **********************/

  componentDidMount() {
    this.authListener();
    
    var mobile = window.matchMedia("only screen and (max-width: 768px)").matches;
    if(!mobile && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }

  /*  Use a separate function to keep the render method clean
   *    @ determines what the main page will show based on state
   *    @ if logged in -- use navigation index
   *    @   else -- show login page
   */
  renderControl(index) {
    var mobile = window.matchMedia("only screen and (max-width: 768px)").matches;

    var content = "";
    var screen = "";

    if(this.state.user) {
      switch(index) {

        case 0:
          screen = !mobile ? <Screen ref={this.screen}/> : "";
          content =
            <React.Fragment>
              {screen}

              <button className="switch-button portrait" onClick={() => this.today.current.switch()}> &#8609; </button>
              <ReminderList 
                reminders={this.state.reminders}
                handleAdd={this.addReminder}
                handleDelete={this.deleteReminder}
                handleManyDelete={this.deleteManyReminders}
              />
              <Today reminders={this.state.reminders} handleScreen={() => this.screen.current.force()} ref={this.today}/>
            </React.Fragment>
          break;
        
        default:
          content = "default";
          break;
      }
    } else {
      screen = !mobile ? <Screen disableSwipe="true"/> : "";
      content =
        <div className="signin">
          {screen}
          <span>
            <pwa-auth
              appearance="list"
              googlekey={CLIENT_ID}>
            </pwa-auth>
          </span>
        </div>
    }
    
    var page =
      <React.Fragment>
        <div className="content">
          {content}
        </div>
      </React.Fragment>

    return page;
  }

  render() {
    return (
      <div className="App">
        {this.renderControl(this.state.selectedIndex)}
      </div>
    );
  }
}

export default App;
