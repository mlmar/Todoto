import React from 'react';
import Time from '../clock/Time.js';
import Clock from '../clock/Clock.js';
import List from '../generic/List.js';
import Reminder from './Reminder.js';

class Today extends React.Component {
  constructor(props) {
    super(props);
    
    this.time = new Time();

    this.currentTime = "";
    this.times = [];


    this.handleItemRender = this.handleItemRender.bind(this);
    this.comapreTimes = this.compareTimes.bind(this);
    this.createNotification = this.createNotification.bind(this);
  }

  /*  callback : return item to be rendered in a List component
   *    @ from list component
   */
  handleItemRender(reminder, i) {
    var temp = 
      <Reminder
        id={reminder.id}
        date={reminder.date}
        time={reminder.time}
        title={reminder.title}
        text={reminder.text}
        key={reminder.id}
        onClick=""
        hideDate="true"
      />
    return temp;
  }

  // determine if current time is in the current stack of times
  //  if it is, notify the user and filter it out
  compareTimes(time, date) {
    var shortened = time.split(":");
    shortened = shortened[0] + ":" + shortened[1];
    if(this.times.includes(shortened)) {
      this.createNotification("Reminder", "You have a reminder set for " + shortened);
      this.times = this.times.filter((time) => time !== shortened);
    }
  }

  // chrome notifications
  createNotification(title, text) {
    if(Notification.permission === "granted") {
      var notification = new Notification(title, {
        icon: "",
        body: text,
      });
      console.log(notification);
    }
  }

  render() {
    // prop arrays ar still affected .push, .slice, .sort, etc. so make a copy
    var reminders = [...this.props.reminders];
    reminders = reminders.filter((item) => item.date === this.time.getDate(false, true));
    var sortedReminders = reminders.sort((a, b) => { return a.time.localeCompare(b.time) })
    
    // store only times in a stack for notifications
    var temp = []
    reminders.filter(reminder => temp.push(reminder.time));
    this.times = temp;

    return (
      <div className="today">
        <span>
          <span className="label-and-button">
            <button className="force-button" onClick={this.props.handleScreen}> &#8609; </button>
            <label className="label-large label-bolder"> Today </label>
          </span>
          <Clock getTime={(time, date) => this.compareTimes(time,date)} clockStyle="clock"/>
        </span>
        <List items={sortedReminders} render={this.handleItemRender}/>
      </div>
    )
  }
}

export default Today;