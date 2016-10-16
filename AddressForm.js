import React from 'react';

class AddressForm extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
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
      <form onSubmit={this.handleSubmit}>
        <label htmlFor="address">Address Line 1:</label>
        <input name="address" ref="address" type="text"></input>
        <label htmlFor="city">City:</label>
        <input name="city" ref="city" type="text"></input>
        <label htmlFor="zip">Zip 5</label>
        <input name="zip" ref="zip" type="text"></input>
        <input type="submit" value="Find my State Reps"></input>
      </form>
    )
  }
}

export default AddressForm;
