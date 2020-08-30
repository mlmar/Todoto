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
    if(this.props.hideDate === "true") {
      return (
        <li className="reminders-item fade" id={this.props.id} onClick={this.handleSelect} ref={this.reminderItem}>
          <label className="label-medium label-bolder"> {this.props.time} </label>
          <label className="label-small label-bold"> {this.props.title} </label>
          <label className="label-small"> {this.props.text} </label>
        </li>
      )
    } else {
      return (
        <li className="reminders-item fade" id={this.props.id} onClick={this.handleSelect} ref={this.reminderItem}>
          <label className="label-medium label-bold"> 
            {this.props.date} 
            &nbsp;&#124;&nbsp;
            <span className="label-small">
              {this.props.time}
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