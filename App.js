import React from 'react';
import AddressForm from './AddressForm.js';
import RepInfoDisplay from './RepInfoDisplay';
import Timeline from './Timeline';
import Bill from './Bill';
import $ from "jquery";
import setupListeners from './timeline_fcns';
import {IScroll} from 'fullpage.js';
import fullpage from 'fullpage.js';
import Loading from './Loading.js';


class App extends React.Component {
  constructor() {
    super();
    this.geocodeIt = this.geocodeIt.bind(this);
    this.getBills = this.getBills.bind(this);
    this.yearClicked = this.yearClicked.bind(this);
    this.sponsoredClicked = this.sponsoredClicked.bind(this);
    this.state = {
      repInfo: {},
      bills: [
      ],
      currentBills: [],
      showLoading: false,
      showForm: true
    }
  }

  geocodeIt(fullAddress){
    this.setState({showLoading: true, showForm: false})
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

  // gets all bills from 2016
  getBills(repName) {
    $.ajax({
        url: "http://legislation.nysenate.gov/api/3/bills/2015/search?term=votes.size:>0%20AND%20year:2016&key=042A2V22xkhJDsvE22rtOmKKpznUpl9Y&offset=1&limit=1000&full=true",
        method: "GET"
    })
    .done(function(response) {
      // bills w/ floor votes
      this.setState({showLoading: false, showForm: true});

      $.fn.fullpage.moveSlideRight();

      var floorVotes = response.result.items.filter(bill => bill.result.votes.items[bill.result.votes.items.length-1].voteType === "FLOOR");
      var closeFloorVotes = floorVotes.filter(bill => bill.result.votes.items[bill.result.votes.items.length-1].memberVotes.items.AYE && bill.result.votes.items[bill.result.votes.items.length-1].memberVotes.items.NAY);
      var closerFloorVotes = closeFloorVotes.filter(bill => Math.abs((bill.result.votes.items[bill.result.votes.items.length-1].memberVotes.items.AYE.size) - (bill.result.votes.items[bill.result.votes.items.length-1].memberVotes.items.NAY.size)) < 20 )

      var senatorVotes = closerFloorVotes.map(bill => {
        if (bill.result.votes.items[bill.result.votes.items.length-1].memberVotes.items.AYE.items.filter(senator => senator.fullName === repName).length > 0) {
          return "yay"
        } else {
          return "nay"
        };
      });


      var cleanBills = closerFloorVotes.map((bill, i) => {
        return {"title": bill.result.title,
                "year": bill.result.year,
                "yay": bill.result.votes.items[bill.result.votes.items.length-1].memberVotes.items.AYE.size,
                "nay": bill.result.votes.items[bill.result.votes.items.length-1].memberVotes.items.NAY.size,
                "repDecision": senatorVotes[i],
                "summary": bill.result.summary,
                "status": bill.result.status.statusDesc,
                "date": bill.result.status.actionDate
        }
      });

      var allBills = response.result.items

      this.setState({
        bills: allBills
      })

      this.setState({
        currentBills: cleanBills
      })

    }.bind(this))
  }


  componentDidMount(){
    $('#fullpage').fullpage({scrollOverflow: true})
  }

  yearClicked() {
    var floorVotes = this.state.bills.filter(bill => bill.result.votes.items[bill.result.votes.items.length-1].voteType === "FLOOR");
    var closeFloorVotes = floorVotes.filter(bill => bill.result.votes.items[bill.result.votes.items.length-1].memberVotes.items.AYE && bill.result.votes.items[bill.result.votes.items.length-1].memberVotes.items.NAY);
    var closerFloorVotes = closeFloorVotes.filter(bill => Math.abs((bill.result.votes.items[bill.result.votes.items.length-1].memberVotes.items.AYE.size) - (bill.result.votes.items[bill.result.votes.items.length-1].memberVotes.items.NAY.size)) < 20 )

    var senatorVotes = closerFloorVotes.map(bill => {
      if (bill.result.votes.items[bill.result.votes.items.length-1].memberVotes.items.AYE.items.filter(senator => senator.fullName === this.state.repInfo[1]).length > 0) {
        return "yay"
      } else {
        return "nay"
      };
    });

    var cleanBills = closerFloorVotes.map((bill, i) => {
      return {"title": bill.result.title,
              "year": bill.result.year,
              "yay": bill.result.votes.items[bill.result.votes.items.length-1].memberVotes.items.AYE.size,
              "nay": bill.result.votes.items[bill.result.votes.items.length-1].memberVotes.items.NAY.size,
              "repDecision": senatorVotes[i],
              "summary": bill.result.summary,
              "status": bill.result.status.statusDesc,
              "date": bill.result.status.actionDate
      }
    });

    this.setState({
      currentBills: cleanBills
    })
  }

  sponsoredClicked() {
    var repShortName = this.state.repInfo[1].split(" ")
    repShortName = repShortName[0] + " " + repShortName[2]
    var floorVoteBills = this.state.bills.filter(bill => bill.result.votes.items[bill.result.votes.items.length-1].voteType === "FLOOR");
    var allSponsoredBills = floorVoteBills.filter(bill => bill.result.sponsor.member !== null);
    var repSponsoredBills = allSponsoredBills.filter(bill => bill.result.sponsor.member.fullName === repShortName);

    // if (repSponsoredBills.forEach(bill => bill.result.votes.items[bill.result.votes.items.length-1].memberVotes.items.NAY === undefined && repSponsoredBills.forEach.result.votes.items[repSponsoredBills[0].result.votes.items.length-1].memberVotes.items.AYE) { repSponsoredBills[0].result.votes.items[repSponsoredBills[0].result.votes.items.length-1].memberVotes.items.AYE.size }

    var nays = repSponsoredBills.map(bill => bill.result.votes.items[bill.result.votes.items.length-1].memberVotes.items.NAY)
    var naysArray = nays.map(function(votes) { if (votes === undefined) { return votes = {size: 0} } else { return votes } } )

    var yays = repSponsoredBills.map(bill => bill.result.votes.items[bill.result.votes.items.length-1].memberVotes.items.AYE)
    var yaysArray = yays.map(function(votes) { if (votes === undefined) { return votes = {size: 0} } else { return votes } } )
    var cleanRepSponsoredBills = repSponsoredBills.map((bill, i) => {
      return {"title": bill.result.title,
              "year": bill.result.year,
              "summary": bill.result.summary,
              "repDecision": "N/A",
              "yay": yaysArray[i].size,
              "nay": naysArray[i].size,
              "status": bill.result.status.statusDesc,
              "date": bill.result.status.actionDate
      }
    });

    this.setState({
      currentBills: cleanRepSponsoredBills
    })
  }

  render() {
    return(
      <div ref="test" id="fullpage">
        <div className="section">
          <div className="slide">
            <AddressForm hideIt={this.state.showForm} getAddress={this.geocodeIt}/> :
            {this.state.showLoading ?
              <Loading /> :
              null
            }
          </div>
          <div className="slide">
            <RepInfoDisplay repDisplay={this.state.repInfo}/>
              <button className="filter-button" type="button" onClick={this.yearClicked}>2016 close vote bills</button>
              <button className="filter-button" type="button" onClick={this.sponsoredClicked}>sponsored bills</button>
            <Timeline bills={this.state.currentBills}/>
          </div>
          <div className="fp-controlArrow fp-next"></div>
          <div className="fp-controlArrow fp-next"></div>
        </div>
      </div>
    )
  }
}

export default App;
