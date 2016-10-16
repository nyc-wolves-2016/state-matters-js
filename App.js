import React from 'react';
import AddressForm from './AddressForm.js';
import RepInfoDisplay from './RepInfoDisplay';
import Timeline from './Timeline';
import Bill from './Bill';
import $ from "jquery";
import setupListeners from './timeline_fcns';
import jquery from 'jquery';
import fullpage from 'fullpage.js';


class App extends React.Component {
  constructor() {
    super();
    this.geocodeIt = this.geocodeIt.bind(this);
    this.getBills = this.getBills.bind(this);
    this.state = {
      repInfo: {},
      bills: [
      ]
    }
  }

  geocodeIt(fullAddress){
    $.ajax({
      url: 'https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyAiRgU_ysVxPfbMqVQnOEeN4-aLW4OMEw4&address=' + fullAddress
    })
    .done(response => {
      var lat = response.results[0].geometry.location.lat
      var lng = response.results[0].geometry.location.lng
      this.getSenator(lat + '%2C%20' + lng )
      this.getAssembly(lat + '%2C%20' + lng )
      this.getCongress(lat + '%2C%20' + lng )
    })
  }

  getSenator(latLng) {
    $.ajax({
      url: "https://www.googleapis.com/fusiontables/v1/query?sql=SELECT%20DISTRICT%2C%20REP_NAME%2C%20REP_URL%2C%20POPULATION%20%20%20FROM%201KfhMo_HSAp3kq5Yayca22HrIhEjJLa_c_s6jd2Q%20%20WHERE%20geometry%20not%20equal%20to%20%27%27%20AND%20ST_INTERSECTS(geometry%2C%20CIRCLE(LATLNG(" + latLng + ")%2C1))&callback=MapsLib.displayListnysen&key=AIzaSyAHOjsb-JbuJn1lC6OzUNH-jlDT_KA_FwE&callback=jQuery17106865557795366708_1476457349224&_=1476457378113",
      method: 'get'
    })
    .done(function(response) {
      var foundRep = response;
      foundRep = $.parseJSON(foundRep.slice(41, -2));
      foundRep = foundRep.rows[0];
      this.setState({repInfo: foundRep});
      this.getBills(foundRep[1])
    }.bind(this))
    .fail(function(response) {
    }.bind(this));
  }

  getAssembly(latLng) {
    $.ajax({
      url: "https://www.googleapis.com/fusiontables/v1/query?sql=SELECT%20DISTRICT%2C%20REP_NAME%2C%20REP_URL%2C%20POPULATION%20%20%20FROM%2017nwTkaJDQ5AyfTtnX96SeBzRNZRekwKeonIZHvw%20%20WHERE%20geometry%20not%20equal%20to%20%27%27%20AND%20ST_INTERSECTS(geometry%2C%20CIRCLE(LATLNG(" + latLng + ")%2C1))&callback=MapsLib.displayListass&key=AIzaSyAHOjsb-JbuJn1lC6OzUNH-jlDT_KA_FwE&callback=jQuery1710929156077118652_1476403682128&_=1476403735798",
      method: 'get'
    })
    .done(function(response) {
    }).fail(function(response) {
      var foundRep = response.responseText;
      foundRep = $.parseJSON(foundRep.slice(39, -2));
      foundRep = foundRep.rows[0];
    });
  }

  getCongress(latLng) {
    $.ajax({
      url: "https://www.googleapis.com/fusiontables/v1/query?sql=SELECT%20DISTRICT%2C%20REP_NAME%2C%20REP_URL%2C%20POPULATION%20%20%20FROM%201GFWTwdhLbQ8yprvFNe-XNkrm1Ik-vPFFynaxg3g%20%20WHERE%20geometry%20not%20equal%20to%20%27%27%20AND%20ST_INTERSECTS(geometry%2C%20CIRCLE(LATLNG(" + latLng + ")%2C1))&callback=MapsLib.displayListcon&key=AIzaSyAHOjsb-JbuJn1lC6OzUNH-jlDT_KA_FwE&callback=jQuery17106865557795366708_1476457349225&_=1476457378114",
      method: 'get'
    })
    .done(function(response) {
    }).fail(function(response) {
      var foundRep = response.responseText;
      foundRep = $.parseJSON(foundRep.slice(39, -2));
      foundRep = foundRep.rows[0];
    });
  }

  getBills(repName) {
    $.ajax({
        url: "http://legislation.nysenate.gov/api/3/bills/2015/search?term=votes.size:>0%20AND%20year:2016&key=042A2V22xkhJDsvE22rtOmKKpznUpl9Y&offset=1&limit=1000&full=true",
        method: "GET"
    })
    .done(function(response) {
      // bills w/ floor votes
      $.fn.fullpage.moveSectionDown();
      
      var floorVotes = response.result.items.filter(bill => bill.result.votes.items.length === 2);
      var closeFloorVotes = floorVotes.filter(bill => bill.result.votes.items[1].memberVotes.items.AYE && bill.result.votes.items[1].memberVotes.items.NAY);
      var closerFloorVotes = closeFloorVotes.filter(bill => Math.abs((bill.result.votes.items[1].memberVotes.items.AYE.size) - (bill.result.votes.items[1].memberVotes.items.NAY.size)) < 20 )

      var decision = "";
      var senatorVotes = closerFloorVotes.map(bill => {
        if (bill.result.votes.items[1].memberVotes.items.AYE.items.filter(senator => senator.fullName === repName).length > 0) {
          return decision = "FOR"
        } else {
          return decision = "AGAINST"
        };
      });

      var cleanBills = closerFloorVotes.map(bill => {
        return {"title": bill.result.title,
                "year": bill.result.year,
                "yay": bill.result.votes.items[1].memberVotes.items.AYE.size,
                "against": bill.result.votes.items[1].memberVotes.items.NAY.size,
                "repDecision": decision,
                "summary": bill.result.summary
        }
      });

      this.setState({
        bills: cleanBills
      })
    }.bind(this))
  }

  componentDidMount(){
        $('#fullpage').fullpage({ 
          autoScrolling: false });
  };

  render() {
    return(
      <div ref="test" id="fullpage">
        <div className="section">
          <AddressForm getAddress={this.geocodeIt}/>
        </div>
        <div className="section" id="timeline">
          <RepInfoDisplay repDisplay={this.state.repInfo}/>
          <Timeline bills={this.state.bills}/>
        </div>
      </div>
    )
  }
}

export default App;
