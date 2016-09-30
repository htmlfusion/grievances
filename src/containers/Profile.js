/**
 * # Profile.js
 *
 * This component provides an interface for a logged in user to change
 * their username and email.
 * It too is a container so there is boilerplate from Redux similar to
 * ```App``` and ```Login```
 */
'use strict';
/**
* ## Imports
*
* Redux
*/
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {Container, Content, Header, Button, Icon, Text, Grid, Col, Row} from 'native-base';

/**
 * The actions we need
 */
import * as profileActions from '../reducers/profile/profileActions';
import * as globalActions from '../reducers/global/globalActions';
import * as authActions from '../reducers/auth/authActions';

/**
 * Immutable Mapn
 */
import {Map} from 'immutable';
import {Actions} from 'react-native-router-flux';
/**
 * The ErrorAlert will display any and all errors
 */
import ErrorAlert from '../components/ErrorAlert';
/**
 * The FormButton will respond to the press
 */
import FormButton from '../components/FormButton';
/**
 * The Header will display a Image and support Hot Loading
 */
/*import Header from '../components/Header';*/

/**
 * The itemCheckbox will display the state of the email verified
 */
import ItemCheckbox from '../components/ItemCheckbox';
/**
 * The necessary React components
 */
import React, {Component} from 'react';
import
{
  StyleSheet,
  View
}
from 'react-native';
import {GoogleSignin} from 'react-native-google-signin';
/**
* The form processing component
*/
import t from 'tcomb-form-native';
const {GOOGLE_ID} = require('../lib/config');
import templates from '../components/NativeTemplates';
import Layout from '../components/Layout';
const {
  LoginManager,
  AccessToken
} = require('react-native-fbsdk');
let Form = t.form.Form;

/**
 * ## Styles
 */
var styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent'
  },
  btn: {
    marginTop: 8,
    marginBottom: 8
  },

  headerFont: {
    color: '#fff'
  },
  content: {
    marginTop: 10
  }
});

