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


    let {year, title, yay, nay, repDecision, summary} = this.props.data
    setupListeners();

    Chart.defaults.global.defaultFontColor = "white";

    var data = {
      labels: [
        "Yay",
        "Nay"
      ],
      datasets: [
        {
          data: [yay, nay],
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
    debugger
    let pieChart = new Chart(this.refs.chart, {
      type: "pie",
      data: data
    });
  }

  shouldComponentUpdate(newProps) {
    var othaOthaSupaKey = this.props.othaSupaKey + 1000;
    var canvasHolderId = "#"+othaOthaSupaKey;
    // $(canvasHolderId).find('canvas').remove();
    $(canvasHolderId).find('iframe').remove();
    //

    //
    //


    return true;
  }

  componentWillReceiveProps(newProps) {


  }

  componentDidUpdate(){
    var othaOthaSupaKey = this.props.othaSupaKey + 1000;
    var realKey = othaOthaSupaKey + 1000;
    var canvasHolderId = "#"+othaOthaSupaKey;
    var freshCanvas = "<canvas ref='chart' id="+this.props.supaKey+" style='display: block; width: 0px; height: 0px;' width='0' height='0'>";
    // $(canvasHolderId).append(freshCanvas);
    let {year, title, yay, nay, repDecision, summary} = this.props.data

    Chart.defaults.global.defaultFontColor = "white";

    var data = {
      labels: [
        "Yay",
        "Nay"
      ],
      datasets: [
        {
          data: [yay, nay],
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

    var canvasTag = document.createElement("canvas")
    canvasTag.setAttribute("ref", "chart")
    canvasTag.setAttribute("id", this.props.supaKey)
    debugger;
    let pieChart = new Chart(this.refs.chart, {
      type: "pie",
      data: data
    });
    debugger;
  }

  //
  // componentWillUpdate() {
  //   $.fn.fullpage.reBuild();
  //
  //
  //
  //   let {year, title, yay, nay, repDecision, summary} = this.props.data
  //   Chart.defaults.global.defaultFontColor = "white";
  //
  //   var data = {
  //     labels: [
  //       "Yay",
  //       "Nay"
  //     ],
  //     datasets: [
  //       {
  //         data: [yay, nay],
  //         backgroundColor: [
  //           "red",
  //           "blue"
  //         ],
  //         hoverBackgroundColor: [
  //           "#FF6384",
  //           "#36A2EB"
  //         ]
  //       }
  //     ]
  //   };
  //
  //   let pieChart = new Chart(this.refs.chart, {
  //     type: "pie",
  //     data: data
  //   });
  //   return false;
  // }



  render() {

    let {year, title, yay, nay, senatorDecision, summary, status, date} = this.props.data
    let {supaKey, othaSupaKey} = this.props
    let othaOthaSupaKey = this.props.othaSupaKey + 1000
    let realKey = othaOthaSupaKey + 1000;

    return(
      <li id={othaSupaKey}>
        <div className="big-box">
          <p>TITLE: {title}</p>
          <p>YOUR SENATORS DECISION: {senatorDecision}</p>
          <p>HOVER FOR MORE INFO</p>
          <div className="hover-box">
            <p>SUMMARY: {summary}</p>
            <p>YAY: {yay}</p>
            <p>NAY: {nay}</p>
            <p>STATUS: {status}</p>
            <p>ACTION DATE: {date}</p>
            <p id={othaOthaSupaKey} ref="holder"><canvas ref="chart" id={realKey}></canvas></p>
          </div>
        </div>
      </li>
    )
  }
}




export default Bill;
