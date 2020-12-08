import React from 'react'
import './PatternItem.css'

class PatternItem extends React.Component{
  constructor(props){
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(){
    this.props.handleChange(this.props.index);
  }

  render(){
    return (
      <li class="patternItem" onClick={this.handleClick}>{this.props.data.name}</li>
    )
  }
}

export default PatternItem;