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
      <div style={this.formStyle()} onSubmit={this.handleSubmit}>
        <form>
          <label htmlFor="address">Address Line 1:</label>
          <input name="address" ref="address" type="text"></input>
          <label htmlFor="city">City:</label>
          <input name="city" ref="city" type="text"></input>
          <label htmlFor="zip">Zip 5</label>
          <input name="zip" ref="zip" type="text"></input>
          <input type="submit" value="Find my State Reps"></input>
        </form>
    </div>
    )
  }
}

export default AddressForm;
