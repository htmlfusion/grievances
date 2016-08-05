import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import SwipeCard from './SwipeCard';
import Swiper from 'react-native-swiper';
import MapView from 'react-native-maps';
import ErrorAlert from './ErrorAlert';
import Dimensions from 'Dimensions';
var {height, width} = Dimensions.get('window');
//Now having issues with react-native-maps, follow this steps https://github.com/lelandrichardson/react-native-maps/issues/371 to fix
let styles = StyleSheet.create({
  container: {
    height: height, //subtract height will be footer height
    width: width,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  }
});

export default class GMap extends Component {
  constructor(props) {
    super(props);
    this.errorAlert = new ErrorAlert();
    this.state = {
      region: null,
      initialRegion: null,
      markers: this.props.data,
      currentMarker: null
    };
  }
  componentWillReceiveProps(props) {
    this.state.markers = props.data;
  }
  componentDidMount() {
    let initialDelta = {latitudeDelta: 0.0922, longitudeDelta: 0.0421};
    navigator.geolocation.getCurrentPosition(
      (initialPosition) => {


        this.setState({initialRegion: {...initialPosition.coords, ...initialDelta}});
        this.props.setCurrentLoc(initialPosition.coords);
      },
      (error) => {console.log('nav error', error); this.errorAlert.checkError(error.message);},
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
    this.watchID = navigator.geolocation.watchPosition((lastPosition) => {
      this.setState({region: {...lastPosition.coords, ...initialDelta}});
      this.props.setCurrentLoc(lastPosition.coords);
    });
  }

  mapCard(markerId) {
    this.setState({
      currentMarker: markerId
    })
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  render() {
    let swipeCards = this.state.markers.map((marker, idx) => (
          <SwipeCard
            key={idx}
            marker = {marker}
            auth = {this.props.auth}
            cardAction={this.props.updateGrievance.bind(this, marker, idx)}
            grievanceFeedback={this.props.grievanceFeedback.bind(this, marker._id, idx)}
          />
      ));/*<Swiper horizontal={true}>
        {this.state.markers.map((marker, idx) => (
            <SwipeCard
              key={idx}
              marker = {marker}
              cardAction={this.props.updateGrievance.bind(this, marker, idx)}
              grievanceFeedback={this.props.grievanceFeedback.bind(this, marker._id, idx)}
            />
        ))}
      </Swiper>*/;
    return (
      <View style={styles.container}>
        <MapView style={styles.map}
          initialRegion={this.state.initialRegion}
          region={this.state.region}
        >
        {/*circle is not working now, have to fix it. Once it is working replace default values with this.state.initialRegion*/}
        <MapView.Circle
            center={{latitude: 12.2958104, longitude: 76.63938050000002}}
            radius={this.props.radius}
            fillColor="rgba(200, 0, 0, 0.5)"
            strokeColor="rgba(0,0,0,0.5)"
          />
        {/* onPress is not working, so using onSelect(this will work only in ios). Once issue is fixed we can use onPress*/}

          {this.state.markers.map((marker, idx) => (
              <MapView.Marker
                key={idx}
                coordinate={{latitude:marker.location[0], longitude:marker.location[1]}}
                onSelect={() => {this.mapCard.bind(this, marker._id)}}
              />
          ))}

        </MapView>
        <View style={{marginBottom: this.props.cardMargin}}>{swipeCards}</View>
      </View>
    );
  }
}
