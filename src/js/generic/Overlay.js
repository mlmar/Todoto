import React from 'react';

/*  Overlay component
 *    @ blank container that takes up 100% of the parent div
 *      - parent div must have position relative
 *    @ {this.props.render} : callback function to render elements onto the overlay
 */
class Overlay extends React.Component {
  render() {
    if(this.props.on === "true" || this.props.on === true) {
      return (
        <div className="overlay">
            {this.props.render()}
        </div>
      )
    } else {
      return (<span/>)
    }
  }
}

export default Overlay;