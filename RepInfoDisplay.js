import React from 'react';

class RepInfoDisplay extends React.Component {
  constructor() {
    super();
  }

  render() {
    let {repDisplay} = this.props
    return (
        //   <ul id="rep-info">
        //     <li>SENATOR: {repDisplay[1]}</li>
        //     <li>DISTRICT: {repDisplay[0]}</li>
        //     <i className="material-icons">language</i>
        //     <li>WEBSITE: {repDisplay[2]}</li>
        //   </ul>

        <div className="materialize" id="rep-info">
            <ul className="collection row">

              <li className="collection-item avatar col s4">
                <img src="babyMonkey.jpg" alt="" className="circle" />
                <span className="title">Senator</span>
                <p>{repDisplay[1]}</p>
              </li>

              <li className="collection-item avatar col s4">
                <i className="material-icons circle green">folder</i>
                <span className="title">District</span>
                <p>{repDisplay[0]}</p>
              </li>

              <li className="collection-item avatar col s4">
                <i className="material-icons circle green">language</i>
                <span className="title">Website</span>
                <p>{repDisplay[2]}</p>
              </li>

            </ul>
        </div>

    )
  }


}

export default RepInfoDisplay;
