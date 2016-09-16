/**
 * # Login.js
 *
 * This class is a little complicated as it handles multiple states.
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

/**
 * The actions we need
 */
import * as authActions from '../reducers/auth/authActions';
import * as globalActions from '../reducers/global/globalActions';

/**
 * Immutable
 */
import {Map} from 'immutable';

/**
 * Router actions
 */
import { Actions } from 'react-native-router-flux';

/**
 * The Header will display a Image and support Hot Loading
 */
import Header from '../components/Header';
/**
 * The ErrorAlert displays an alert for both ios & android
 */
import ErrorAlert from '../components/ErrorAlert';
/**
 * The FormButton will change it's text between the 4 states as necessary
 */
import FormButton from '../components/FormButton';
/**
 *  The LoginForm does the heavy lifting of displaying the fields for
 * textinput and displays the error messages
 */
import LoginForm from '../components/LoginForm';
/**
 * The itemCheckbox will toggle the display of the password fields
 */
import ItemCheckbox from '../components/ItemCheckbox';

/**
 * The necessary React components
 */
import React, {Component} from 'react';
import
{
  StyleSheet,
  ScrollView,
  TouchableHighlight,
  View,
  Text
}
from 'react-native';

import {Container, Content, Button, Icon, Grid, Row, Col} from 'native-base';

import Dimensions from 'Dimensions';
var {height, width} = Dimensions.get('window'); // Screen dimensions in current orientation

import Layout from './Layout';
/**
 * The states were interested in
 */
const {
  LOGIN,
  REGISTER,
  FORGOT_PASSWORD
} = require('../lib/constants').default;

/**
 * ## Styles
 */
var styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    paddingTop: 10
  },
  inputs: {
    marginTop: 10,
    marginBottom: 10
  },
  forgotContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10
  }
});
/**
 * ## Redux boilerplate
 */
const actions = [
  authActions,
  globalActions
];

