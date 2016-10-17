import React from 'react';
import setupListeners from './timeline_fcns.js';
import $ from "jquery";
import {IScroll} from 'fullpage.js';
import fullpage from 'fullpage.js';

class Bill extends React.Component {

  constructor() {
    super();
    this.addChart = this.addChart.bind(this);
    this.removeChart = this.removeChart.bind(this);
  }

  addChart() {
    console.log("mouse entered");
    addZeChart(this.props.supaKey);
  }

  removeChart() {
    console.log("mouse left");
    var chart = document.getElementById(this.props.supaKey);
    chart.remove();
    var billID = this.props.othaSupaKey;
    var chartID = this.props.supaKey;
    $('#'+billID).append('<div id='+chartID+'></div>')
  }

  componentDidMount() {
    $.fn.fullpage.reBuild();
    $.fn.fullpage.setAutoScrolling(false);
    $.fn.fullpage.setFitToSection(false);
    setupListeners();
  }

  componentDidUpdate() {

  }


  // <li id={othaSupaKey}>
  //   <div onMouseEnter={this.addChart} onMouseLeave={this.removeChart}>
  //     <time>{year}</time>
  //     <p>{title}</p>
  //   </div>
  //   <div id={supaKey}></div>
  // </li>



  render() {
    let {year, title, yay, against, repDecision, summary} = this.props.data
    let {supaKey, othaSupaKey} = this.props
    return(
      <li id={othaSupaKey}>
        <div className="big-box">
          <p>title: {title}</p>
          <p>reps decision: {repDecision}</p>
          <p>hover details</p>
          <div className="hover-box">
            <p>summary: {summary}</p>
            <p>for: {yay}</p>
            <p>against: {against}</p>
          </div>
        </div>
      </li>

    )
  }
}

export default Bill;
