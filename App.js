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
    this.keywordSearch = this.keywordSearch.bind(this);
    this.showKeywordForm = this.showKeywordForm.bind(this);
    this.state = {
      senatorInfo: {},
      bills: [],
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
      var senatorFirstLast = foundRep[1].split(" ");
      var senatorFirstLast = senatorFirstLast[0] + " " + senatorFirstLast[2];
      var repObj = {
        district: foundRep[0],
        fullName: foundRep[1],
        firstLast: senatorFirstLast,
        web: foundRep[2],
        population: foundRep[3]
      }
      foundRep.push(senatorFirstLast);
      this.setState({senatorInfo: repObj});
      // save district to its own state
      // retrieve later when non-default year is specified
      this.getBills()
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


  getBills(sessionYear=2015, billYear=2016) {
    $.ajax({
        url: "http://legislation.nysenate.gov/api/3/bills/" + sessionYear +"/search?term=voteType:'FLOOR'%20AND%20year:" + billYear + "&key=042A2V22xkhJDsvE22rtOmKKpznUpl9Y&offset=1&limit=1000&full=true",
        method: "GET"
    })
    .done(function(response) {
      // bills w/ floor votes
      this.setState({showLoading: false, showForm: true});

      $.fn.fullpage.moveSlideRight();

      var allBills = response.result.items;

      var nays = allBills.map(bill => bill.result.votes.items[bill.result.votes.items.length-1].memberVotes.items.NAY);
      var naysArray = nays.map(function(votes) { if (votes === undefined) { return votes = {size: 0} } else { return votes } });

      var yays = allBills.map(bill => bill.result.votes.items[bill.result.votes.items.length-1].memberVotes.items.AYE);
      var yaysArray = yays.map(function(votes) { if (votes === undefined) { return votes = {size: 0} } else { return votes } });

      var senatorVotes = allBills.map(bill => {
        if (bill.result.votes.items[bill.result.votes.items.length-1].memberVotes.items.AYE && bill.result.votes.items[bill.result.votes.items.length-1].memberVotes.items.AYE.items.filter(senator => senator.fullName === this.state.senatorInfo.fullName || senator.fullName === this.state.senatorInfo.firstLast).length > 0) { return "yay" }
        else if (bill.result.votes.items[bill.result.votes.items.length-1].memberVotes.items.NAY && bill.result.votes.items[bill.result.votes.items.length-1].memberVotes.items.NAY.items.filter(senator => senator.fullName === this.state.senatorInfo.fullName || senator.fullName === this.state.senatorInfo.firstLast).length > 0) { return "nay" }
        else { return "n/a" }
      })

      var billSponsors = allBills.map(bill => {
        if (bill.result.sponsor.member !== null) { return bill.result.sponsor.member.fullName }
        else { return "n/a" }
      })

      var cleanBills = allBills.map((bill, i) => {
        return {title: bill.result.title,
                year: bill.result.year,
                yay: yaysArray[i].size,
                nay: naysArray[i].size,
                senatorDecision: senatorVotes[i],
                summary: bill.result.summary,
                status: bill.result.status.statusDesc,
                date: bill.result.status.actionDate,
                sponsor: billSponsors[i],
                billId: bill.result.basePrintNoStr
        }
      });

      var cleanCloserVoteBills = cleanBills.filter(bill => Math.abs(bill.yay - bill.nay) < 20)

      // var theYear = billYear.toString();

      this.setState({
        bills: cleanBills
      });

      this.setState({
        currentBills: cleanCloserVoteBills
      });

    }.bind(this))
  }


  componentDidMount(){
    $('#fullpage').fullpage({scrollOverflow: true})
  }

  yearClicked() {
    var cleanCloserVoteBills = this.state.bills.filter(bill => Math.abs(bill.yay - bill.nay) < 20);

    this.setState({
      currentBills: cleanCloserVoteBills
    })
  }

  sponsoredClicked() {
    var senatorSponsoredBills = this.state.bills.filter(bill => bill.sponsor === this.state.senatorInfo.firstLast || bill.sponsor === this.state.senatorInfo.fullName);

    this.setState({
      currentBills: senatorSponsoredBills
    })
  }

  keywordSearch(event) {
    event.preventDefault();
    var searchTerm = this.refs.keywordBox.value;
    var keywordSearchBills = this.state.bills.filter(bill => bill.summary.includes(searchTerm));

    this.setState({
      currentBills: keywordSearchBills
    })
    // remove form from DOM at end of this event and unhide other filters
    $('#timeline-filterables').find('li').show();
    $('#timeline-filterables').find('form').remove();
  }

  showKeywordForm() {
      //   append form for keyword search to DOM and hide other filters
      $('#timeline-filterables').find('li').hide();
      $('#timeline-filterables').append("<div class='row' id='keywordDiv' style={this.formStyle()}><form class='keyword-search' id='keyword-search-form' type='button' onSubmit={this.keywordSearch}><div class='keyword-search-box input-field col s9'><label for='keywordBox'>Search for bills by keyword</label><input ref='keywordBox' name='keywordBox' id='keywordBox' type='text'/></div><div class='col s3 waves-effect waves-light btn' id='supaDupaButton'><input type='submit' value='search'/></div></form></div>");
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


            <div className="materialize" id="timeline-filterables">
                <ul className="row">
                  <li className="col s4">
                  {/* <button className="filter-button" type="button" onClick={this.yearClicked}>2016 close vote bills</button> */}
                  <a className="waves-effect waves-light btn" onClick={this.yearClicked}>2016 close vote bills</a>
                  </li>

                  <li className="col s4">
                  {/* <button className="filter-button" type="button" onClick={this.sponsoredClicked}>sponsored bills</button> */}
                  <a className="waves-effect waves-light btn" onClick={this.sponsoredClicked}>Sponsored bills</a>
                  </li>

                  <li className="col s4">
                  {/* <button className="filter-button" type="button" onClick={this.showKeywordForm}>Search by Keyword</button> */}
                  <a className="waves-effect waves-light btn" onClick={this.showKeywordForm}>Keyword Search</a>
                  </li>
                </ul>

            </div>


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
