import React from 'react';
import AddressForm from './AddressForm.js';
import RepInfoDisplay from './RepInfoDisplay';
import Timeline from './Timeline';
import Bill from './Bill';
import jquery from "jquery";
import $ from "jquery";
import setupListeners from './timeline_fcns';
import {IScroll} from 'fullpage.js';
import fullpage from 'fullpage.js';
import Loading from './Loading.js';
import jQueryify from './custom_jquery.js';


class App extends React.Component {
  constructor() {
    super();
    // this.geocodeIt = this.geocodeIt.bind(this);
    this.compare = this.compare.bind(this);
    // this.getBills = this.getBills.bind(this);
    this.getBillTotal = this.getBillTotal.bind(this);
    this.getSenator = this.getSenator.bind(this);
    this.closeBillsClicked = this.closeBillsClicked.bind(this);
    this.sponsoredClicked = this.sponsoredClicked.bind(this);
    this.keywordSearch = this.keywordSearch.bind(this);
    this.yearChange = this.yearChange.bind(this);
    this.showKeywordForm = this.showKeywordForm.bind(this);
    this.senatorChange = this.senatorChange.bind(this);
    this.state = {
      // senatorInfo: {},
      senatorInfo: {},
      bills: {},
      currentBills: [],
      year: { billYear: '2016', sessionYear: '2015' },
      offset: '1',
      showLoading: false,
      showForm: true,
      showKeywordSearchForm: false,
      closeVoteClicked: true,
      sponsoredClicked: false,
      yearClicked: false,
      keywordClicked: false,
      showLoadingLine: false
    }
  }

  // geocodeIt(fullAddress){
  //   this.setState({showLoading: true, showForm: false, showLoadingLine: true})
  //   $.ajax({
  //     url: 'https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyAiRgU_ysVxPfbMqVQnOEeN4-aLW4OMEw4&address=' + fullAddress
  //   })
  //   .done(response => {
  //     var lat = response.results[0].geometry.location.lat
  //     var lng = response.results[0].geometry.location.lng
  //     this.getSenator(lat + '%2C%20' + lng )
  //     // this.getAssembly(lat + '%2C%20' + lng )
  //     // this.getCongress(lat + '%2C%20' + lng )
  //   })
  // }

  getSenator(fullAddress){
    $.ajax({
      url:"https://www.nysenate.gov/find-my-senator?search=true&addr1=" + fullAddress,
      method: "get",
      dataType: "text"
    })
    .done(response => {
      var doc = $.parseHTML(response)
      var name = $(doc).find(".c-find-my-senator--senator-link").first().text().trim();
      var district = $(doc).find(".c-find-my-senator--senator-link").first().parent().siblings().text().slice(-2)
      var website = $(doc).find(".c-find-my-senator--senator-link").first().attr("href")

      var senatorFirstLastSplit = name.split(" ");
      if (senatorFirstLastSplit.length > 2) {
        var senatorFirstLast = senatorFirstLastSplit[0] + " " + senatorFirstLastSplit[2];
      }
      var repObj = {
        district: $(doc).find(".c-find-my-senator--senator-link").first().parent().siblings().text().slice(-2),
        fullName: name,
        firstLast: senatorFirstLast || name,
        short: senatorFirstLastSplit[2] || senatorFirstLastSplit[1],
        web: $(doc).find(".c-find-my-senator--senator-link").first().attr("href")
      };
      this.setState({senatorInfo: repObj})
      this.getBillTotal();
    })
    .fail(response => {
      var doc = $.parseHTML(response.responseText)
      var name = $(doc).find(".c-find-my-senator--senator-link").first().text().trim();
      var district = $(doc).find(".c-find-my-senator--senator-link").first().parent().siblings().text().slice(-2)
      var website = $(doc).find(".c-find-my-senator--senator-link").first().attr("href")

      var senatorFirstLastSplit = name.split(" ");
      if (senatorFirstLastSplit.length > 2) {
        var senatorFirstLast = senatorFirstLastSplit[0] + " " + senatorFirstLastSplit[2];
      }
      var repObj = {
        district: $(doc).find(".c-find-my-senator--senator-link").first().parent().siblings().text().slice(-2),
        fullName: name,
        firstLast: senatorFirstLast || name,
        short: senatorFirstLastSplit[2] || senatorFirstLastSplit[1],
        web: $(doc).find(".c-find-my-senator--senator-link").first().attr("href")
      };
      this.setState({senatorInfo: repObj})
      this.getBillTotal();
    })
  }
  // NOTE: This version of the scrape uses the board of elections fusion table
  // getSenator(latLng) {
  //   $.ajax({
  //     url: "https://www.googleapis.com/fusiontables/v1/query?sql=SELECT%20DISTRICT%2C%20REP_NAME%2C%20REP_URL%2C%20POPULATION%20%20%20FROM%201KfhMo_HSAp3kq5Yayca22HrIhEjJLa_c_s6jd2Q%20%20WHERE%20geometry%20not%20equal%20to%20%27%27%20AND%20ST_INTERSECTS(geometry%2C%20CIRCLE(LATLNG(" + latLng + ")%2C1))&callback=MapsLib.displayListnysen&key=AIzaSyAHOjsb-JbuJn1lC6OzUNH-jlDT_KA_FwE&callback=jQuery17106865557795366708_1476457349224&_=1476457378113",
  //     method: 'get'
  //   })
  //   .done(function(response) {
  //     var foundRep = response;
  //     foundRep = $.parseJSON(foundRep.slice(41, -2));
  //     foundRep = foundRep.rows[0];
  //     // var foundRep = [42, "Susan J. Serino", "www.google.com", "222,333"]
  //     var senatorFirstLast = foundRep[1].split(" ");
  //     var senatorFirstLast = senatorFirstLast[0] + " " + senatorFirstLast[2];
  //     var repObj = {
  //       district: foundRep[0],
  //       fullName: foundRep[1],
  //       firstLast: senatorFirstLast,
  //       web: foundRep[2],
  //       population: foundRep[3]
  //   };
  //     foundRep.push(senatorFirstLast);
  //     this.setState({senatorInfo: repObj});
  //     // save district to its own state
  //     // retrieve later when non-default year is specified
  //     this.getBillTotal();


