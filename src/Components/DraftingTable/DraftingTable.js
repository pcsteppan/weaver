import React from 'react';
import SubTable from '../SubTable/SubTable'
import WeavingSubTable from '../WeavingSubTable/WeavingSubTable'
import Loom from '../../Classes/Loom.ts';

class DraftingTable extends React.Component{
  arrayFiller(rows, cols, value) {
    const array = new Array(rows).fill([]).map(() => {
      return new Array(cols).fill(value)
    });
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
      threadingTableData: this.arrayFiller(harnessCount, warpCount, false),
      tieupTableData: this.arrayFiller(harnessCount, treadleCount, false),
      weavingTableData: this.arrayFiller(weftCount, warpCount, {backgroundColor: "#00f"}),
      treadlingTableData: this.arrayFiller(weftCount, treadleCount, false)
    }

    this.loom = new Loom({
      warp: warpCount,
      weft: weftCount,
      harnesses: harnessCount,
      treadles: treadleCount 
    });

    this.handleToggle = this.handleToggle.bind(this);
  }

  handleToggle(event, tableName){
    const stateToAccess = tableName + "Data";
    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);

    if(tableName === 'threadingTable'){
      // attach or unattach thread from harness
      const harnessRef = this.loom.harnesses[row]
      const warpThreadRef = this.loom.warpThreads[col];
      if(!harnessRef.threads.has(warpThreadRef)){
        harnessRef.attachThread(warpThreadRef);
      } else {
        harnessRef.unattachThread(warpThreadRef);
      }
    }
    else if(tableName === 'tieupTable'){
      // reverse data here such that bottom left cell is considered 0,0
      const inverseRow = this.loom.dimensions.harnesses - (row+1);
      console.log("row: ", inverseRow);
      console.log("col: ", col);
      const treadleRef = this.loom.treadles[col];
      const harnessRef = this.loom.harnesses[inverseRow];

      if(!treadleRef.harnesses.has(harnessRef)){
        treadleRef.attachHarness(harnessRef);
      } else {
        treadleRef.unattachHarness(harnessRef);
      }
    }
    else if(tableName === 'treadlingTable'){
      this.loom.setTreadlingInstruction(row, col);
    }
    
    const newTable = this.getUpdatedTableDataFromLoom(tableName);
    const newState = {[stateToAccess] : newTable};
    this.setState(newState);
    this.setState({weavingTableData: this.updateWeaveNew()});
  }

  getUpdatedTableDataFromLoom(tableName) {
    let newTable;

    if(tableName === 'threadingTable'){
      newTable = this.arrayFiller(this.loom.dimensions.harnesses, this.loom.dimensions.warp, false);
      newTable = newTable.map((row, rowIndex) => {
        return row.map((cell, colIndex) => {
          return this.loom.harnesses[rowIndex].threads.has(this.loom.warpThreads[colIndex]);
        })
      })
    }
    else if(tableName === 'tieupTable'){
      newTable = this.arrayFiller(this.loom.dimensions.harnesses, this.loom.dimensions.treadles, false);
      newTable = newTable.map((row, rowIndex) => {
        return row.map((cell, colIndex) => {
          return this.loom.treadles[colIndex].harnesses.has(this.loom.harnesses[this.loom.dimensions.harnesses - (rowIndex+1)]);
        })
      })
    }
    else if(tableName === 'treadlingTable'){
      newTable = this.arrayFiller(this.loom.dimensions.weft, this.loom.dimensions.treadles, false);
      newTable = newTable.map((row, rowIndex) => {
        const arr = new Array(this.loom.dimensions.treadles).fill(false);
        if(this.loom.treadlingInstructions[rowIndex]===null)
          return arr;
        arr[this.loom.treadlingInstructions[rowIndex].id] = true;
        return arr;
      })
    }

    return newTable;
  }

  updateWeaveNew(){
    const newWeavingData = this.arrayFiller(this.state.weftCount, this.state.warpCount, {backgroundColor: "#000"});
    for(let row = 0; row < newWeavingData.length; row++){
      for(let col = 0; col < newWeavingData[0].length; col++){
        const thread = this.loom.getTopThreadAt(col, row);
        newWeavingData[row][col] = thread.representation;
      }
    }
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
            <WeavingSubTable
              name="weavingTable"
              data={this.state.weavingTableData}/>
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

  loomInstanceFromPatternData(patternData){
    // threading
    const expandedThreadingString = this.expandPatternString(patternData.threading);
    const threadingData = expandedThreadingString.split(",");
    const threadingDimensions = this.arrayDimensionsFromString(expandedThreadingString);

    // treadling instructions
    const expandedTreadlingString = this.expandPatternString(patternData.treadling);
    const treadlingData = expandedTreadlingString.split(",");
    const treadlingDimensions = this.arrayDimensionsFromString(expandedTreadlingString);

    // tieup
    const expandedTieupString = this.expandPatternString(patternData.tieup);
    const tieupData = expandedTieupString.split(",");
    const tieupDimensions = this.arrayDimensionsFromString(expandedTieupString);

    const newLoom = new Loom({
      warp: threadingDimensions.cols,
      weft: treadlingDimensions.cols,
      treadles: tieupDimensions.cols,
      harnesses:  tieupDimensions.rows
    });

    // threading processing
    for(let col = 0; col < threadingDimensions.cols; col++){
      const row = parseInt(threadingData[threadingDimensions.cols-1-col]) - 1;
      const harnessIndex = threadingDimensions.rows-1-row;
      newLoom.harnesses[harnessIndex].attachThread(newLoom.warpThreads[col]);
    }

    // treadling processing
    for(let row = 0; row < treadlingDimensions.cols; row++){
      const col = parseInt(treadlingData[row]) - 1;
      newLoom.treadlingInstructions[row] = newLoom.treadles[col];
    }

    // tieup processing
    for(let col = 0; col < tieupDimensions.cols; col++){
      const rows = tieupData[col];
      rows.split("-").forEach(rowStr => {
        const row = parseInt(rowStr) - 1;
        newLoom.treadles[col].attachHarness(newLoom.harnesses[row]);
      })
    }

    return newLoom;
  }

  componentDidUpdate(prevProps){
    if(this.props.patternData === null) return;
    if(prevProps.patternData === this.props.patternData) return;

    this.loom = this.loomInstanceFromPatternData(this.props.patternData.data);

    const weftCount = this.loom.dimensions.weft;
    const warpCount = this.loom.dimensions.warp;
    const harnessCount = this.loom.dimensions.harnesses;
    const treadleCount = this.loom.dimensions.treadles;

    const newState = {
      weftCount: weftCount,
      warpCount: warpCount,
      harnessCount: harnessCount,
      treadleCount: treadleCount,
      threadingTableData: this.getUpdatedTableDataFromLoom("threadingTable"),
      tieupTableData: this.getUpdatedTableDataFromLoom("tieupTable"),
      treadlingTableData: this.getUpdatedTableDataFromLoom("treadlingTable")
    }

    this.setState(newState, () => {
      this.setState({weavingTableData: this.updateWeaveNew()});
    });
  }
}

export default DraftingTable;
