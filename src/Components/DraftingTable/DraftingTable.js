import React from 'react';
import SubTable from '../SubTable/SubTable'

class DraftingTable extends React.Component{
  constructor(props){
    super(props);

    const arrayFiller = (rows, cols) => {
      const array = new Array(rows).fill([]).map(() => {
        return new Array(cols).fill(false)
      });
      // array.fill(new Array(cols).fill(false));
      return array;
    }

    const weftCount = 50;
    const warpCount = 50;
    const harnessCount = 4;
    const treadleCount = 4;

    this.state = {
      weftCount:weftCount,
      warpCount: warpCount,
      harnessCount: harnessCount,
      treadleCount: treadleCount,
      threadingTableData: arrayFiller(harnessCount, warpCount),
      tieupTableData: arrayFiller(harnessCount, treadleCount),
      weavingTableData: arrayFiller(weftCount, warpCount),
      treadlingTableData: arrayFiller(weftCount, treadleCount)
    }
    
    this.handleToggle = this.handleToggle.bind(this);
  }

  handleToggle(event, tableName){
    const stateToAccess = tableName + "Data";
    const newTable = this.state[stateToAccess];
    newTable[event.target.dataset.row][event.target.dataset.col] = 
      !(this.state[stateToAccess][event.target.dataset.row][event.target.dataset.col]);
    const newState = {};
    newState[stateToAccess]=newTable;
    this.setState(newState);
    this.setState({weavingTableData: this.updateWeave()});
  }

  updateWeave() {
    const newWeavingData = Array.from(this.state.weavingTableData)
    this.state.treadlingTableData.forEach((row, rowIndex) => {
      // find active treadle
      let treadleIndex = 0;
      while(!row[treadleIndex] && treadleIndex++<this.state.treadleCount)
      
      // if no active treadle on instruction row, skip
      if(treadleIndex === this.state.treadleCount)
        return;
      
      // otherwise
      // look up associated harnesseses in tieup table
      const activeHarnesses = []
      this.state.tieupTableData.forEach((tieupRow, tieupRowIndex) => {
        if(tieupRow[treadleIndex]){
          activeHarnesses.push(tieupRowIndex);
        }
      })

      for(let weavingDataColIndex = 0; weavingDataColIndex<this.state.warpCount; weavingDataColIndex++){
        for(let threadingRowIndex = 0; threadingRowIndex < this.state.harnessCount; threadingRowIndex++){
          if(this.state.threadingTableData[threadingRowIndex][weavingDataColIndex] &&
            activeHarnesses.includes(threadingRowIndex)){
              newWeavingData[rowIndex][weavingDataColIndex] = true;
              break;
          } else {
            newWeavingData[rowIndex][weavingDataColIndex] = false;
          }
        }
      }
    })
    return newWeavingData;
  }

  render(){
    return(
      <table>
      <tbody>
        <tr>
          <td className="threadingTableContainer">
            <SubTable
              name="threadingTable"
              data={this.state.threadingTableData}
              handleToggle={this.handleToggle}/>
          </td>
          <td className="tieupTableContainer">
            <SubTable
              name="tieupTable"
              data={this.state.tieupTableData}
              handleToggle={this.handleToggle}/>
          </td>
        </tr>
        <tr>
          <td className="weavingTableContainer">
            <SubTable
              name="weavingTable"
              data={this.state.weavingTableData}
              handleToggle={this.handleToggle}/>
          </td>
          <td className="treadlingTableContainer">
            <SubTable
              name="treadlingTable"
              data={this.state.treadlingTableData}
              handleToggle={this.handleToggle}/>
          </td>
        </tr>
      </tbody>
      </table>
    )
  }
}

export default DraftingTable;
