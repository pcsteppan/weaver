import React from 'react';
import './ToggleCell.css'

class ToggleCell extends React.Component {
  constructor(props){
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  
  handleClick (event) {
    this.props.toggle(event);
  }

  render () {
    return (
      <td className={`toggleCell ${this.props.isActive ? "active" : ""}`}
          onClick={this.handleClick}
          data-row={this.props.row}
          data-col={this.props.col}>
            {/* <div className="dot"></div> */}
      </td>
    )
  }
}

export default ToggleCell;