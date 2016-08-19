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
import {Container, Content, Footer, Button, Text, Badge, InputGroup, Input, Icon, Header} from 'native-base';

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
  View
}
from 'react-native';
import Dimensions from 'Dimensions';
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
const ELLIPSE_WIDTH = width-30,
  ELLIPSE_HEIGHT = 50;
var styles = StyleSheet.create({
  roundBtn: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  semiCircle: {
    borderLeftWidth: 3,
    borderRightWidth: 3,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    borderColor: '#000',
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
    height: 30,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff'
  },
  gcontent: {
    marginTop: ELLIPSE_HEIGHT
  }
});

let btnGroupHighlight = {
  parent: {backgroundColor: '#fff'},
  child: {color: '#000'}
};
let btnGroupDim = {
  parent: {},
  child: {}
}
/**
 * ## App class
 */
class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentLoc: [12.2958104, 76.63938050000002], //This has to be set to empty [] once navigator's currentLocation is working
      address: 'Mysore, Karnataka, India', //this is temprory address, have to set it based on currentLoc
      radius: 10,
      cbutton: {
        height: ELLIPSE_HEIGHT,
        text: '+'
      },
      btnType: 'list'
    };
    this.updateGrievance = this.updateGrievance.bind(this);
    this.grievanceFeedback = this.grievanceFeedback.bind(this);
  }

  componentDidMount() {
    let data = {
      location: this.state.currentLoc,
      radius: this.state.radius
    };
    this.props.actions.getGrievances(data, this.props.global.currentUser);
  }

  handlePress() {
    if (this.state.cbutton.text === '+') {
      this.props.actions.onGrievanceUserUpdate(this.props.global.currentUser.objectId);
      this.setState({
        cbutton: {
          text: '-',
          height: height-200
        }
      });
    } else {
      this.setState({
        cbutton: {
          text: '+',
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

  setCurrentLoc({longitude, latitude}) {
    //Check how to update address
    this.setState({
      currentLoc: [longitude, latitude]
    });
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
  render() {

    //For future purpose I created Ellipse View
    let roundBtn = <View style={[styles.semiCircle, {height: this.state.cbutton.height}]}>
      <View style={styles.ellipse}>
        <Button transparent style={{width: ELLIPSE_WIDTH}} onPress={ this.handlePress.bind(this) }>
          <Text style={styles.roundBtn}>{this.state.cbutton.text}</Text>
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
        cardMargin={ELLIPSE_HEIGHT} auth={this.props.global.currentUser}
        grievanceFeedback={this.grievanceFeedback} updateGrievance={this.updateGrievance}
        setCurrentLoc={this.setCurrentLoc.bind(this)} radius={this.state.radius}
        />;
    } else {
      grievancesDisplayView=<List
        data={this.props.grievance.grievanceList.grievances}
        auth={this.props.global.currentUser}
        grievanceFeedback={this.grievanceFeedback} updateGrievance={this.updateGrievance}
        />;
    }
    let headerContent =<View style={{flexDirection: 'row', alignItems: 'center'}}>
      <InputGroup style={{width: width-120}}>
          <Icon style={{fontSize: 18}} name="ios-search" />
          <Input placeholder="Search location" />
      </InputGroup>
      <View style={{flexDirection: 'row', width: 40, paddingRight: 10}}>
        <Button square small transparent onPress={this._onSetListMap.bind(this)}>
          <FontIcon style={{fontSize: 18}} name={this.state.btnType} />
        </Button>
        <Button rounded small danger onPress={this._profileTransition.bind(this)}>{'me'}</Button>
      </View>
    </View>;
    return(
      <View style={{flex: 1}}>
        <Header>{headerContent}</Header>
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
