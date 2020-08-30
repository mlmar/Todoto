import React from 'react';
import Clock from '../clock/Clock.js';

class Screen extends React.Component {
  constructor(props) {
    super(props);
    
    this.screenTimeout = 0;

    this.screen = React.createRef();
    this.moveScreen = this.moveScreen.bind(this);
    this.addEventListeners = this.addEventListeners.bind(this);
    this.removeEventListeners = this.removeEventListeners.bind(this);
  }

  /*  Move the screen up when the user is active
   */
  moveScreen(e) {
    // only force the screen up on clicks and keypresses
    if(e.type !== "mousemove") { 
      this.screen.current.classList.add("screen-up");
    }

    if(this.screenTimeout) {
      clearTimeout(this.screenTimeout);
    }

    this.screenTimeout = setTimeout(() => {
      this.screen.current.classList.remove("screen-up");
    }, 20000);
  }

  force() {
    this.screen.current.classList.remove("screen-up");
    this.removeEventListeners();
    setTimeout(() => this.addEventListeners(), 1000);
  }

  addEventListeners() {
    document.addEventListener('click', this.moveScreen);
    document.addEventListener('mousemove', this.moveScreen);
    document.addEventListener('keypress', this.moveScreen);
  }

  removeEventListeners() {
    document.removeEventListener('click', this.moveScreen);
    document.removeEventListener('mousemove', this.moveScreen);
    document.removeEventListener('keypress', this.moveScreen);
  }

  componentDidMount() {
    if(!this.props.disableSwipe) {
      this.addEventListeners();
    }
  }

  componentWillUnmount() {
    if(!this.props.disableSwipe) {
      this.removeEventListeners();
    }
  }

  render() {
    return (
      <div className="screen" ref={this.screen} >
        <Clock clockStyle="label-main"/>
        <Clock clockStyle="label-submain" date="true" />
      </div>
    )
  }
}

export default Screen;