import React from 'react'
import Cell from '../Cell/Cell'

class WeavingSubTable extends React.Component {
  constructor(props){
    super(props);
  }

  constructTable(data){
    return data.map((row, rowIndex) => {
      return [row.map((representation, colIndex) => {
        return <Cell key={`${colIndex}_${rowIndex}`}
          row={rowIndex}
          col={colIndex}
          style={representation}/>
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

export default WeavingSubTable;