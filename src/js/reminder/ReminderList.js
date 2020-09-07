import React from 'react';
import List from '../generic/List.js'
import Reminder from './Reminder.js';
import Time from '../clock/Time.js';

/*  REMINDERS COMPONENT
 *    @ {this.props.reminders} = reminders data
 *    @ shows users their reminders
 */
class ReminderList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      input : false,
      selected : []
    }

    this.time = new Time();

    this.newReminder = {
      id    : 0,
      date  : new Date(),
      title : "Title",
      text  : "Text",
      email : ""
    }

    // save id's that will be deleted
    this.selected = [];

    // references
    this.inputDate = React.createRef();
    this.inputTime = React.createRef();
    this.inputTitle = React.createRef();
    this.inputText = React.createRef();
    
    this.reminders = React.createRef();
    this.switch = this.switch.bind(this);

    this.handleText = this.handleText.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.handleManyDelete = this.handleManyDelete.bind(this);
    this.handleSelection = this.handleSelection.bind(this);
    this.handleItemRender = this.handleItemRender.bind(this);
  
    this.renderInput = this.renderInput.bind(this);
  }

  switch() {
    this.reminders.current.classList.toggle("hide");
  }

  /*  update newReminder as user types
   *    @ get id of focsed input and update value of the same name
   */
  handleText(e) {
    var id = e.target.id;
    var value = e.target.value;

    if(id === "date") {
      var reorderedDate = new Date(value); // reorder to mm-dd-yyyy
      reorderedDate = reorderedDate.getMonth() + "-" + reorderedDate.getDate() + "-" + reorderedDate.getYear();
      this.newReminder.date = reorderedDate;
    } else {
      this.newReminder[id] = value;
    }
  }

  // assign an id to newReminder then return it in a callback
  handleAdd() {
    var empty = this.newReminder.title === "" || this.newReminder.text === "";
    if(!empty) { // prevent adding a reminder with blank content
      var length = this.props.reminders.length;
      this.newReminder.id = this.props.reminders.length > 0 ? this.props.reminders[length - 1].id + 1: 0;

      this.newReminder.date = this.newReminder.date === "" ? "Date not specified" : new Date(this.newReminder.date);
      this.props.handleAdd(this.newReminder);

      console.log(this.newReminder.id);
    }
  }

  // passes list of selected ids to callback deleteMany function
  handleManyDelete() {
    this.props.handleManyDelete(this.state.selected);
    this.setState({ selected : [] });
  }

  /* callback : function for rendered items
   *  if a reminder was just selected, push its id to the selected stack
   *    else filter out the id from the stack
   */
  handleSelection(id, isSelected) {
    var tempSelected = this.state.selected;
    if(!isSelected) {
      tempSelected = tempSelected.filter(itemId => itemId !== id);
    } else {
      tempSelected.push(id);
    }

    this.setState({ selected : tempSelected });
    
  }

  /*  callback : return item to be rendered in a List component
   *    @ from list component
   */
  handleItemRender(reminder, i) {
    var temp = 
      <Reminder
        id={reminder.id}
        date={reminder.date}
        title={reminder.title}
        text={reminder.text}
        key={i + " " + reminder.id + reminder.date + reminder.title + reminder.text}
        onClick={this.handleSelection}
      />

    return temp;
  }

  /*  Renders reminders input based on input state
   *    arbitrary parameter is there to show that this.state.input should be passed to this function to start a rerender
   */
  renderInput(arbitrary) {
    var input = "";
    if(this.state.input) {

      // append delete button to input if its open
      var deleteButton = this.state.selected.length > 0 ? <button className="input-button fade" onClick={this.handleManyDelete}> Delete Reminders </button> : "";
      return (
        <div className="reminders-input fade">
          <span>
            <label> Date </label>
            <input type="date" id="date" defaultValue={new Date().toLocaleDateString('en-CA')} autoComplete="off" onChange={this.handleText} ref={this.inputDate} />
          </span>
          <span>
            <label> Time </label>
            <input type="time" id="time" defaultValue={this.time.getMilitaryTime()} autoComplete="off" onChange={this.handleText} ref={this.inputTime} />
          </span>
          <span>
            <label> Title </label>
            <input type="text" id="title" defaultValue="Title" autoComplete="off" onChange={this.handleText} ref={this.inputTitle} />
          </span>
          <span>
            <label> Text </label>
            <input type="text" id="text" defaultValue="Text" autoComplete="off" onChange={this.handleText} ref={this.inputText} />
          </span>
          <div className="reminders-input-buttons">
            <button className="input-button fade" onClick={this.handleAdd}> Add Reminder </button>
            {deleteButton}
          </div>
        </div>
      )
    }
  }

  render() {
    var toggleText = this.state.input ? "-" : "+";

    // prop arrays ar still affected .push, .slice, .sort, etc. so make a copy
    var reminders = [...this.props.reminders];
    var sortedReminders = reminders.sort((a, b) => a.date.localeCompare(b.date) );
    
    // do not append delete button to input if it is open
    var deleteButton = this.state.selected.length > 0  && !this.state.input ? 
      <button className="input-button fade" onClick={this.handleManyDelete}> Delete Reminders </button> : "";

    return (
      <div className="reminders hide" ref={this.reminders}>
        <span className="reminders-title">
          <label className="label-large label-bold label-left label-white"> 
            Reminders
          </label>
          <button className="toggle-button" onClick={() => this.setState({ input :  !this.state.input }) }> 
            {toggleText}
          </button>
          {deleteButton}
        </span>
        {this.renderInput(this.state.input, this.state.selected.length)}
        <List items={sortedReminders} render={this.handleItemRender}/>
      </div>
    )
  }
}

export default ReminderList;