  //   }.bind(this))
  //   .fail(function(response) {
  //   }.bind(this));
  // }

  // getAssembly(latLng) {
  //   $.ajax({
  //     url: "https://www.googleapis.com/fusiontables/v1/query?sql=SELECT%20DISTRICT%2C%20REP_NAME%2C%20REP_URL%2C%20POPULATION%20%20%20FROM%2017nwTkaJDQ5AyfTtnX96SeBzRNZRekwKeonIZHvw%20%20WHERE%20geometry%20not%20equal%20to%20%27%27%20AND%20ST_INTERSECTS(geometry%2C%20CIRCLE(LATLNG(" + latLng + ")%2C1))&callback=MapsLib.displayListass&key=AIzaSyAHOjsb-JbuJn1lC6OzUNH-jlDT_KA_FwE&callback=jQuery1710929156077118652_1476403682128&_=1476403735798",
  //     method: 'get'
  //   })
  //   .done(function(response) {
  //   }).fail(function(response) {
  //     var foundRep = response.responseText;
  //     foundRep = $.parseJSON(foundRep.slice(39, -2));
  //     foundRep = foundRep.rows[0];
  //   });
  // }

  // getCongress(latLng) {
  //   $.ajax({
  //     url: "https://www.googleapis.com/fusiontables/v1/query?sql=SELECT%20DISTRICT%2C%20REP_NAME%2C%20REP_URL%2C%20POPULATION%20%20%20FROM%201GFWTwdhLbQ8yprvFNe-XNkrm1Ik-vPFFynaxg3g%20%20WHERE%20geometry%20not%20equal%20to%20%27%27%20AND%20ST_INTERSECTS(geometry%2C%20CIRCLE(LATLNG(" + latLng + ")%2C1))&callback=MapsLib.displayListcon&key=AIzaSyAHOjsb-JbuJn1lC6OzUNH-jlDT_KA_FwE&callback=jQuery17106865557795366708_1476457349225&_=1476457378114",
  //     method: 'get'
  //   })
  //   .done(function(response) {
  //   }).fail(function(response) {
  //     var foundRep = response.responseText;
  //     foundRep = $.parseJSON(foundRep.slice(39, -2));
  //     foundRep = foundRep.rows[0];
  //   });
  // }

