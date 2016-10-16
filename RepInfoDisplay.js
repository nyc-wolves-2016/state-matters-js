import React from 'react';

class RepInfoDisplay extends React.Component {
  constructor() {
    super();
  }

  render() {
    let {repDisplay} = this.props
    return (
      <ul>
        <li>SENATOR: {repDisplay[1]}</li>
        <li>DISTRICT: {repDisplay[0]}</li>
        <li>WEBSITE: {repDisplay[2]}</li>
      </ul>
    )
  }


}

export default RepInfoDisplay;
