import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, Text} from 'native-base';

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

export default class UserButton extends Component {
  constructor(props) {
    super(props);
    this.btnAction = this.btnAction.bind(this);
  }
  btnAction() {
    const btnAction = this.props.btnAction;

    if (btnAction) {
      btnAction();
    }
  }
  render() {
    const parentStyle = Object.assign({}, {position: 'absolute', alignItems: 'center', top: -7, justifyContent: 'center'}, this.props.btnAlign);
    let fullname = null;
    if (this.props.displayText) {
      fullname=<Text>{this.props.displayText.fullname}</Text>;
    }
    return (<View style={parentStyle}>
      <View>
        <Button ref={this.props.type} small rounded transparent style={this.props.styleProp.parent} onPress={this.btnAction}>
          <Text style={this.props.styleProp.child}>{this.props.displayPic}</Text>
        </Button>
      </View>
      {fullname}
    </View>);
  }
}