  senatorChange(chosenBillYear, chosenSessionYear){

    if (!this.state.bills[chosenBillYear]) {
      $.fn.fullpage.moveSlideLeft();
      this.setState({showLoading: true, showForm: false});
    }

    var district = this.state.senatorInfo.district;
    $.ajax({
      url: "http://legislation.nysenate.gov/api/3/members/search?term=districtCode:" + district +" AND chamber:'SENATE' AND sessionYear:" + chosenSessionYear + "&key=042A2V22xkhJDsvE22rtOmKKpznUpl9Y&full=true",
      method: "GET"
    })
    .done(function(response) {

      var senatorName = response.result.items[0].fullName;
      var districtCode = response.result.items[0].districtCode;
      var splitName = senatorName.split(" ")
      if (splitName.length > 2) {
        var formattedName = splitName[0] + "-" + splitName[1][0] + "-" + splitName[2]
      } else { var formattedName = splitName[0] + "-" + splitName[1]}
      

      if (this.state.senatorInfo.short !== splitName[1] && this.state.senatorInfo.short !== splitName[2])
      this.setState({
        senatorInfo: { fullName: senatorName, district: districtCode, web: "https://www.nysenate.gov/senators/" +  formattedName}
      })

      if (this.state.bills[this.state.year.billYear]) {
        var cleanCloserVoteBills = this.state.bills[this.state.year.billYear].filter(bill => Math.abs(bill.yay - bill.nay) < 20);
        this.setState({ currentBills: cleanCloserVoteBills })
      }
      else { this.getBillTotal(); }
      // else { this.getBills(); }

    }.bind(this))
  }

  yearChange(event){
    if (this.state.senatorInfo.fullName) {
      var chosenYear = event.target.value;
      var chosenBillYear = parseInt(chosenYear);

      if (chosenBillYear % 2 === 0) { var chosenSessionYear = chosenBillYear - 1 }
      else { var chosenSessionYear = chosenBillYear }

      this.setState({
        year: { billYear: chosenBillYear, sessionYear: chosenSessionYear}, closeVoteClicked: false, sponsoredClicked: false, yearClicked: true, keywordClicked: false, showLoadingLine: true
      });

      this.senatorChange(chosenBillYear, chosenSessionYear)
    }
    else { return null }
  }

  compare(a, b) {
    if (a.date < b.date)
      return 1;
    if (a.date> b.date)
      return -1;
    return 0;
  }

