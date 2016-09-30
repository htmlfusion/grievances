/**
 * # Main.js
 *  This is the main app screen
 *
 */
'use strict';
/*
 * ## Imports
 *
 * Imports from redux
 */
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {Container, Content, Footer, Button, Text, Title, InputGroup, Input, Icon, Header} from 'native-base';
import Share, {ShareSheet, Button as ShareButton} from 'react-native-share';

/**
 * The actions we need
 */
import * as authActions from '../reducers/auth/authActions';
import * as globalActions from '../reducers/global/globalActions';
import * as grievanceActions from '../reducers/grievance/grievanceActions';
import GMap from '../components/GMap';
import List from '../components/ListCard';
import FontIcon from 'react-native-vector-icons/FontAwesome';
/**
 * Immutable
 */
import {Map} from 'immutable';

/**
 * Router
 */
import {Actions} from 'react-native-router-flux';
import Layout from '../components/Layout';
import CreateGrievance from './CreateGrievance';
import ErrorAlert from '../components/ErrorAlert';
/**
 * The Header will display a Image and support Hot Loading
 */
// import Header from '../components/Header';

/**
 * The components needed from React
 */
import React, {Component} from 'react';
import
{
  StyleSheet,
  View,
  Platform,
  Switch
}
from 'react-native';
import Dimensions from 'Dimensions';
import config from '../lib/config';
var {height, width} = Dimensions.get('window');
/**
 * The platform neutral button
 */


/**
 * Support for Hot reload
 *
 */
const actions = [
  authActions,
  globalActions,
  grievanceActions
];

/**
 *  Instead of including all app states via ...state
 *  One could explicitly enumerate only those which Main.js will depend on.
 *
 */
function mapStateToProps(state) {
  return {
      ...state
  }
};

/*
 * Bind all the functions from the ```actions``` and bind them with
 * ```dispatch```

 */
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
const ELLIPSE_WIDTH = width-120,
  ELLIPSE_HEIGHT = 50;
var styles = StyleSheet.create({
  roundBtn: {
    color: '#fff'
    // fontSize: 20,
    // fontWeight: 'bold'
  },
  semiCircle: {
    borderWidth: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderColor: '#aaa',
    width: width,
    alignItems: 'center',
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 1.5
  },
  ellipse: {
    width: ELLIPSE_WIDTH,
    // height: 30,
    bottom: 15,
    borderRadius: 10,
    // borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: '#fff'
  },
  gcontent: {
    marginTop: ELLIPSE_HEIGHT
  }
});

let btnGroupHighlight = {
    parent: {backgroundColor: '#fff'},
    child: {color: '#000'}
  },
  btnGroupDim = {
    parent: {},
    child: {}
  };

const DEFAULT_LOCATION = [77.63938050000002, 13.2958104];
/**
 * ## App class
 */
