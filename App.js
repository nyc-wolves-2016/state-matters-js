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
    this.geocodeIt = this.geocodeIt.bind(this);
    this.compare = this.compare.bind(this);
    // this.getBills = this.getBills.bind(this);
    this.getBillTotal = this.getBillTotal.bind(this);
    this.closeBillsClicked = this.closeBillsClicked.bind(this);
    this.sponsoredClicked = this.sponsoredClicked.bind(this);
    this.keywordSearch = this.keywordSearch.bind(this);
    this.yearChange = this.yearChange.bind(this);
    this.showKeywordForm = this.showKeywordForm.bind(this);
    this.senatorChange = this.senatorChange.bind(this);
    this.checkForMobile = this.checkForMobile.bind(this);
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

  geocodeIt(fullAddress){
    this.setState({showLoading: true, showForm: false, showLoadingLine: true})
    $.ajax({
      url: 'https://www.googleapis.com/civicinfo/v2/representatives/?key=AIzaSyAiRgU_ysVxPfbMqVQnOEeN4-aLW4OMEw4&roles=legislatorUpperBody&address=' + fullAddress
    })
    .done(response => {
      var name = response.officials[2].name
      var district = []
      for (var key in response.divisions) {if (response.divisions[key].name.includes("New York State Senate district")) {district.push(response.divisions[key].name)}}
      var districtStr = district.toString()
      var districtNum = districtStr.slice(districtStr.length-2, districtStr.length)
      var senatorFirstLastSplit = name.split(" ");
      if (senatorFirstLastSplit.length > 2) {
        var senatorFirstLast = senatorFirstLastSplit[0] + " " + senatorFirstLastSplit[2];
      }
      var repObj = {
          district: districtNum,
          fullName: name,
          firstLast: senatorFirstLast || name,
          short: senatorFirstLastSplit[2] || senatorFirstLastSplit[1],
          web: response.officials[2].urls[0]
      }
      this.setState({senatorInfo: repObj})
      this.getBillTotal();
    })
  }

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

    if (!this.state.bills[chosenBillYear] && !this.checkForMobile()) {
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
            if (bill.result.votes.items[bill.result.votes.items.length-1].memberVotes.items.AYE && bill.result.votes.items[bill.result.votes.items.length-1].memberVotes.items.AYE.items.filter(senator => senator.fullName === this.state.senatorInfo.fullName || senator.fullName === this.state.senatorInfo.firstLast).length > 0) { return "yay" }
            else if (bill.result.votes.items[bill.result.votes.items.length-1].memberVotes.items.NAY && bill.result.votes.items[bill.result.votes.items.length-1].memberVotes.items.NAY.items.filter(senator => senator.fullName === this.state.senatorInfo.fullName || senator.fullName === this.state.senatorInfo.firstLast).length > 0) { return "nay" }
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
          if (!this.checkForMobile()) {
            $.fn.fullpage.moveSlideRight();
          }
          this.setState({
            bills: billsStateVar
          });
      })
    }.bind(this))
  }

  checkForMobile() {
    var isMobile = false;
    if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) { isMobile = true };
      return isMobile;
  }




  componentDidMount(){
    if (!this.checkForMobile()) {
      $('#fullpage').fullpage({scrollOverflow: true, autoScrolling: false, fitToSection: false})
    }
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
    debugger;
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
            <AddressForm hideIt={this.state.showForm} getAddress={this.geocodeIt}/> :
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
