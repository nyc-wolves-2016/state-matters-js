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
    this.closeBillsClicked = this.closeBillsClicked.bind(this);
    this.sponsoredClicked = this.sponsoredClicked.bind(this);
    this.keywordSearch = this.keywordSearch.bind(this);
    this.yearChange = this.yearChange.bind(this);
    this.showKeywordForm = this.showKeywordForm.bind(this);
    this.senatorChange = this.senatorChange.bind(this);
    this.state = {
      senatorInfo: {},
      bills: [],
      currentBills: [],
      year: { billYear: '2016', sessionYear: '2015' },
      showLoading: false,
      showForm: true,
      showKeywordSearchForm: false
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

  senatorChange(chosenBillYear, chosenSessionYear){
    this.setState({
      year: { billYear: chosenBillYear, sessionYear: chosenSessionYear }
    });

    var district = this.state.senatorInfo.district;
    $.ajax({
      url: "http://legislation.nysenate.gov/api/3/members/search?term=districtCode:" + district +" AND chamber:'SENATE'" + " AND sessionYear:" + chosenSessionYear + "&key=042A2V22xkhJDsvE22rtOmKKpznUpl9Y&full=true",
      method: "GET"
    })
    .done(function(response) {

      var senatorName = response.result.items[0].fullName;
      var districtCode = response.result.items[0].districtCode;

      this.setState({
        senatorInfo: { fullName: senatorName, district: districtCode }
      })

      this.getBills();
    }.bind(this))
  }

  yearChange(event){
    var chosenYear = event.target.value;
    var chosenBillYear = parseInt(chosenYear);

    if (chosenBillYear % 2 === 0) { var chosenSessionYear = chosenBillYear - 1 }
    else { var chosenSessionYear = chosenBillYear }

    this.setState({
      year: { billYear: chosenBillYear, sessionYear: chosenSessionYear }
    });

    this.senatorChange(chosenBillYear, chosenSessionYear)
  }

  getBills(billYear=2016, sessionYear=2015) {
    var billYear = parseInt(this.state.year.billYear);
    var sessionYear = parseInt(this.state.year.sessionYear);

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

  closeBillsClicked() {
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
      currentBills: keywordSearchBills,
      showKeywordSearchForm: false
    })
  }

   showKeywordForm() {
        this.setState({showKeywordSearchForm: true})
    }

  render() {
      if (this.state.showKeywordSearchForm) {
            var timelineFilters = <div className='row' id='keywordDiv'><form className='keyword-search' id='keyword-search-form' type='button' onSubmit={this.keywordSearch}><div className='keyword-search-box input-field col s9'><label htmlFor='keywordBox'>Search for bills by keyword</label><input ref='keywordBox' name='keywordBox' id='keywordBox' type='text'/></div><div className='col s3 waves-effect waves-light btn' id='supaDupaButton'><input type='submit' value='search'/></div></form></div>
      } else {
            var timelineFilters = <ul className="row">
            <li className="col s4">
            <a className="waves-effect waves-light btn" onClick={this.closeBillsClicked}>close vote bills</a>
            </li>

            <li className="col s4">
            <a className="waves-effect waves-light btn" onClick={this.sponsoredClicked}>Sponsored bills</a>
            </li>

            <li className="col s4">
            <a className="waves-effect waves-light btn" onClick={this.showKeywordForm}>Keyword Search</a>
            </li>
            </ul>
      }


    return(
      <div ref="test" id="fullpage">
        <div className="section">
          <div className="slide">
            <AddressForm hideIt={this.state.showForm} getAddress={this.geocodeIt}/> :
            { this.state.showLoading ? <Loading /> : null }
          </div>
          <div className="slide">
            <RepInfoDisplay repDisplay={this.state.senatorInfo}/>


            <div className="materialize" id="timeline-filterables">
                {timelineFilters}
            </div>

              <select onChange={this.yearChange} value={this.state.year.billYear}>
                <option value="2009">2009</option>
                <option value="2010">2010</option>
                <option value="2011">2011</option>
                <option value="2012">2012</option>
                <option value="2013">2013</option>
                <option value="2014">2014</option>
                <option value="2015">2015</option>
                <option value="2016">2016</option>
              </select>

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
