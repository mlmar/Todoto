import React from 'react';

/*** CSS ***/
import './App.css';
import './css/main.css';

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
        this.getReminders();
      }
    }, query);  
  }

  /*  get updated list of all reminders
   *    @ from addReminder() or componentDidMount
   */
  getReminders() {
    this.reminderService.getReminders((response) => {
      if(response.status === 2) {
        this.setState({ user : null});
        console.warn("Unverified request");
      } else {
        console.log(response);
        this.setState({ reminders : response.data})
      }
    }, { user : this.state.user });
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
       this.getReminders();
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
        this.getReminders();
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
              this.getReminders();
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
    
    if(Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }

  /*  Use a separate function to keep the render method clean
   *    @ determines what the main page will show based on state
   *    @ if logged in -- use navigation index
   *    @   else -- show login page
   */
  renderControl(index) {
    var content = "";
    //var nav = <Nav items={this.state.navItems} handleNav={this.setNav}/>

    if(this.state.user) {
      switch(index) {

        case 0:
          content =
            <React.Fragment>
              <Screen ref={this.screen}/>
              <ReminderList 
                reminders={this.state.reminders}
                handleAdd={this.addReminder}
                handleDelete={this.deleteReminder}
                handleManyDelete={this.deleteManyReminders}
              />
              <Today reminders={this.state.reminders} handleScreen={() => this.screen.current.force()}/>
            </React.Fragment>
          break;
        
        default:
          content = "default";
          break;
      }
    } else {
      content =
        <div className="signin">
          <Screen disableSwipe="true"/>
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
