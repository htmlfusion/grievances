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

import {Button, Text, Icon} from 'native-base';


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
    let btnText = this.props.buttonText || null,
      btnIcon = this.props.buttonIcon || null;

    if (btnText) {
      btnText = <Text>{this.props.buttonText}</Text>
    }

    return (
      <View style={styles.signin}>
        <Button block
          bordered
            disabled={this.props.isDisabled}
            onPress={this.props.onPress}
        >
          {btnText}
          {btnIcon}
        </Button>
      </View>
    );
  }
});

module.exports = FormButton;
