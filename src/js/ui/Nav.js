import React from 'react';


/*  NAV COMPONENT
 *    - default position: closed
 *    - tap button to expand horizontally
 *    - Show navigation tabs and logout button
 */
class Nav extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      closed : true,
      index : 0
    }

    this.nav = React.createRef();
    this.navItems = React.createRef();

    // context bindings
    this.handleNavBtn = this.handleNavBtn.bind(this);
    this.handleNavItem = this.handleNavItem.bind(this);
  }
  
  /*  Nav button handler
   *    @ toggle nav div viiblity
   */
  handleNavBtn() {
    this.setState({ closed : !this.state.closed });
    this.nav.current.classList.toggle("nav-closed");
    this.nav.current.classList.toggle("nav-open");
    this.navItems.current.classList.toggle("nav-items-hide");
    this.navItems.current.classList.toggle("nav-items-show");
  }
  
  /*  Nav item handler (menu buttons)
   *    @ set current index in state
   *    @ return the index in a callback prop
   */ 
  handleNavItem(e) {
    if(e.target.tagName === "BUTTON") {
      this.setState(
        { index : parseFloat(e.target.id) },
        () => {
          this.props.handleNav(this.state.index);
          this.handleNavBtn();
        }
      );
    }
  }

  render() {
    var open = this.state.closed ? this.handleNavBtn : function(doNothing) {};
    var close = this.state.closed ? function(doNothing) {} : this.handleNavBtn;

    return (
      <div className="nav nav-closed" ref={this.nav} onClick={open}>
        <button className="nav-btn" onClick={close}> 
          <span> &lArr; </span>
        </button>

        <div className="nav-items nav-items-hide" ref={this.navItems} onClick={this.handleNavItem}>
          {
            this.props.items.map((item, i) => {
              if(this.state.index !== i)
                return <button id={i} key={i}> {item} </button>
              else
                return <button id={i} key={i} className="nav-items-selected"> {item} </button>
            })
          }
        </div>

      </div>
    )
  }
}

export default Nav;