import React from 'react'
import DraftingTable from '../DraftingTable/DraftingTable'
import PatternItemList from '../PatternItemList/PatternItemList'
import { patterns } from '../../WeavingPatterns/weavingPatterns.js'
import './App.css';

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {currentPattern:null};
    this.handlePatternChange = this.handlePatternChange.bind(this);
  }

  handlePatternChange(i){
    this.setState({currentPattern: patterns[i]});
  }

  render() {
    return (
      <div className="App">
        <PatternItemList handleChange={this.handlePatternChange} />
        <DraftingTable patternData={this.state.currentPattern} />
      </div>
    );
  }
}

export default App;
