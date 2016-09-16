import React, {Component} from 'react';
import {StyleSheet, View, ScrollView, Text, TouchableOpacity} from 'react-native';
import SwipeCard from './SwipeCard';
import Swiper from 'react-native-swiper';
import MapView from 'react-native-maps';
import ErrorAlert from './ErrorAlert';
import Dimensions from 'Dimensions';
var {height, width} = Dimensions.get('window');
const CARD_PREVIEW_WIDTH = 20;
const CARD_MARGIN = 5;
const CARD_WIDTH = width - (CARD_MARGIN + CARD_PREVIEW_WIDTH) * 2;
//Now having issues with react-native-maps, follow this steps https://github.com/lelandrichardson/react-native-maps/issues/371 to fix
let styles = StyleSheet.create({
  container: {
    height: height, //subtract height will be footer+header height
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
  },
  contentContainer: {
    flex: 1,
    position: 'absolute',
    bottom: 140
  },
  content: {
    paddingHorizontal: CARD_PREVIEW_WIDTH,
    alignItems: 'flex-end'
  },
});

const INITIAL_DELTA = {latitudeDelta: 0.0922, longitudeDelta: 0.0421};

export default class GMap extends Component {
  constructor(props) {
    super(props);
    this.errorAlert = new ErrorAlert();
    this.state = {
      region: {...this.props.coords, ...INITIAL_DELTA},
      // initialRegion: null,
      markers: this.props.data,
      currentMarker: null
    };
  }

  componentWillReceiveProps(props) {
    this.state.markers=props.data;
    this.setState({
      region: {...props.coords, ...INITIAL_DELTA}
    });
  }

  mapCard(markerId) {
    this.setState({
      currentMarker: markerId
    })
  }


  render() {
    let cardHeight = height/6,
      cardWidth = width-width/4,
      thumbnailWidth = height/7,
      mapView = null;


    let swipeCards = this.state.markers.map((marker, idx) => (
          <SwipeCard
            key={idx}
            marker = {marker}
            cardDimension={{width: cardWidth, height: cardHeight, marginRight: 10}}
            noLines={4}
            thumbnailDim={{width: thumbnailWidth, height: thumbnailWidth, borderRadius: 10}}
            auth = {this.props.auth}
            cardAction={this.props.updateGrievance.bind(this, marker, idx)}
            grievanceFeedback={this.props.grievanceFeedback.bind(this, marker._id, idx)}
          />
      ));/*<Swiper horizontal={true}>
        {this.state.markers.map((marker, idx) => (
            <SwipeCard
              key={idx}
              marker = {marker}
              cardDimension={{width: cardWidth, height: cardHeight, marginRight: 10}}
              noLines={4}
              thumbnailDim={{width: thumbnailWidth, height: thumbnailWidth}}
              auth = {this.props.auth}
              cardAction={this.props.updateGrievance.bind(this, marker, idx)}
              grievanceFeedback={this.props.grievanceFeedback.bind(this, marker._id, idx)}
            />
        ))}
      </Swiper>*/;
    if (this.state.region.longitude && this.state.region.latitude) {
      mapView = <MapView style={styles.map}
        region={this.state.region}
      >
      {/*circle is not working now, have to fix it. Once it is working replace default values with this.state.initialRegion*/}
      <MapView.Circle
          center={this.state.region}
          radius={this.props.radius}
          fillColor="rgba(200, 0, 0, 0.5)"
          strokeColor="rgba(0,0,0,0.5)"
        />
      {/* onPress is not working, so using onSelect(this will work only in ios). Once issue is fixed we can use onPress*/}

        {this.state.markers.map((marker, idx) => (
            <MapView.Marker
              key={idx}
              coordinate={{longitude:marker.location[0], latitude:marker.location[1]}}
              onSelect={() => {this.mapCard.bind(this, marker._id)}}
            />
        ))}

      </MapView>;
    }
    return (
      <View style={styles.container}>
        {mapView}
        <ScrollView
          style={styles.contentContainer}
          ref={(scrollView) => {_scrollView = scrollView}}
          automaticallyAdjustContentInsets={false}
          horizontal={true}
          decelerationRate={0}
          snapToInterval={CARD_WIDTH + CARD_MARGIN*2}
          snapToAlignment="start"
          contentContainerStyle={styles.content}
          showsHorizontalScrollIndicator={false}
        >
          {swipeCards}
        </ScrollView>

      </View>
    );
  }
}
