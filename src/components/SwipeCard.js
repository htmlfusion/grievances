import React, {Component} from 'react';
import {StyleSheet, View, TouchableWithoutFeedback} from 'react-native';
import {Text, Card, CardItem, Button, Title, Thumbnail} from 'native-base';
import Dimensions from 'Dimensions';
import ErrorAlert from './ErrorAlert';
var {height, width} = Dimensions.get('window');

let styles = StyleSheet.create({
  card: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginBottom: 10,
    width: width-width/4,
    height: height/5
  },
  btns: {
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  btn: {
    marginRight: 3
  },
  cardItem: {
    flexDirection: 'row'
  }
});

export default class SwipeCard extends Component {
  constructor(props) {
    super(props);
    this.errorAlert = new ErrorAlert();
    /*this.state = {
      feedback:
    }*/
  }

  render() {
    let upVoteMsg = "Nobody upvoted this issue",
      upVoteBtn = null,
      thumbnail = null;

    this.errorAlert.checkError(this.props.marker.error);
    console.log('check ths', this.props.marker.curlyUrlSmall);
    if (this.props.marker.upVotedCount > 0) {
      upVoteMsg = `${this.props.marker.upVotedCount} upvoted this issue`;
    }
    if (this.props.marker.isUpVoted === 'yes') {
      upVoteBtn = <Button small onPress={this.props.grievanceFeedback.bind(this, 'no')}>{'-1'}</Button>;
    } else if (this.props.auth && this.props.auth.objectId !== this.props.marker.reportedUser) {
      upVoteBtn = <Button small onPress={this.props.grievanceFeedback.bind(this, 'yes')}>{'+1'}</Button>;
    }

    if (this.props.marker.curlyUrlSmall) {
      thumbnail = <Thumbnail square small source={{uri: this.props.marker.curlyUrlSmall}}/>;
    }
    return (
      <View>
        <Card style={styles.card}>
            <TouchableWithoutFeedback onPressIn={this.props.cardAction}>
              <CardItem style= {styles.cardItem}>
                <View>{thumbnail}</View>
                <View>
                  <Title>{this.props.marker.tag}</Title>
                  <Text>{this.props.marker.description}</Text>
                  <View style={styles.btns}>
                    <View>{upVoteBtn}</View>
                    <View><Text note>{upVoteMsg}</Text></View>
                  </View>
                </View>
              </CardItem>
            </TouchableWithoutFeedback>
        </Card>
      </View>
    );
  }
}