  getBillTotal() {
    $.ajax({
      url: "http://legislation.nysenate.gov/api/3/bills/" + this.state.year.sessionYear +"/search?term=\\*voteType:'FLOOR'%20AND%20year:" + this.state.year.billYear + "&key=042A2V22xkhJDsvE22rtOmKKpznUpl9Y&limit=1",
      method: "GET"
    })
    .done(function(response) {
      var billTotal = response.total;
      var allBillz = [];
      var billYear = parseInt(this.state.year.billYear);
      var sessionYear = parseInt(this.state.year.sessionYear)
      for (var i = 1; i < Math.ceil(billTotal/100); i+=1) {
        let offset = i * 100
        if ( i === 1) { allBillz.push($.get("http://legislation.nysenate.gov/api/3/bills/" + sessionYear +"/search?term=\\*voteType:'FLOOR'%20AND%20year:" + billYear + "&key=042A2V22xkhJDsvE22rtOmKKpznUpl9Y&offset=" + i + "&limit=100&full=true"))
      } else {
        allBillz.push($.get("http://legislation.nysenate.gov/api/3/bills/" + sessionYear +"/search?term=\\*voteType:'FLOOR'%20AND%20year:" + billYear + "&key=042A2V22xkhJDsvE22rtOmKKpznUpl9Y&offset=" + offset + "&limit=100&full=true"))
        }
      }
      let test = []
      Promise.all(allBillz).then(billGlobs => {
        var allCleanBills = [];
        billGlobs.forEach(billGlob => {
          var allBills = billGlob.result.items;

          var nays = allBills.map(bill => bill.result.votes.items[bill.result.votes.items.length-1].memberVotes.items.NAY);
          var naysArray = nays.map(function(votes) { if (votes === undefined) { return votes = {size: 0} } else { return votes } });

          var yays = allBills.map(bill => bill.result.votes.items[bill.result.votes.items.length-1].memberVotes.items.AYE);
          var yaysArray = yays.map(function(votes) { if (votes === undefined) { return votes = {size: 0} } else { return votes } });

          var senatorVotes = allBills.map(bill => {
            if (bill.result.votes.items[bill.result.votes.items.length-1].memberVotes.items.AYE && bill.result.votes.items[bill.result.votes.items.length-1].memberVotes.items.AYE.items.filter(senator => senator.fullName === this.state.senatorInfo.fullName || senator.fullName === this.state.senatorInfo.firstLast || senator.shortName.toUpperCase() === this.state.senatorInfo.short).length > 0) { return "yay" }
            else if (bill.result.votes.items[bill.result.votes.items.length-1].memberVotes.items.NAY && bill.result.votes.items[bill.result.votes.items.length-1].memberVotes.items.NAY.items.filter(senator => senator.fullName === this.state.senatorInfo.fullName || senator.fullName === this.state.senatorInfo.firstLast || senator.shortName === this.state.senatorInfo.short).length > 0) { return "nay" }
            else { return "n/a" }
          })

          var billSponsors = allBills.map(bill => {
            if (bill.result.sponsor.member !== null) { return bill.result.sponsor.member.fullName }
            else { return "n/a" }
          })

          var cleanBills = allBills.map((bill, i) => {
            return {
                    title: bill.result.title,
                    year: bill.result.year,
                    yay: yaysArray[i].size,
                    nay: naysArray[i].size,
                    senatorDecision: senatorVotes[i],
                    summary: bill.result.summary.slice(0, (bill.result.title.length * 2)) + "...",
                    status: bill.result.status.statusDesc,
                    date: bill.result.status.actionDate,
                    sponsor: billSponsors[i],
                    session: bill.result.session,
                    billId: bill.result.printNo
                  }
               });
          allCleanBills =[...allCleanBills, ...cleanBills]
        })

          allCleanBills.sort(this.compare)

          var closeVoteBills = allCleanBills.filter(bill => (Math.abs(bill.yay - bill.nay) < 20) && (bill.yay + bill.nay > 30))

          // var closeVoteBills = [{
          //   title: "title 1",
          //   year: 2016,
          //   yay: 30,
          //   nay: 20,
          //   senatorDecision: 'YAY',
          //   summary: "summary 1",
          //   status: "signed",
          //   date: "11-11-2016",
          //   sponsor: "this guy",
          //   session: 2015,
          //   vbillId: "1234"
          // },
          // {
          //   title: "title 2",
          //   year: 2016,
          //   yay: 30,
          //   nay: 20,
          //   senatorDecision: 'YAY',
          //   summary: "summary 2",
          //   status: "signed",
          //   date: "11-11-2016",
          //   sponsor: "this guy",
          //   session: 2015,
          //   vbillId: "1234"
          // },
          // {
          //   title: "title 3",
          //   year: 2016,
          //   yay: 30,
          //   nay: 20,
          //   senatorDecision: 'YAY',
          //   summary: "summary 3",
          //   status: "signed",
          //   date: "11-11-2016",
          //   sponsor: "this guy",
          //   session: 2015,
          //   vbillId: "1234"
          // }

          // ]

          this.setState({showLoading: false, showForm: true, showLoadingLine: false});
          this.setState({
            currentBills: closeVoteBills
          })
          var billsStateVar = this.state.bills;
          billsStateVar[this.state.year.billYear] = allCleanBills;
          // billsStateVar[this.state.year.billYear] = closeVoteBills;
          $.fn.fullpage.moveSlideRight();
          this.setState({
            bills: billsStateVar
          });
      })
    }.bind(this))
  }




  componentDidMount(){
    $('#fullpage').fullpage({scrollOverflow: true, autoScrolling: false, fitToSection: false})
  }

  closeBillsClicked() {
    if (this.state.senatorInfo.fullName) {
      var closeVoteBills = this.state.bills[this.state.year.billYear].filter(bill => (Math.abs(bill.yay - bill.nay) < 20) && (bill.yay + bill.nay > 30));

      this.setState({
        currentBills: closeVoteBills,
        closeVoteClicked: true,
        yearClicked: false,
        sponsoredClicked: false,
        keywordClicked: false
      })
    }
    else { return null }
  }

