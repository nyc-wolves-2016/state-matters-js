import React from 'react';

class RepInfoDisplay extends React.Component {
  constructor() {
    super();
  }

  render() {
    let {fullName, district, web} = this.props.repDisplay
    return (


        // <div className="materialize" id="rep-info">
        //     <ul id="repInfoUL" className="collection row">
        //
        //       <li className="collection-item avatar col s4">
        //         <i className="material-icons circle">person_pin</i>
        //         <span className="title">Senator</span>
        //         <p>{fullName}</p>
        //       </li>
        //
        //       <li className="collection-item avatar col s4">
        //         <i className="material-icons circle">folder</i>
        //         <span className="title">District</span>
        //         <p>{district}</p>
        //       </li>
        //
        //       <li className="collection-item avatar col s4">
        //         <i className="material-icons circle">language</i>
        //         <span className="title">Senator Website</span>
        //         <p id="senatorLink"><a href={web}>{web}</a></p>
        //       </li>
        //
        //     </ul>
        // </div>

        <div id="rep-info">
          <li>Your Senator: {fullName}</li>
          <li>Your District: {district}</li>
          <li><a href={web}>Your Senator's Website</a></li>
        </div>


    )
  }


}

export default RepInfoDisplay;
