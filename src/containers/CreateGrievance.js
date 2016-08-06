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
import {Container, Content, Header, Button, Icon, Title, Text, Thumbnail, Card} from 'native-base';
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
  View,
  Platform
}
from 'react-native';

import NavigationBar from 'react-native-navbar';
/**
* The form processing component
*/
import t from 'tcomb-form-native';
import templates from '../components/NativeTemplates';
import Layout from '../components/Layout';
import ImagePicker from 'react-native-image-picker';
import Dimensions from 'Dimensions';
var {height, width} = Dimensions.get('window');
let Form = t.form.Form;

/**
 * ## Styles
 */

/**
* ## Redux boilerplate
*/
const actions = [
  grievanceActions,
  globalActions
];

const styles = StyleSheet.create({
  content: {
    marginTop: 10
  },
  header: {
    backgroundColor: '#337ab7',
    borderColor: '#2e6da4'
  },
  headerFont: {
    color: '#000'
  },
  form: {
    width: width,
    paddingTop: 10,
    paddingBottom: 40,
    paddingRight: 30,
    paddingLeft: 30
  },
  myStyle: {
    height: 30,
    width: 120,
    borderTopWidth: 2,
    borderBottomWidth: 2
  },
  reportBtn: {
    backgroundColor: '#fff',
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    height: 30,
    width: 130,
    marginTop: -30,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 25
  },
  img: {
    width: width/3,
    height: width/3,
    alignItems: 'center',
    justifyContent: 'center'
  },
  arrowRight: {
    borderBottomWidth: 15,
    borderBottomColor: 'transparent',
    borderLeftWidth: 20,
    borderLeftColor: '#000',
    borderTopWidth: 15,
    borderTopColor: 'transparent',
    height: 0,
    width: 0
  }
});


const transparentStyle = {
  parent: {
    borderColor: '#2e6da4',
    backgroundColor: '#fff',
    borderWidth: 1,
    height: 40,
    width: 40
  },
  child: {
    color: '#000'
  }
};
const highlightStyle = {
  parent: {
    borderColor: '#2e6da4',
    borderWidth: 1,
    backgroundColor: '#337ab7',
    height: 40,
    width: 40
  },
  child: {
    color: '#fff'
  }
};
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


