import React from 'react'
import {patterns} from '../../WeavingPatterns/weavingPatterns.js'
import PatternItem from '../PatternItem/PatternItem.js'
import './PatternItemList.css'

class PatternItemList extends React.Component{
  constructor(props){
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }
  
  handleChange(i){
    this.props.handleChange(i);
  }

  render(){
    return (
    <ul>
      {patterns.map((pattern, i) => {
        return <PatternItem
          handleChange={this.handleChange}
          index={i}
          data={pattern} />
      })}
    </ul>
    )
  }
}

export default PatternItemList;