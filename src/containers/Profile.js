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
import {Container, Content, Header, Button, Icon, Text} from 'native-base';

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

/**
* The form processing component
*/
import t from 'tcomb-form-native';

let Form = t.form.Form;

/**
 * ## Styles
 */
var styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent'
  },
  btn: {
    marginTop: 10
  },
  header: {
    backgroundColor: '#337ab7',
    borderColor: '#2e6da4',
    flexDirection: 'row-reverse',
    justifyContent: 'space-between'
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
    let options = {
      auto: 'placeholders',
      fields: {
        fullname: {
          editable: !this.props.profile.form.isFetching
        },
        email: {
          keyboardType: 'email-address',
          editable: !this.props.profile.form.isFetching,
          hasError: this.props.profile.form.fields.emailHasError,
          error: 'Please enter valid email'
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
    return (
      <Container style={styles.container}>
        {/*<Header isFetching={this.props.profile.form.isFetching}
                showState={this.props.global.showState}
                currentState={this.props.global.currentState}
                onGetState={this.props.actions.getState}
                onSetState={this.props.actions.setState}
        />*/}
        <Header style = {styles.header}>
          <Button transparent onPress={onLogoutButtonPress.bind(self)}>
            <Icon name="md-exit" style={styles.headerFont} isDisabled={!this.props.auth.form.isValid || this.props.auth.form.isFetching}/>
          </Button>
        </Header>
        <Content style={styles.content}>
          <Form
              ref="form"
              type={ProfileForm}
              options={options}
              value={this.state.formValues}
              onChange={this.onChange.bind(self)}
          />
          <ItemCheckbox text="Email verified (display only)"
                        disabled={true}
                        checked={this.props.profile.form.fields.emailVerified}
          />

        <View style={styles.btn}>
          <FormButton
            isDisabled={!this.props.profile.form.isValid || this.props.profile.form.isFetching}
            onPress={onButtonPress.bind(self)}
            buttonText={profileButtonText}/>
        </View>
        </Content>
      </Container>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Profile);
