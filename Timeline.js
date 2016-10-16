import React from 'react';

class Timeline extends React.Component {



  render() {
    let {bills} = this.props
    return(
      <div>
        <section className="intro">
          <div className="container">
            <h1>Vertical Timeline &darr;</h1>
          </div>
        </section>

        <section className="timeline">
          <ul>
            {bills.map((bill, idx) => <Bill data={bill} key={idx} supaKey={idx} othaSupaKey={idx+1000} />)}
          </ul>
        </section>
      </div>
    )
  }
}

export default Timeline;
