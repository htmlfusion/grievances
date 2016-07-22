import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import MapView from 'react-native-maps';
import ErrorAlert from '../components/ErrorAlert';
import Dimensions from 'Dimensions';
var {height, width} = Dimensions.get('window');
//Now having issues with react-native-maps, follow this steps https://github.com/lelandrichardson/react-native-maps/issues/371 to fix
let styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: height,
    width: width,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  }
});

export default class GMap extends Component {
  constructor(props) {
    super(props);
    this.errorAlert = new ErrorAlert();
    this.state = {
      region: null,
      initialRegion: null,
      markers: this.props.data
    };
  }
  componentWillReceiveProps(props) {
    this.state.markers = props.data;
  }
  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        var initialPosition = JSON.stringify(position);
        this.setState({initialRegion: initialPosition.coords});
        this.props.setCurrentLoc(initialPosition.coords);
      },
      (error) => {console.log('nav error', error); this.errorAlert.checkError(error.message);},
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
    this.watchID = navigator.geolocation.watchPosition((position) => {
      var lastPosition = JSON.stringify(position);
      this.setState({region: lastPosition.coords});
      this.props.setCurrentLoc(lastPosition.coords);
    });
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  render() {

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
        {/*onPress is not working, so using onSelect(this will work only in ios). Once issue is fixed we can use onPress*/}
          {this.state.markers.map((marker, idx) => (
            <MapView.Marker
              key={marker._id}
              coordinate={{latitude:marker.location[0], longitude:marker.location[1]}}
              title={marker.tag}
              description={marker.description}
              onSelect={() => {this.props.updateGrievance(marker, idx);}}
            />
          ))}
        </MapView>
      </View>
    );
  }
}