/**
* ## Redux boilerplate
*/
const actions = [
  profileActions,
  globalActions,
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


class Profile extends Component {
  /**
   * ## Profile class
   * Set the initial state and prepare the errorAlert
   */
  constructor(props) {
    super(props);
    this.errorAlert = new ErrorAlert();
    this.state = {
      formValues: {
        fullname: '',
        email: ''
      }
    };
  }
  /**
   * ### onChange
   *
   * When any fields change in the form, fire this action so they can
   * be validated.
   *
   */
  onChange(value) {
    this.props.actions.onProfileFormFieldChange(value);
    this.setState({formValues: value});
  }
  /**
   * ### componentWillReceiveProps
   *
   * Since the Forms are looking at the state for the values of the
   * fields, when we we need to set them
   */
  componentWillReceiveProps(props) {
    this.setState({
      formValues: {
        fullname: props.profile.form.fields.fullname,
        email: props.profile.form.fields.email
      }
    });

  }
  /**
   * ### componentDidMount
   *
   * During Hot Loading, when the component mounts due the state
   * immediately being in a "logged in" state, we need to just set the
   * form fields.  Otherwise, we need to go fetch the fields
   */
  componentDidMount() {
    if (this.props.profile.form.fields.fullname == '' && this.props.profile.form.fields.email == '') {
      this.props.actions.getProfile(this.props.global.currentUser);
    } else {
      this.setState({
        formValues: {
          fullname: this.props.profile.form.fields.fullname,
          email: this.props.profile.form.fields.email
        }
      });
    }
  }

  /**
   * ### render
   * display the form wrapped with the header and button
   */
  render() {
    this.errorAlert.checkError(this.props.profile.form.error);

    let self = this;

    let ProfileForm = t.struct({
      fullname: t.String,
      email: t.String
    });
    /**
     * Set up the field definitions.  If we're fetching, the fields
     * are disabled.
     */
    let nativeTextbox = templates.nativeTextbox;
    let options = {
      auto: 'placeholders',
      fields: {
        fullname: {
          editable: !this.props.profile.form.isFetching,
          template: nativeTextbox
        },
        email: {
          keyboardType: 'email-address',
          editable: !this.props.profile.form.isFetching,
          hasError: this.props.profile.form.fields.emailHasError,
          error: 'Please enter valid email',
          template: nativeTextbox
        }
      }
    };

    /**
     * When the button is pressed, send the users info including the
     * ```currrentUser``` object as it contains the sessionToken and
     * user objectId which Parse.com requires
     */
    let profileButtonText = 'Update Profile';
    let onButtonPress = () => {
      this.props.actions.updateProfile(
        this.props.profile.form.originalProfile.objectId,
        this.props.profile.form.fields.fullname,
        this.props.profile.form.fields.email,
        this.props.global.currentUser);
    };

    let onLogoutButtonPress = () => {
			this.props.actions.logout();
		};
    /**
     * Wrap the form with the header and button.  The header props are
     * mostly for support of Hot reloading. See the docs for Header
     * for more info.
     */
    let emailVerified = <View style={{flexDirection: 'row', alignItems: 'center'}}><Icon name="ios-alert" style={{marginRight: 5, color: '#d9534f'}}/><Text>{"Check the link in your email and verify"}</Text></View>;
     if (this.props.profile.form.originalProfile.emailVerified) {
       emailVerified = <ItemCheckbox text={"Your email has been verified"}
                         checked={this.props.profile.form.fields.emailVerified}/>;
     }
     let onFBPress = () => {
       console.log('FB login');
       LoginManager.logInWithReadPermissions(['public_profile']).then(
        (result) => {
          if (result.isCancelled) {
            this.errorAlert.checkError('Login cancelled');
          } else {
            console.log('Login success with permissions: '
              +result.grantedPermissions.toString());
            AccessToken.getCurrentAccessToken().then(
              (data) => {
                console.log('cool check error', data.userID);
                this.props.actions.syncSocialSites(this.props.global.currentUser, data.userID ,'fbId');
              }
            )
          }
        },
        (error) => {
          this.errorAlert.checkError('Login fail with error: ' + error);
        }
      );
     };
     let onGPress = () => {
      //this.props.actions.syncSocialSites(this.props.global.currentUser, data.userID ,'gId');
       console.log('cool ma check google');
       GoogleSignin.configure({
         iosClientId: GOOGLE_ID, // only for iOS
       })
       .then(() => {
         // you can now call currentUserAsync()
         return GoogleSignin.signIn().then((user) => {
           console.log('Success user fetching data: ', user);
           this.props.actions.syncSocialSites(this.props.global.currentUser, user.id ,'gId');
         }, (error) => {
           this.errorAlert.checkError('Login fail with error: ' + error);
         });

       }, (error) => {
         this.errorAlert.checkError('Login fail with error: ' + error);
       });
     };
     let fbUI = <Icon
     disabled={true}
     name="logo-facebook" style={{color: '#ddd'}}/>;

     if (!this.props.profile.form.originalProfile.fbId) {
       fbUI = <Icon
       disabled={!this.props.profile.form.isValid || this.props.profile.form.isFetching}
       name="logo-facebook" onPress={onFBPress.bind(self)}/>;
     }

     let gUI = <Icon
     disabled={true}
     name="logo-google" style={{color: '#ddd'}}/>;

     if (!this.props.profile.form.originalProfile.gId) {
       gUI = <Icon
       disabled={!this.props.profile.form.isValid || this.props.profile.form.isFetching}
       name="logo-google" onPress={onGPress.bind(self)}/>;
     }
    return (
        <Layout isHeaderBack={true} headerRight={{action: onLogoutButtonPress.bind(self), iconName: "md-exit", isDisabled: !this.props.auth.form.isValid || this.props.auth.form.isFetching}}>
        <View style={{paddingTop: 8, paddingBottom: 8, paddingLeft: 10, paddingRight: 10}}>
          <Form
                ref="form"
                type={ProfileForm}
                options={options}
                value={this.state.formValues}
                onChange={this.onChange.bind(self)}
            />
        </View>
        <View style={{paddingLeft: 10, paddingRight: 10}}>{emailVerified}</View>
        <View style={styles.btn}>
          <FormButton
            isDisabled={!this.props.profile.form.isValid || this.props.profile.form.isFetching}
            onPress={onButtonPress.bind(self)}
            buttonText={profileButtonText}/>
        </View>
        <Grid style={[styles.btn, {paddingLeft: 10}]}>
            <Row>
              <Col><Text>{'Sync with'}</Text></Col>
              <Col>
                <Row>
                  <Col>
                    {fbUI}
                  </Col>
                  <Col>
                    {gUI}
                  </Col>
                </Row>
              </Col>
            </Row>
        </Grid>
      </Layout>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Profile);
