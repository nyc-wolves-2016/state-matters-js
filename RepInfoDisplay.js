import React from 'react';

class RepInfoDisplay extends React.Component {
  constructor() {
    super();
  }

  render() {
    let {fullName, district, web} = this.props.repDisplay
    return (


        <div className="materialize" id="rep-info">
            <ul id="repInfoUL" className="collection row">
        
              <li className="collection-item avatar col s4">

                <span className="title">Your State Senator</span>
                <p>{fullName}</p>
              </li>
        
              <li className="collection-item avatar col s4">

                <span className="title">District</span>
                <p>{district}</p>
              </li>
        
              <li className="collection-item avatar col s4">


                <p id="senatorLink"><a href={web}>Your Senator's Website</a></p>
              </li>
        
            </ul>
        </div>

        // <div id="rep-info">
        //     <ul>
        //       <li>Your Senator: {fullName}</li>
        //       <li>Your District: {district}</li>
        //       <li><a href={web}>Your Senator's Website</a></li>
        //     </ul>
        // </div>


    )
  }


}

export default RepInfoDisplay;
