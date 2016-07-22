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
import {Container, Content, Footer, Button, Text} from 'native-base';

/**
 * The actions we need
 */
import * as authActions from '../reducers/auth/authActions';
import * as globalActions from '../reducers/global/globalActions';
import * as grievanceActions from '../reducers/grievance/grievanceActions';
import GMap from '../components/GMap';
/**
 * Immutable
 */
import {Map} from 'immutable';

/**
 * Router
 */
import {Actions} from 'react-native-router-flux';

/**
 * The Header will display a Image and support Hot Loading
 */
import Header from '../components/Header';

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

var styles = StyleSheet.create({
  roundBtn: {
    // position: 'absolute',
    flexDirection: 'row',
    bottom: 60,
    right: 10,
    width: width,
    justifyContent: 'flex-end'
  }
});

/**
 * ## App class
 */
class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentLoc: [] //This has to be set to empty [] once navigator's currentLocation is working
    }
    this.updateGrievance = this.updateGrievance.bind(this);
  }

  componentDidMount() {
    this.props.actions.getGrievances(this.props.global.currentUser);
  }

  handlePress() {
    Actions.CreateGrievance({
      location: this.state.currentLoc
    });
  }

  updateGrievance(updateState, idx) {
    this.props.actions.grievanceSetUpdate(updateState, idx);
    Actions.UpdateGrievance();
  }

  setCurrentLoc({longitude, latitude}) {
    this.setState({
      currentLoc: [longitude, latitude]
    });
  }

  render() {
    return(
      <Container>
        <Content>
        {/*<Header isFetching={this.props.auth.form.isFetching}
                showState={this.props.global.showState}
                currentState={this.props.global.currentState}
                onGetState={this.props.actions.getState}
                onSetState={this.props.actions.setState}
        />*/}
          <GMap data={this.props.grievance.grievanceList.grievances} updateGrievance={this.updateGrievance} setCurrentLoc={this.setCurrentLoc.bind(this)}/>

        </Content>
        <Footer>
          <View style={styles.roundBtn}>
            <Button onPress={ this.handlePress.bind(this) } rounded >
             {'+'}
            </Button>
          </View>
        </Footer>
      </Container>
    );
  }
};

/**
 * Connect the properties
 */
export default connect(mapStateToProps, mapDispatchToProps)(Main);
