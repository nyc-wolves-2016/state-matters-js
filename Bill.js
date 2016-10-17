import React from 'react';
import setupListeners from './timeline_fcns.js';
import $ from "jquery";
import {IScroll} from 'fullpage.js';
import fullpage from 'fullpage.js';


class Bill extends React.Component {

  constructor() {
    super();
  }


  componentDidMount() {
    $.fn.fullpage.reBuild();
    $.fn.fullpage.setAutoScrolling(false);
    $.fn.fullpage.setFitToSection(false);
    let {year, title, yay, against, repDecision, summary} = this.props.data

    setupListeners();

    var data = {
      labels: [
          "Yay",
          "Nay"
      ],
      datasets: [
          {
              data: [yay, against],
              backgroundColor: [
                  "red",
                  "blue"
              ],
              hoverBackgroundColor: [
                  "#FF6384",
                  "#36A2EB"
              ]
          }
        ]
    };

    let pieChart = new Chart(this.refs.chart, {
      type: "pie",
      data: data
    });
  }

  componentDidUpdate() {

  }


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
            <p><canvas ref="chart" className="voteChart" id={supaKey}></canvas></p>

          </div>
        </div>
      </li>

    )
  }
}




export default Bill;