class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentLoc: DEFAULT_LOCATION, //This has to be set to empty [] once navigator's currentLocation is working
      address: 'Mysore, Karnataka, India', //this is temprory address, have to set it based on currentLoc
      radius: 1000,
      cbutton: {
        height: ELLIPSE_HEIGHT,
        text: true
      },
      btnType: 'list',
      visible: false
    };
    this.errorAlert = new ErrorAlert();
    this.updateGrievance = this.updateGrievance.bind(this);
    this.grievanceFeedback = this.grievanceFeedback.bind(this);
    this.setCurrentLoc = this.setCurrentLoc.bind(this);
  }

  componentDidMount() {
    // let data = {
    //   location: this.state.currentLoc,
    //   radius: this.state.radius
    // };
    if (this.props.grievance.grievanceList.locationSearch[0] && this.props.grievance.grievanceList.locationSearch[1]) {
      this.setCurrentLoc(this.props.grievance.grievanceList.locationSearch);
    } else {
      //Comment this two lines after getCurrentLocation is working properly
      this.props.actions.updateListSearch(DEFAULT_LOCATION, '', this.state.radius);
      this.setCurrentLoc(DEFAULT_LOCATION);
      navigator.geolocation.getCurrentPosition(
        (initialPosition) => {
          let currentLoc = [initialPosition.coords.longitude, initialPosition.coords.latitude];
          this.setState({
            currentLoc: currentLoc
          });
          //Add address here
          this.props.actions.retrieveLocation({
            latlng: initialPosition.coords.latitude+','+initialPosition.coords.longitude,
            key: 'AIzaSyCLj_mEPtWmyKMRQWC0dk7HkPSK-qKFmXo'
          }).then((res) => {
            this.setState({
              address: res.formatted_address
            });
          });
          this.props.actions.updateListSearch(currentLoc, '', this.state.radius);
          this.setCurrentLoc(currentLoc);
        },
        (error) => {
          console.log('nav error', error);
          this.errorAlert.checkError(error.message);
        },
        {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
      );
      this.watchID = navigator.geolocation.watchPosition((lastPosition) => {
        this.setState({
          currentLoc: [lastPosition.coords.longitude, lastPosition.coords.latitude]
        });
        //Add address here
        this.props.actions.retrieveLocation({
          latlng: lastPosition.coords.latitude+','+lastPosition.coords.longitude,
          key: config.G_REVERSE_API
        }).then((res) => {
          this.setState({
            address: res.formatted_address
          });
        });
        //this.setCurrentLoc(lastPosition.coords);
      });
    }


  }
  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }
  handlePress() {
    if (this.state.cbutton.text) {
      this.props.actions.onGrievanceUserUpdate(this.props.global.currentUser.objectId);
      this.setState({
        cbutton: {
          text: false,
          height: height-100
        }
      });
    } else {
      this.setState({
        cbutton: {
          text: true,
          height: ELLIPSE_HEIGHT
        }
      });
    }
    /*Actions.CreateGrievance({
      location: this.state.currentLoc,
      address: this.state.address
    });*/
  }

  updateGrievance(updateState, idx) {
    this.props.actions.grievanceSetUpdate(updateState, idx);
    Actions.UpdateGrievance();
  }

  grievanceFeedback(grievanceId, idx, feedback) {
    this.props.actions.grievanceUpdateFeedback(grievanceId, this.props.global.currentUser, idx, feedback);
  }

  setCurrentLoc(coords) {
    //Check how to update address
    // this.setState({
    //   currentLoc: [longitude, latitude]
    // });
    let data = {
      location: coords,
      radius: this.state.radius
    };
    this.props.actions.getGrievances(data, this.props.global.currentUser);
  }
  _profileTransition() {
    Actions.Profile();
  }
  _onSetListMap() {

    if (this.state.btnType === 'list') {
      this.setState({
        btnType: 'map-marker'
      });
    } else {
      this.setState({
        btnType: 'list'
      });
    }

  }
  // onCancel() {
  //   console.log("CANCEL")
  //   this.setState({visible:false});
  // }
  onOpen() {
    console.log("OPEN")
    this.setState({visible:true});
  }
  render() {

    //For future purpose I created Ellipse View
    let shareOptions = {
      title: "React Native",
      message: "Hola mundo",
      url: "http://facebook.github.io/react-native/",
      subject: "Share Link" //  for email
    };
    let roundBtn = <View style={[styles.semiCircle, {height: this.state.cbutton.height}]}>
      <View style={styles.ellipse}>
        <Button rounded style={{width: ELLIPSE_WIDTH}} onPress={ this.handlePress.bind(this) }>
          <Text style={styles.roundBtn}>{'New Grievance'}</Text>
        </Button>
      </View>
      <View style={styles.gcontent}>
        <CreateGrievance location={this.state.currentLoc} address={this.state.address} transition={this.handlePress.bind(this)}/>
      </View>
    </View>;

    let grievancesDisplayView;
    if (this.state.btnType === 'list') {
      grievancesDisplayView=<GMap
        data={this.props.grievance.grievanceList.grievances}
        coords={{latitude: this.props.grievance.grievanceList.locationSearch[1], longitude: this.props.grievance.grievanceList.locationSearch[0]}}
        cardMargin={ELLIPSE_HEIGHT} auth={this.props.global.currentUser}
        grievanceFeedback={this.grievanceFeedback} updateGrievance={this.updateGrievance}
        radius={this.props.grievance.grievanceList.locationSearchRadius}
        />;
    } else {
      grievancesDisplayView=<List
        onOpen={this.onOpen.bind(this)}
        data={this.props.grievance.grievanceList.grievances}
        auth={this.props.global.currentUser}
        grievanceFeedback={this.grievanceFeedback} updateGrievance={this.updateGrievance}
        />;
    }
//We have to add title component inside Header component to make searchbox center
    return(
      <View style={{flex: 1}}>
      {/* height has been taken from native-base header height */}
        <View style={{flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', height: (Platform.OS === 'ios'? 64: 56)}}>
          <View><Button rounded small danger onPress={this._profileTransition.bind(this)}><Text style={{color: '#fff'}} >{'me'}</Text></Button></View>
          <View><Button style={{width: width-120, flexDirection: 'row', justifyContent: 'flex-start', overflow: 'hidden'}} onPress={()=>Actions.LocationSearch({radius: this.state.radius})}>
            <Icon name="ios-search" />
            {this.props.grievance.grievanceList.locationSearchText}
          </Button></View>
          <View><Button square small transparent onPress={this._onSetListMap.bind(this)}>
            <FontIcon style={{fontSize: 18}} name={this.state.btnType} />
          </Button></View>
        </View>
        <Content>
          {grievancesDisplayView}
        </Content>
        {roundBtn}

      </View>
    );
  }
};

/**
 * Connect the properties
 */
export default connect(mapStateToProps, mapDispatchToProps)(Main);
