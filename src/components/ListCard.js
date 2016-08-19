import React, {Component} from 'react';
import {StyleSheet, View, ScrollView} from 'react-native';
import {List, ListItem} from 'native-base';
import Dimensions from 'Dimensions';
var {height, width} = Dimensions.get('window');

import SwipeCard from './SwipeCard';

const styles = StyleSheet.create({

});

export default class ListCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      markers: this.props.data
    };
  }
  render() {
    let cardHeight = height/10,
      thumbnailWidth = height/10;

    let listItems = this.state.markers.map((marker, idx) => (
        <SwipeCard
          key={idx}
          marker = {marker}
          auth = {this.props.auth}
          noLines={2}
          cardDimension={{width: width, height: cardHeight}}
          thumbnailDim={{width: thumbnailWidth, height: thumbnailWidth}}
          cardAction={this.props.updateGrievance.bind(this, marker, idx)}
          grievanceFeedback={this.props.grievanceFeedback.bind(this, marker._id, idx)}
        />
    ));

    return (
      <List>
         <ScrollView>{listItems}</ScrollView>
     </List>
    );
  }
}
