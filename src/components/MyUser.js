import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';

const styles = StyleSheet.create({
  arrowRight: {
    borderBottomWidth: 15,
    borderBottomColor: 'transparent',
    borderLeftWidth: 20,
    borderLeftColor: '#000',
    borderTopWidth: 15,
    borderTopColor: 'transparent',
    height: 0,
    width: 0
  },
  myStyle: {
    height: 30,
    width: 120,
    borderTopWidth: 2,
    borderBottomWidth: 2
  }
});

export default class MyUser extends Component {
  render() {
    return (
      <View style={{flexDirection: 'row'}}>
        <View style={styles.myStyle}>
          {this.props.children}
        </View>
        <View style={styles.arrowRight} />
      </View>
    );
  }
}
