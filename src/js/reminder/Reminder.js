import React from 'react';

/*  REMINDER COMPONENT
 *    @ {this.props.text} = reminders text
 *    @ individual item in RemindersList component
 */
class Reminder extends React.Component {
  constructor(props) {
    super(props);
    this.state = { selected : false }
    this.handleSelect = this.handleSelect.bind(this);
    this.reminderItem = React.createRef();
  }

  handleSelect() {
    if(this.props.onClick !== "") {
      this.reminderItem.current.classList.toggle("reminders-item-selected");
      this.setState({ selected : !this.state.selected }, () => {
        this.props.onClick(this.props.id, this.state.selected);
      });
    }
  }

  render() {
    var date = new Date(this.props.date);
    var dateString = date.toLocaleDateString().replace(/\//g, '-');
    var timeString = date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true, minute: 'numeric' });

    if(this.props.hideDate === "true") {
      return (
        <li className="reminders-item fade" id={this.props.id} onClick={this.handleSelect} ref={this.reminderItem}>
          <label className="label-medium label-bolder"> {timeString} </label>
          <label className="label-small label-bold"> {this.props.title} </label>
          <label className="label-small"> {this.props.text} </label>
        </li>
      )
    } else {
      return (
        <li className="reminders-item fade" id={this.props.id} onClick={this.handleSelect} ref={this.reminderItem}>
          <label className="label-medium label-bold"> 
            {dateString} 
            &nbsp;&#124;&nbsp;
            <span className="label-small">
              {timeString}
            </span>
          </label>
          <label className="label-small label-bold"> {this.props.title} </label>
          <label className="label-small"> {this.props.text} </label>
        </li>
      );
    }
  }
  
}

export default Reminder;