  sponsoredClicked() {
    if (this.state.senatorInfo.fullName) {
      var senatorSponsoredBills = this.state.bills[this.state.year.billYear].filter(bill => bill.sponsor === this.state.senatorInfo.firstLast || bill.sponsor === this.state.senatorInfo.fullName  || bill.sponsor.includes(this.state.senatorInfo.short));

      this.setState({
        currentBills: senatorSponsoredBills,
        sponsoredClicked: true,
        closeVoteClicked: false,
        yearClicked: false,
        keywordClicked: false
      })
    }
    else { return null }
  }

  keywordSearch(event) {
    event.preventDefault();
    var searchTerm = this.refs.keywordBox.value;
    var keywordSearchBills = this.state.bills[this.state.year.billYear].filter(bill => bill.summary.includes(searchTerm));
    this.setState({
      currentBills: keywordSearchBills,
      showKeywordSearchForm: false
    })
  }

  showKeywordForm() {
    if (this.state.senatorInfo.fullName) {
      this.setState({showKeywordSearchForm: true, keywordClicked: true, closeVoteClicked: false, sponsoredClicked: false, yearClicked: false})
    }
    else { return null }
  }

    render() {
        if (this.state.closeVoteClicked) {
            var closeVoteClickedClass = " clickedOn";
        } else {
            var closeVoteClickedClass = "";
        }

        if (this.state.sponsoredClicked) {
            var sponsoredClickedClass = " clickedOn";
        } else {
            var sponsoredClickedClass = "";
        }

        if (this.state.yearClicked) {
            var yearClickedClass = " clickedOn";
        } else {
            var yearClickedClass = "";
        }

        if (this.state.keywordClicked) {
            var keywordClickedClass = " clickedOn";
        } else {
            var keywordClickedClass = "";
        }

        if (this.state.showLoadingLine) {
            var loadingText = "Fetching bill info...";
        } else {
            var loadingText = "";
        }

      if (this.state.showKeywordSearchForm) {
            var timelineFilters = <div className='row' id='keywordDiv'><form className='keyword-search' id='keyword-search-form' type='button' onSubmit={this.keywordSearch}><div className='keyword-search-box input-field col s9'><label htmlFor='keywordBox'>Search for bills by keyword</label><input ref='keywordBox' name='keywordBox' id='keywordBox' type='text'/></div><div className='col s3 waves-effect waves-light btn' id='supaDupaButton'><input type='submit' value='search'/></div></form></div>
      } else {
            var timelineFilters =
            <ul className="row">
                <li className="col s3">
                    <a id="closeVoteButton" className={"waves-effect waves-light btn"+closeVoteClickedClass} onClick={this.closeBillsClicked}>close vote bills</a>
                </li>

                <li className="col s3">
                    <a className={"waves-effect waves-light btn"+sponsoredClickedClass} onClick={this.sponsoredClicked}>Sponsored bills</a>
                </li>

                <li className="col s3">
                    <a className={"waves-effect waves-light btn"+keywordClickedClass} onClick={this.showKeywordForm}>Keyword Search</a>
                </li>

                <li id="year-search" className="input-field col s3">
                    <select className={yearClickedClass} onChange={this.yearChange} value={this.state.year.billYear}>
                        <option value="Choose your option" disabled></option>
                        <option value="2009">2009</option>
                        <option value="2010">2010</option>
                        <option value="2011">2011</option>
                        <option value="2012">2012</option>
                        <option value="2013">2013</option>
                        <option value="2014">2014</option>
                        <option value="2015">2015</option>
                        <option value="2016">2016</option>
                    </select>
                </li>
            </ul>

      }


    return(
      <div ref="test" id="fullpage">
        <div className="section">
          <div id="landingPageBG" className="slide">
            <AddressForm hideIt={this.state.showForm} getAddress={this.getSenator}/> :
            {/* { this.state.showLoading ? <Loading /> : null } */}
            <h2 id="loading-line">{loadingText}</h2>
            <h1 id="main-font">STATE MATTERS</h1>
          </div>
          <div id="page2BG" className="slide">

            <Timeline bills={this.state.currentBills} year={this.state.year} senatorInfo={this.state.senatorInfo} timelineFilters={timelineFilters} closeVoteClicked={this.state.closeVoteClicked}/>

          </div>
          <div className="fp-controlArrow fp-next"></div>
          <div className="fp-controlArrow fp-next"></div>
        </div>
      </div>
    )
  }
}

export default App;
