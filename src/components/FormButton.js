/**
* # FormButton.js
*
* Display a button that responds to onPress and is colored appropriately
*/
'use strict';
/**
 * ## Imports
 *
 * React
 */
const  ReactNative = require('react-native');
const React = require('react');
const
{
  StyleSheet,
  View
} = ReactNative;

import {Button} from 'native-base';


/**
 * ## Styles
 */
var styles = StyleSheet.create({
  signin: {
    marginLeft: 10,
    marginRight: 10
  }

});

var FormButton = React.createClass({
  /**
   * ### render
   *
   * Display the Button
   */
  render() {
    return (
      <View style={styles.signin}>
        <Button block
            isDisabled={this.props.isDisabled}
            onPress={this.props.onPress}
        >
          {this.props.buttonText}
        </Button>
      </View>
    );
  }
});

module.exports = FormButton;
