import React from 'react'
import ToggleCell from '../ToggleCell/ToggleCell'

class SubTable extends React.Component {
  constructor(props){
    super(props);
    this.handleToggle = this.handleToggle.bind(this);
  }

  handleToggle(event){
    this.props.handleToggle(event, this.props.name);
  }

  constructTable(data){
    return data.map((row, rowIndex) => {
      return [row.map((cell, colIndex) => {
        return <ToggleCell key={`${colIndex}_${rowIndex}`}
          row={rowIndex}
          col={colIndex}
          toggle={this.handleToggle}
          isActive={cell}/>
      })]
    })
  }
  
  render() {
    return (
      <table>
      <tbody>
        {this.constructTable(this.props.data).map((row, i) => <tr key={i}>{row}</tr>)}
      </tbody>
      </table>
    )
  }
}

export default SubTable;