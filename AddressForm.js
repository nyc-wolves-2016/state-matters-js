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
    if (this.props.senatorInfo) {
      if (this.refs.address.value.length > 0 && this.refs.city.value.length > 0) {
        var fullAddress = this.refs.address.value + ' ' + this.refs.city.value + ' ' + this.refs.zip.value
        this.refs.address.value = ''
        this.refs.city.value = ''
        this.refs.zip.value = ''
        this.props.getAddress(fullAddress)
      }
      else { return null }
    }
    else { return null }
  }

  render() {
    return(
        <div className="materialize">
          <div id="main-form" className="row" style={this.formStyle()}>
              <form onSubmit={this.handleSubmit} className="col s12" autoComplete="off">

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

                <button id="supaButton" className="btn waves-effect waves-light" type="submit" name="action">Find My State Senator
                    <i className="material-icons right">send</i>
                </button>

              </form>
        </div>
      </div>
    )
  }
}

export default AddressForm;
