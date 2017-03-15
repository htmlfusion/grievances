/**
 * # LocationSearch.js
 *
 *  This is called from main to search the location
 *
 */
'use strict';
/**
* The necessary components from React
*/
 import React, {Component} from 'react';
 import
 {
   StyleSheet,
   View
 }
 from 'react-native';
/*
* ## Imports
*
* Imports from redux
*/
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

/**
 * Immutable
 */
import {Map} from 'immutable';

/**
 * Router
 */
import {Actions} from 'react-native-router-flux';


import {Button, Text, Icon} from 'native-base';
var {GooglePlacesAutocomplete} = require('react-native-google-places-autocomplete');
import Layout from '../components/Layout';
import * as grievanceActions from '../reducers/grievance/grievanceActions';
import config from '../lib/config';
/**
 * If your app uses Redux action creators, you can add them here...
 *
 */
const actions = [
  grievanceActions
];

/**
 *  Instead of including all app states via ...state
 *  You probably want to explicitly enumerate only those which Main.js will depend on.
 *
 */
function mapStateToProps(state) {
  return {
      ...state
  };
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

});

/**
 * ## LocationSearch class
 */
class LocationSearch extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    // var leftButtonConfig = {
    //   handler: Actions.pop()
    // };

    return(
      <Layout>
        <View style={{flexDirection: 'row', top: 20}}>
          <Button transparent onPress={Actions.pop}>
            <Icon name="ios-arrow-back"/>
          </Button>
          <GooglePlacesAutocomplete
            placeholder='Search location'
            minLength={2} // minimum length of text to search
            autoFocus={false}
            fetchDetails={true}
            onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
              console.log(details);
              if (details) {
                this.props.actions.updateListSearch([details.geometry.location.lng, details.geometry.location.lat], details.formatted_address, this.props.radius);
                Actions.Main();
              }
            }}
            getDefaultValue={() => {
              console.log('text input default value');
              return ''; // text input default value
            }}
            query={{
              // available options: https://developers.google.com/places/web-service/autocomplete
              key: config.G_AUTO_API,
              language: 'en', // language of the results
              types: '(cities)', // default: 'geocode'
            }}
            styles={{
              description: {
                fontWeight: 'bold',
              },
              predefinedPlacesDescription: {
                color: '#1faadb',
              }
            }}
            currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
            currentLocationLabel="Current location"
            nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
            GoogleReverseGeocodingQuery={{
              // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
            }}
            GooglePlacesSearchQuery={{
              // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
              rankby: 'distance',
              types: 'food',
            }}
            filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
          />
        </View>
      </Layout>
    );
  }
}

/**
 * Connect the properties
 */
export default connect(mapStateToProps, mapDispatchToProps)(LocationSearch);
