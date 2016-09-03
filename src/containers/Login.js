/**
 * # Login.js
 *
 *  The container to display the Login form
 *
 */
'use strict';
/**
 * ## Imports
 *
 * Redux
 */
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {GoogleSignin} from 'react-native-google-signin';

/**
 * The actions we need
 */
import * as authActions from '../reducers/auth/authActions';

/**
 * Immutable
 */
import {Map} from 'immutable';
const {
  LoginManager,
  GraphRequest,
  GraphRequestManager
} = require('react-native-fbsdk');
/**
 *   LoginRender
 */
import LoginRender from '../components/LoginRender';
import ErrorAlert from '../components/ErrorAlert';
/**
 * The necessary React components
 */
import React from 'react';


const {
  LOGIN,
  REGISTER,
  FORGOT_PASSWORD
} = require('../lib/constants').default;

const {GOOGLE_ID} = require('../lib/config');
/**
 * ## Redux boilerplate
 */
const actions = [
  authActions
];

function mapStateToProps(state) {
  return {
      ...state
  };
}

function mapDispatchToProps(dispatch) {
  const creators = Map()
          .merge(...actions)
          .filter(value => typeof value === 'function')
          .toObject();

  return {
    actions: bindActionCreators(creators, dispatch),
    dispatch
  };
}

function buttonPressHandler(login, email, password) {
  login (email, password);
}

let Login = React.createClass({
  render() {
    this.errorAlert = new ErrorAlert();
    let loginButtonText = 'Login';
    let onButtonPress = buttonPressHandler.bind(null,
				                this.props.actions.login,
				                this.props.auth.form.fields.email,
				                this.props.auth.form.fields.password
		                               );
    let fbLoginAction = () => {
      console.log('FB login');
      LoginManager.logInWithReadPermissions(['public_profile']).then(
       (loginResult) => {
         if (loginResult.isCancelled) {
           this.errorAlert.checkError('Login cancelled');
         } else {
           console.log('Login success with permissions: '
             +loginResult.grantedPermissions.toString());
             const _responseInfoCallback = (error, result) => {
               if (error) {
                this.errorAlert.checkError('Error fetching data: ' + error.toString());
               } else {
                 let data = {};
                console.log('Success fetching data: ' , result);
                data.loginType = 'fbId';
                data.loginId = result.id;
                data.email = result.email;
                data.fullname = result.name;
                this.props.actions.loginWithSocial(data);
               }
             };
             const infoRequest = new GraphRequest(
              '/me?fields=id,name,email', //picture.type(large),gender
              null,
              _responseInfoCallback
            );
           new GraphRequestManager().addRequest(infoRequest).start();
         }
       },
       (error) => {
         this.errorAlert.checkError('Login fail with error: ' + error);
       }
     );
    };
    let gLoginAction = () => {
      console.log('google login');
      GoogleSignin.configure({
        iosClientId: GOOGLE_ID, // only for iOS
      })
      .then(() => {
        // you can now call currentUserAsync()
        return GoogleSignin.signIn().then((user) => {
          let data = {};
          console.log('Success user fetching data: ', user);
          data.loginType = 'gId';
          data.loginId = user.id;
          data.email = user.email;
          data.fullname = user.name;
          this.props.actions.loginWithSocial(data);
        }, (error) => {
          this.errorAlert.checkError('Login fail with error: ' + error);
        });

      }, (error) => {
        this.errorAlert.checkError('Login fail with error: ' + error);
      });

    };
    return(
      <LoginRender
          formType={ LOGIN }
          loginButtonText={ loginButtonText }
          onButtonPress={ onButtonPress }
          displayPasswordCheckbox={ true }
          rightMessageType={ REGISTER }
          leftMessageType={ FORGOT_PASSWORD }
          facebookLogin={fbLoginAction.bind(this)}
          googleLogin={gLoginAction.bind(this)}
          auth={ this.props.auth }
          global={ this.props.global }
      />
    );
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
