import React from 'react';
import SubTable from '../SubTable/SubTable'

class DraftingTable extends React.Component{
  arrayFiller(rows, cols) {
    const array = new Array(rows).fill([]).map(() => {
      return new Array(cols).fill(false)
    });
    // array.fill(new Array(cols).fill(false));
    return array;
  }
  
  constructor(props){
    super(props);

    const weftCount = 50;
    const warpCount = 50;
    const harnessCount = 4;
    const treadleCount = 4;

    this.state = {
      weftCount:weftCount,
      warpCount: warpCount,
      harnessCount: harnessCount,
      treadleCount: treadleCount,
      threadingTableData: this.arrayFiller(harnessCount, warpCount),
      tieupTableData: this.arrayFiller(harnessCount, treadleCount),
      weavingTableData: this.arrayFiller(weftCount, warpCount),
      treadlingTableData: this.arrayFiller(weftCount, treadleCount)
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
    const newWeavingData = this.arrayFiller(this.state.weftCount, this.state.warpCount);
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

  arrayDimensionsFromString(str) {
    let min = Number.MAX_VALUE;
    let max = Number.MIN_VALUE;
    let sepStr = str.split(",");
    let length = 0;
    sepStr.forEach(substring => {
      if(substring.includes("-")) {
        substring.split("-").forEach(num => {
          min = Math.min(min, parseInt(num));
          max = Math.max(max, parseInt(num));
        })
      } else {
        min = Math.min(min, parseInt(substring));
        max = Math.max(max, parseInt(substring));
      }
      length += 1;
    })
    const numCols = length;
    const numRows = max-min;
    return {
      rows: numRows+1,
      cols: numCols,
    }
  }

  expandPatternString(str) {
    // 1x4 = 1,1,1,1,
    const regex = /(\d+)x(\d+)/g;
    let newStr = str.replaceAll(regex, (match, p1, p2) => {
      const newSubstring = (p1+",").repeat(p2)
      return newSubstring
    })
    
    newStr = newStr.replaceAll(/,,/g, ",")
    if (newStr.endsWith(",")) 
      newStr = newStr.substring(0, newStr.length-1);
    return newStr;
  }

  patternDataFromString(str, tableName) {
    const expandedPatternString = this.expandPatternString(str);
    const patternData = expandedPatternString.split(",")
    const patternDimensions = this.arrayDimensionsFromString(expandedPatternString);
    let newTableData;
    if(tableName==="threading"){
      newTableData = this.arrayFiller(patternDimensions.rows, patternDimensions.cols);
      for(let col = 0; col < patternDimensions.cols; col++){
        const row = parseInt(patternData[patternDimensions.cols-1-col]) - 1;
        newTableData[patternDimensions.rows-1-row][col] = true;
      }
    } else if (tableName==="tieup") {
      newTableData = this.arrayFiller(patternDimensions.rows, patternDimensions.cols);
      for(let col = 0; col < patternDimensions.cols; col++){
        const rows = patternData[col];
        rows.split("-").forEach(rowStr => {
          const row = parseInt(rowStr) - 1;
          newTableData[patternDimensions.rows-1-row][col] = true;
        })
      }
    } else if(tableName==="treadling"){
      newTableData = this.arrayFiller(patternDimensions.cols, patternDimensions.rows);
      for(let row = 0; row < patternDimensions.cols; row++){
        const col = parseInt(patternData[row]) - 1;
        newTableData[row][col] = true;
      }
    } else {
      throw new Error("tableName isn't threading, treadling, or tieup");
    }
    return newTableData;
  }

  componentDidUpdate(prevProps){
    if(this.props.patternData === null) return;
    if(prevProps.patternData === this.props.patternData) return;
    const threadingData = this.patternDataFromString(this.props.patternData.data.threading, "threading");
    const tieupData = this.patternDataFromString(this.props.patternData.data.tieup, "tieup");
    const treadlingData = this.patternDataFromString(this.props.patternData.data.treadling, "treadling");

    const weftCount = treadlingData.length;
    const warpCount = threadingData[0].length;
    const harnessCount = threadingData.length;
    const treadleCount = treadlingData.length;

    const newState = {
      weftCount:weftCount,
      warpCount: warpCount,
      harnessCount: harnessCount,
      treadleCount: treadleCount,
      threadingTableData: threadingData,
      tieupTableData: tieupData,
      treadlingTableData: treadlingData
    }

    this.setState(newState, () => {
      this.setState({weavingTableData: this.updateWeave()});
    });
  }
}

export default DraftingTable;
