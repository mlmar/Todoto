import React from 'react';

/*  REMINDER COMPONENT
 *    @ {this.props.text} = reminders text
 *    @ individual item in RemindersList component
 */
class List extends React.Component {
  render() {
    if(this.props.render) {
      return (
        <ul>
          {
            this.props.items.map((item, i) => {
              return this.props.render(item, i)
            })
          }
        </ul>
      )
    } else {
      return (
        <ul>
         {
          this.props.items.map((item, i) => {
            return (
              <label className="label-small"> {item} </label>
            )
          })
         }
        </ul>
      )
    }
  }
  
}

export default List;