function mapStateToProps(state) {
  return {
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

class LoginRender extends Component {
  constructor(props) {
    super(props);
    this.errorAlert = new ErrorAlert();
    this.state ={
      value: {
        fullname: this.props.auth.form.fields.fullname,
        email: this.props.auth.form.fields.email,
        password: this.props.auth.form.fields.password/*,
        passwordAgain: this.props.auth.form.fields.passwordAgain*/
      }
    };
  }

  /**
   * ### componentWillReceiveProps
   * As the properties are validated they will be set here.
   */
  componentWillReceiveProps(nextprops) {
    this.setState({
      value: {
	fullname: nextprops.auth.form.fields.fullname,
	email: nextprops.auth.form.fields.email,
	password: nextprops.auth.form.fields.password/*,
	passwordAgain: nextprops.auth.form.fields.passwordAgain*/
      }
    });
  }

  /**
   * ### onChange
   *
   * As the user enters keys, this is called for each key stroke.
   * Rather then publish the rules for each of the fields, I find it
   * better to display the rules required as long as the field doesn't
   * meet the requirements.
   * *Note* that the fields are validated by the authReducer
   */
  onChange(value) {
    if (value.fullname != '') {
      this.props.actions.onAuthFormFieldChange('fullname',value.fullname);
    }
    if (value.email != '') {
      this.props.actions.onAuthFormFieldChange('email',value.email);
    }
    if (value.password != '') {
      this.props.actions.onAuthFormFieldChange('password',value.password);
    }
    /*if (value.passwordAgain != '') {
      this.props.actions.onAuthFormFieldChange('passwordAgain',value.passwordAgain);
    }*/
    this.setState(
      {value}
    );
  }
  /**
  *  Get the appropriate message for the current action
  *  @param messageType FORGOT_PASSWORD, or LOGIN, or REGISTER
  *  @param actions the action for the message type
  */
  getMessage(messageType, actions) {
    let forgotPassword =
    <Button danger bordered rounded small style={{position: 'absolute', bottom: 30, right: 10}}
        onPress={() => {
            actions.forgotPasswordState();
            Actions.ForgotPassword();
          }} >
      <Icon name="ios-help" />
    </Button>;

    let alreadyHaveAccount = {
      action: () => {
        actions.loginState();
        Actions.Login();
      },
      msgText: 'Login'
    };

    {/*<FormButton
        buttonText = {'Login'}
        onPress={() => {
          actions.loginState();
          Actions.Login();
          }} />;*/}

    let register = {
      action: () => {
        actions.registerState();
        Actions.Register();
      },
      msgText: 'Register'
    };

    {/*<FormButton
        buttonText = {'Signup'}
        onPress={() => {
            actions.registerState();
            Actions.Register();
          }} />*/};

    switch(messageType) {
    case FORGOT_PASSWORD:
      return forgotPassword;
    case LOGIN:
      return alreadyHaveAccount;
    case REGISTER:
      return register;
    }
  }

  /**
   * ### render
   * Setup some default presentations and render
   */
  render() {
    var formType = this.props.formType;
    var loginButtonText = this.props.loginButtonText;
    var onButtonPress = this.props.onButtonPress;
    var displayPasswordCheckbox = this.props.displayPasswordCheckbox;
    var leftMessageType = this.props.leftMessageType;
    var rightMessageType = this.props.rightMessageType;
    var passwordCheckbox = <Text/>;
    let leftMessage = null;
    // let rightMessage = null;
    let fbLogin = null;
    let fbLoginAction = this.props.facebookLogin;
    let gLoginAction = this.props.googleLogin;
    let gLogin = null;
    let self = this;
    let onTransitionPress;
    let propObj = {
      isHeaderBack : this.props.isBack
    };

    if (leftMessageType) {
      leftMessage = this.getMessage(leftMessageType, this.props.actions)
    }
    if (rightMessageType) {
      let rightMessage = this.getMessage(rightMessageType, this.props.actions);
      propObj.headerRight = {
        action: rightMessage.action, text: rightMessage.msgText, isDisabled: !this.props.auth.form.isValid || this.props.auth.form.isFetching
      };
      propObj.dummyBack = true;
    }
    if (fbLoginAction) {
      let fbLogo = <Icon name="logo-facebook"/>
      fbLogin = <FormButton
                onPress={fbLoginAction}
                buttonText={fbLogo}/>;
    }
    if (gLoginAction) {
      let gLogo = <Icon name="logo-google"/>
      gLogin = <FormButton
                onPress={gLoginAction}
                buttonText={gLogo}/>;
    }
    // display the login / register / change password screens
    this.errorAlert.checkError(this.props.auth.form.error);

    /**
     * Toggle the display of the Password and PasswordAgain fields
     */
    /*if (displayPasswordCheckbox) {
      passwordCheckbox =
      <ItemCheckbox
          text="Show Password"
          disabled={this.props.auth.form.isFetching}
          onCheck={() => {
	      this.props.actions.onAuthFormFieldChange('showPassword',true);
            }}
          onUncheck={() => {
	      this.props.actions.onAuthFormFieldChange('showPassword',false);
            }}
      />;
    }*/

    /**
     * The LoginForm is now defined with the required fields.  Just
     * surround it with the Header and the navigation messages
     * Note how the button too is disabled if we're fetching. The
     * header props are mostly for support of Hot reloading.
     * See the docs for Header for more info.
     */
    return(
      <Layout {...propObj}>

      	  <Content>
      	    <View style={styles.inputs}>
      	      <LoginForm
                        formType={formType}
                        form={this.props.auth.form}
                        value={this.state.value}
                        onChange={self.onChange.bind(self)}
      	      />
              {leftMessage}
      	      {passwordCheckbox}
            </View>
            <Grid>
              <Row>
        	      <Col>
                  <FormButton
                        isDisabled={!this.props.auth.form.isValid || this.props.auth.form.isFetching}
                        onPress={onButtonPress}
                        buttonText={loginButtonText}/>
                </Col>
              </Row>
              <Row style={{marginTop: 10}}>
                <Col>{fbLogin}</Col>
                <Col>{gLogin}</Col>
              </Row>
            </Grid>
      	  </Content>
      </Layout>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(LoginRender);