class CreateGrievance extends Component {
  /**
   * ## CreateGrievance class
   * Set the initial state and prepare the errorAlert
   */
  constructor(props) {
    super(props);
    this.errorAlert = new ErrorAlert();
    this.state = {
      formValues: {
        /*address: '',*/
        description: '',
        tag: '',
        src: ''
      },
      btnMeStyle: highlightStyle,
      anonymousStyle: transparentStyle,
      reportedUser: this.props.global.currentUser.objectId,
      curlyUrl: null
    };
    this._showUploadGallery = this._showUploadGallery.bind(this);
  }
  /**
   * ### onChange
   *
   * When any fields change in the form, fire this action so they can
   * be validated.
   *
   */
  onChange(value) {
    this.props.actions.onGrievanceFormFieldChange(value);
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
        /*address: props.grievance.grievanceCreate.form.fields.address,*/
        description: props.grievance.grievanceCreate.form.fields.description,
        tag: props.grievance.grievanceCreate.form.fields.tag
      }
    });

  }
  _showUploadGallery() {
    let uploadOptions = {
      title: 'Select Avatar',
      storageOptions: {
        skipBackup: true,
        path: 'images'
      },
      takePhotoButtonTitle: 'Snap & Post'
    };
    ImagePicker.showImagePicker(uploadOptions, (response) => {
      console.log('response: ',response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
        this.errorAlert.checkError(response.error);
      }
      /*else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }*/
      else {
        // You can display the image using either data...
        const source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};

        // or a reference to the platform specific asset location
        if (Platform.OS === 'ios') {
          const source = {uri: response.uri.replace('file://', ''), isStatic: true};
        } else {
          const source = {uri: response.uri, isStatic: true};
        }

        this.setState({
          curlyUrl: source
        });
      }

    });
  }
  /**
   * ### render
   * display the form wrapped with the header and button
   */
  render() {
    this.errorAlert.checkError(this.props.grievance.grievanceCreate.form.error);

    let self = this;

    let leftButtonConfig = {
      title: 'Back',
      handler: Actions.pop
    };
    let nativeTextbox = templates.nativeTextbox;
    let GrievanceForm = t.struct({
      /*address: t.String,*/
      description: t.maybe(t.String),
      tag: t.String,
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
        },
        tag: {
          template: nativeTextbox
        }
      }
    };

    //console.log('/**ImagePicker bbb: ',ImagePicker.showImagePicker);


    let btnAnonymous = (type) => {
      if (type === 'me') {
        this.setState({
          anonymousStyle: transparentStyle,
          btnMeStyle: highlightStyle,
          reportedUser: this.props.global.currentUser.objectId
        });
      }
      else {
        this.setState({
          anonymousStyle: highlightStyle,
          btnMeStyle: transparentStyle,
          reportedUser: undefined
        });
      }
    };

    /**
     * When the button is pressed, send the users info including the
     * ```currrentUser``` object as it contains the sessionToken and
     * user objectId which Parse.com requires
     */
    let grievanceButtonText = 'Report';
    let onButtonPress = () => {
      this.props.actions.createGrievance(
        this.props.address,
        /*this.props.grievance.grievanceCreate.form.fields.address,*/
        this.props.grievance.grievanceCreate.form.fields.description,
        this.props.location,
        this.state.reportedUser,
        this.props.grievance.grievanceCreate.form.fields.tag,
        this.state.curlyUrl,
        this.props.global.currentUser,
        this.props.transition
      );
    };
    let headerTitle = 'Report Grievance';
    let image = null;
    if  (this.state.curlyUrl) {
      image = <Thumbnail square source={this.state.curlyUrl} style={styles.img}/>;
    }
    let btnMeAn = (type, displayPic, displayText, props, styleProp) => {
      let parentStyle = Object.assign({}, {position: 'absolute', alignItems: 'center', top: -7, justifyContent: 'center'}, styleProp);
      return (<View style={parentStyle}>
      <View>
        <Button ref={type} small rounded transparent style={[props.parent]} onPress={btnAnonymous.bind(this, type)}>
          <Text style={props.child}>{displayPic}</Text>
        </Button>
      </View>
      <Text>{displayText}</Text>
    </View>);
  };
    /**
     * Wrap the form with the header and button.  The header props are
     * mostly for support of Hot reloading. See the docs for Header
     * for more info.
     */
    return (
        <View>
          <View style={{borderTopWidth: 2, borderBottomWidth:2, paddingBottom: 30, paddingTop: 20}}>
            <View style={{position: 'absolute', top: -15, left: 10}}><Text>{'Report as:'}</Text></View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{flexDirection: 'row'}}>
                <View style={styles.myStyle}>
                  {btnMeAn('me', 'me', this.props.global.currentUser.fullname, this.state.btnMeStyle, {left: 20})}
                </View>
                <View style={styles.arrowRight} />
              </View>
              {btnMeAn('an', '?', 'Anonymous', this.state.anonymousStyle, {right: 20})}
            </View>
          </View>
          <View style={styles.form}>
            <Form
                ref="form"
                type={GrievanceForm}
                options={options}
                value={this.state.formValues}
                onChange={this.onChange.bind(self)}
            />
            {/*<View style={{marginBottom: 10, marginTop: 4}}>
              <Text>{'Display Tags'}</Text>
            </View>*/}
            <View style={{flexDirection: 'row'}}>
              <View style={[styles.img, {width: width/5}]}>
                <View>
                  <Button ref='upload' rounded small onPress={this._showUploadGallery}>
                    <Icon name="ios-camera-outline"></Icon>
                  </Button>
                </View>
              </View>
              <View style={[styles.img]}>
                {image}
              </View>
            </View>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderTopWidth: 2}}>
            <View style={styles.reportBtn}>
              <View>
                <Button style={{width: 115}} rounded onPress={onButtonPress.bind(self)} >{grievanceButtonText}</Button>
              </View>
            </View>
          </View>
        </View>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(CreateGrievance);
