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
import {Container, Content, Header, Text, Button, Icon, Thumbnail} from 'native-base';
import FontIcon from 'react-native-vector-icons/FontAwesome';
import Dimensions from 'Dimensions';
var {height, width} = Dimensions.get('window');
/**
 * The actions we need
 */
import * as grievanceActions from '../reducers/grievance/grievanceActions';
import * as globalActions from '../reducers/global/globalActions';

/**
 * Immutable Mapn
 */
import {Map} from 'immutable';

import MyUser from '../components/MyUser';
import UserButton from '../components/UserButton';
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
  },
  ellipse: {
    borderWidth: 1,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    height: 25,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  img: {
    width: width-20,
    height: width/2,
    borderRadius: 10
//     alignItems: 'center',
//     justifyContent: 'center'
  },
  legend: {
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingTop: 8,
    paddingBottom: 8
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
          label: 'Description',
          template: nativeTextbox
        }
      }
    };

    const highlightStyle = {'primary': true};
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
    let image = null;
    if (this.props.grievance.grievanceUpdate.form.originalGrievance.curlyUrl) {
      image = <View style={{justifyContent: 'center', flexDirection: 'row'}}><Thumbnail square style={StyleSheet.flatten(styles.img)} source={{uri: this.props.grievance.grievanceUpdate.form.originalGrievance.curlyUrlLarge}}/></View>
    }
    let headerText = (name) => {
      if (name)
        return name.toUpperCase();
      else
        return 'INCIDENT';
    }
    let displayPic = <Icon name="ios-person-outline" />;
    let deleteBtn = null;
    let reportedUser = this.props.grievance.grievanceUpdate.form.originalGrievance.reportedUser;
    if (reportedUser && this.props.global.currentUser.objectId === reportedUser._id) {
      deleteBtn = <FormButton
          isDisabled={!this.props.grievance.grievanceUpdate.form.disabled}
          onPress={onDeleteButtonPress.bind(self)}
          buttonText={grievanceDeleteButtonText}/>;
    }
    let statusIn = this.props.grievance.grievanceUpdate.form.originalGrievance.status;
    if (statusIn === 'new') {
      statusIn = 'Under Investigation';
    }
    return (
        <Layout isHeaderBack={true} noHeaderRight={true} headerTitle={headerText(this.props.grievance.grievanceUpdate.form.originalGrievance.tag)}>
          <View style={{paddingRight: 10, paddingLeft: 10}}>
            <View style={styles.legend}>
              <View>
                <Text note>{'Reported as'}</Text>
              </View>
              <View>
                <Text style={{fontWeight: '500'}}>{reportedUser.fullname}</Text>
              </View>
            </View>
            <View style={styles.legend}>
              <View style={{flexDirection: 'row', marginBottom: 5}}>
                <FontIcon name="map-marker" style={{fontSize: 27, flex: 1}}/>
                <Text style={{flex: 5}} note>{this.props.grievance.grievanceUpdate.form.originalGrievance.address}</Text>
              </View>
              <View style={{flexDirection: 'row', marginBottom: 5}}>
                <Icon name="ios-calendar" style={{flex: 1}}/>
                <Text style={{flex: 5}} note>{this.props.grievance.grievanceUpdate.form.originalGrievance.dateOfReporting}</Text>
              </View>
              <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{flex: 1}}>{'Status'}</Text>
                <Button rounded disabled success style={{flex:4, justifyContent: 'center'}}><Text>{statusIn}</Text></Button>
              </View>
            </View>
            <View style={{paddingTop: 8, paddingBottom: 8}}>
              <Form
                  ref="form"
                  type={GrievanceForm}
                  options={options}
                  value={this.state.formValues}
                  onChange={this.onChange.bind(self)}
              />
              {/*Get the location name based on location coordinates*/}
              {/*<Text>{this.props.grievance.grievanceUpdate.form.originalGrievance.location}</Text>*/}
              {image}
            </View>
          </View>
          <View>
            <View style={{marginBottom: 10}}>
              <FormButton
                isDisabled={this.props.grievance.grievanceUpdate.form.isFetching || !this.props.grievance.grievanceUpdate.form.isValid}
                onPress={onUpdateButtonPress.bind(self)}
                buttonText={grievanceUpdateButtonText}/>
            </View>
            <View style={{marginBottom: 10}}>
              {deleteBtn}
            </View>
        </View>
      </Layout>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(UpdateGrievance);
