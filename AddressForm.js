import React from 'react';

class AddressForm extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.formStyle = this.formStyle.bind(this);
  }

  formStyle() {
    if  (this.props.hideIt) {
      return {
        display: ""
      }
    } else {
      return {
        display: "none"
      }
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    var fullAddress = this.refs.address.value + ' ' + this.refs.city.value + ' ' + this.refs.zip.value
    this.refs.address.value = ''
    this.refs.city.value = ''
    this.refs.zip.value = ''
    this.props.getAddress(fullAddress)
  }

  render() {
    return(
        <div className="materialize">
          <div id="main-form" className="row">
              <form onSubmit={this.handleSubmit} className="col s12">

                <div className="row">
                  <div className="input-field col s5">
                    <input name="address" ref="address" id="address" type="text" className="validate" />
                    <label htmlFor="address">Address</label>
                  </div>

                  <div className="input-field col s5">
                    <input name="city" ref="city" id="city" type="text" className="validate" />
                    <label htmlFor="city">City</label>
                  </div>

                  <div className="input-field col s2">
                    <input name="zip" ref="zip" id="zip" type="text" className="validate" />
                    <label htmlFor="zip">Zip</label>
                  </div>
                </div>

                <button id="supaButton" className="btn waves-effect waves-light" type="submit" name="action">Find My Reps
                    <i className="material-icons right">send</i>
                </button>

              </form>
        </div>
      </div>
    )
  }
}

export default AddressForm;
