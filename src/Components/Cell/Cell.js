import React from 'react';
import '../Cell/Cell.css'

class Cell extends React.Component {
  constructor(props){
    super(props);
  }

  render () {
    return (
      <td className="cell"
          data-row={this.props.row}
          data-col={this.props.col}
          style={this.props.style}>
      </td>
    )
  }
}

export default Cell;