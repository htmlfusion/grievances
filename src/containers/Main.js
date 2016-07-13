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
import {Container, Content, Footer, Button} from 'native-base';

/**
 * The actions we need
 */
import * as authActions from '../reducers/auth/authActions';
import * as globalActions from '../reducers/global/globalActions';
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

/**
 * The platform neutral button
 */


/**
 * Support for Hot reload
 *
 */
const actions = [
  authActions,
  globalActions
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
    position: 'absolute',
    right:20,
    bottom: 10
  }
});

/**
 * ## App class
 */
class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentLoc: [16.878147, 79.277344]
    }
  }

  handlePress() {
    Actions.CreateGrievance({
      location: this.state.currentLoc
    });
  }

  updateGrievance(updateState) {
    Actions.UpdateGrievance(updateState);
  }

  setCurrentLoc({longitude, latitude}) {
    this.setState({
      currentLoc: [longitude, latitude]
    });
  }

  render() {
    console.log('check grievances', this.props.grievance.grievanceList.grievances);
    return(
      <Container>
        <Content>
        {/*<Header isFetching={this.props.auth.form.isFetching}
                showState={this.props.global.showState}
                currentState={this.props.global.currentState}
                onGetState={this.props.actions.getState}
                onSetState={this.props.actions.setState}
        />*/}
          <GMap data={this.props.grievance.grievanceList.grievances} setCurrentLoc={this.setCurrentLoc.bind(this)}/>
        </Content>
        <Footer>
          <Button onPress={ this.handlePress.bind(this) } rounded style={styles.roundBtn}>
           {'+'}
          </Button>
        </Footer>
      </Container>
    );
  }
};

/**
 * Connect the properties
 */
export default connect(mapStateToProps, mapDispatchToProps)(Main);
