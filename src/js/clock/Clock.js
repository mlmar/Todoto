import React from 'react';
import Time from './Time.js';

class Clock extends React.Component {
  constructor(props) {
    super(props);

    this.time = new Time();
    this.timer = 0;

    this.state = {
      time : this.time.getTime(true),
      date : this.time.getDate(this.props.showYear === "true")
    }
  }

  // get time every second
  // return time and date in a callback if necessary
  componentDidMount() {
    this.timer = setInterval(() => {
      this.setState({ 
        time : this.time.getTime(true, this.props.showAMPM), 
        date : this.time.getDate(this.props.showYear === "true") 
      }, () => {
          if(this.props.getTime) {
            this.props.getTime(this.state.time, this.state.date);
          }
        }
      );
    }, 1000)

  }
  
  // prevent memory leaks
  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    if(this.props.date === "true") {
      return <label className={this.props.clockStyle}> {this.state.date} </label>
    }

    return (
      <label className={this.props.clockStyle}> {this.state.time} </label>
    )
  }
}

export default Clock;