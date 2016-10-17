import React from 'react';
import setupListeners from './timeline_fcns.js';
import setupPieChart from './VoteChart.js';
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
      setupPieChart();
  }

  removeChart() {
    console.log("mouse left");
    setupPieChart()
      // $('#'+this.props.supaKey).remove();
  }

  componentDidMount() {
    $.fn.fullpage.reBuild();
    $.fn.fullpage.setAutoScrolling(false);
    $.fn.fullpage.setFitToSection(false);
    setupListeners();
  }

  componentDidUpdate() {

  }


  render() {
    let {year, title, yay, against, repDecision, summary} = this.props.data
    let {supaKey, othaSupaKey} = this.props
    return(
      <li id={othaSupaKey}>
        <div onMouseEnter={this.addChart} onMouseLeave={this.removeChart} className="big-box">

          <p>title: {title}</p>
          <p>reps decision: {repDecision}</p>
          <p>hover details</p>
          <div className="hover-box">
            <p>summary: {summary}</p>
            <p>for: {yay}</p>
            <p>against: {against}</p>
            <p><canvas className="voteChart" id={supaKey}></canvas></p>
          </div>
        </div>
      </li>

    )
  }
}

export default Bill;
