/**
 * # LoginForm.js
 *
 * This class utilizes the ```tcomb-form-native``` library and just
 * sets up the options required for the 3 states of Login, namely
 * Login, Register or Reset Password
 *
 */
'use strict';
/**
 * ## Import
 *
 * React
 */
const React = require('react');
const {
  PropTypes
} = React;

/**
 * States of login display
 */
const {
  REGISTER,
  LOGIN,
  FORGOT_PASSWORD
} = require('../lib/constants').default;

import {InputGroup, Input} from 'native-base';
import templates from './NativeTemplates';
/**
 *  The fantastic little form library
 */
const t = require('tcomb-form-native');
let Form = t.form.Form;

var LoginForm = React.createClass({
  /**
   * ## LoginForm class
   *
   * * form: the properties to set into the UI form
   * * value: the values to set in the input fields
   * * onChange: function to call when user enters text
   */
  propTypes: {
    formType: PropTypes.string,
    form: PropTypes.object,
    value: PropTypes.object,
    onChange: PropTypes.func
  },

  /**
   * ## render
   *
   * setup all the fields using the props and default messages
   *
   */
  render() {

    let formType = this.props.formType;
    let nativeTextbox = templates.nativeTextbox;

    let options = {
      auto: 'placeholders',
      fields: {

      }
    };

    let fullName = {
      editable: !this.props.form.isFetching,
      template: nativeTextbox
    };

    let email = {
      keyboardType: 'email-address',
      editable: !this.props.form.isFetching,
      hasError: this.props.form.fields.emailHasError,
      error: 'Please enter valid email',
      template: nativeTextbox
    };

    /*let secureTextEntry = !this.props.form.fields.showPassword;*/

    let password = {
      maxLength: 12,
      secureTextEntry: true,
      /*secureTextEntry: secureTextEntry,*/
      editable: !this.props.form.isFetching,
      /*hasError: this.props.form.fields.passwordHasError,
      error: 'Must have 6-12 characters with at least 1 number and 1 special character',*/
      template: nativeTextbox
    };

    /*let passwordAgain= {
      secureTextEntry: secureTextEntry,
      maxLength: 12,
      editable: !this.props.form.isFetching,
      hasError: this.props.form.fields.passwordAgainHasError,
      error: 'Passwords must match',
      template: nativeTextbox
    };*/

    let loginForm;

    switch(formType) {
      /**
       * ### Registration
       * The registration form has 4 fields
       */
    case(REGISTER):
      loginForm = t.struct({
        fullname: t.String,
        email: t.String,
        password: t.String/*,
        passwordAgain: t.String*/
      });
      options.fields['fullname'] = fullName;
      options.fields['email'] = email;
      options.fields['password'] = password;
      /*options.fields['passwordAgain'] = passwordAgain;*/
      break;

      /**
       * ### Login
       * The login form has only 2 fields
       */
    case(LOGIN):
      loginForm = t.struct({
        email: t.String,
        password: t.String
      });
      options.fields['email'] = email;
      options.fields['password'] = password;
      break;

      /**
       * ### Reset password
       * The password reset form has only 1 field
       */
    case(FORGOT_PASSWORD):
      loginForm = t.struct({
        email: t.String
      });
      options.fields['email'] = email;
      break;
    } //switch

    /**
     * ### Return
     * returns the Form component with the correct structures
     */
    return (
        <Form ref="form"
      type={loginForm}
      options={options}
      value={this.props.value}
      onChange={this.props.onChange}
        />

    );
  }
});

module.exports = LoginForm;
