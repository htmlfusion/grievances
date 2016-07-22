/**
 * # CreateGrievance.js
 *
 * This component provides an interface for a logged in user to
 * create grievance.
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
import {Actions} from 'react-native-router-flux';
import {Container, Content, Header, Text, Button, Icon} from 'native-base';

/**
 * The actions we need
 */
import * as grievanceActions from '../reducers/grievance/grievanceActions';
import * as globalActions from '../reducers/global/globalActions';

/**
 * Immutable Mapn
 */
import {Map} from 'immutable';

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
 * The necessary React components
 */
import React, {Component} from 'react';
import
{
  StyleSheet,
  View
}
from 'react-native';

import NavigationBar from 'react-native-navbar';
/**
* The form processing component
*/
import t from 'tcomb-form-native';
import templates from '../components/NativeTemplates';
import Layout from '../components/Layout';
let Form = t.form.Form;

/**
 * ## Styles
 */
var styles = StyleSheet.create({
  content: {
    marginTop: 10
  },
  header: {
    backgroundColor: '#337ab7',
    borderColor: '#2e6da4',
    justifyContent: 'flex-start'
  },
  headerFont: {
    color: '#fff'
  }
});

/**
* ## Redux boilerplate
*/
const actions = [
  grievanceActions,
  globalActions
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


class UpdateGrievance extends Component {
  /**
   * ## CreateGrievance class
   * Set the initial state and prepare the errorAlert
   */
  constructor(props) {
    super(props);
    this.errorAlert = new ErrorAlert();
    this.state = {
      formValues: {
        description: props.grievance.grievanceUpdate.form.fields.description
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
    this.props.actions.onGrievanceUpdateFormFieldChange(value);
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
        description: props.grievance.grievanceUpdate.form.fields.description
      }
    });

  }

  /**
   * ### render
   * display the form wrapped with the header and button
   */
  render() {
    this.errorAlert.checkError(this.props.grievance.grievanceUpdate.form.error);

    let self = this;

    let leftButtonConfig = {
      title: 'Back',
      handler: Actions.pop
    };
    let nativeTextbox = templates.nativeTextbox;
    let GrievanceForm = t.struct({
      description: t.maybe(t.String)
    });
    /**
     * Set up the field definitions.  If we're fetching, the fields
     * are disabled.
     */
    let options = {
      auto: 'placeholders',
      fields: {
        description: {
          template: nativeTextbox
        }
      }
    };

    /**
     * When the button is pressed, send the users info including the
     * ```currrentUser``` object as it contains the sessionToken and
     * user objectId which Parse.com requires
     */
    let grievanceUpdateButtonText = 'Update Grievance';
    let grievanceDeleteButtonText = 'Remove';
    let onUpdateButtonPress = () => {
      this.props.actions.updateGrievance(
        this.props.grievance.grievanceUpdate.form.originalGrievance._id,
        this.props.grievance.grievanceUpdate.form.fields.description,
        this.props.global.currentUser
      );
    };
    let onDeleteButtonPress = () => {
      this.props.actions.deleteGrievance(
        this.props.grievance.grievanceUpdate.form.originalGrievance._id,
        this.props.global.currentUser
      );
    };
    /**
     * Wrap the form with the header and button.  The header props are
     * mostly for support of Hot reloading. See the docs for Header
     * for more info.
     */
    return (
        <Layout isHeaderBack={true}>
          <Form
              ref="form"
              type={GrievanceForm}
              options={options}
              value={this.state.formValues}
              onChange={this.onChange.bind(self)}
          />
          <Text>{this.props.grievance.grievanceUpdate.form.originalGrievance.tag}</Text>
          {/*Get the location name based on location coordinates*/}
          {/*<Text>{this.props.grievance.grievanceUpdate.form.originalGrievance.location}</Text>*/}
          <Text>{this.props.grievance.grievanceUpdate.form.originalGrievance.dateOfReporting}</Text>
          <Text>{this.props.grievance.grievanceUpdate.form.originalGrievance.address}</Text>
          <Text>{this.props.grievance.grievanceUpdate.form.originalGrievance.reportedUser}</Text>
          <Text>{this.props.grievance.grievanceUpdate.form.originalGrievance.dateOfResolving}</Text>
          <Text>{this.props.grievance.grievanceUpdate.form.originalGrievance.status}</Text>
          <Text>{this.props.grievance.grievanceUpdate.form.originalGrievance.resolvedUser}</Text>
          <FormButton
              /*isDisabled={!this.props.grievance.grievanceCreate.form.isValid}*/
              onPress={onUpdateButtonPress.bind(self)}
              buttonText={grievanceUpdateButtonText}/>
          <FormButton
              /*isDisabled={!this.props.grievance.grievanceCreate.form.isValid}*/
              onPress={onDeleteButtonPress.bind(self)}
              buttonText={grievanceDeleteButtonText}/>
        </Layout>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(UpdateGrievance);
