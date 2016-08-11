import React, {Component} from 'react';
import {StyleSheet, View, TouchableWithoutFeedback} from 'react-native';
import {Text, Card, CardItem, Button, Title, Thumbnail} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import Dimensions from 'Dimensions';
import ErrorAlert from './ErrorAlert';
var {height, width} = Dimensions.get('window');

let styles = StyleSheet.create({
  card: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginBottom: 10,
    borderBottomWidth: 1
  },
  btns: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  btn: {
    marginRight: 3
  },
  cardItem: {
    flexDirection: 'row',
    borderBottomWidth: 0,
    padding: 0,
    width: width-width/4,
    height: height/7
  },
  upVoted: {
    fontSize: 27,
    color: '#337ab7'
  },
  notUpVoted: {
    fontSize: 27
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
    let upVoteMsg = `${this.props.marker.upVotedCount} `,
      upVoteBtn = null,
      thumbnail = null;

    this.errorAlert.checkError(this.props.marker.error);

    if (this.props.marker.isUpVoted === 'yes') {
      upVoteBtn = <Icon style={styles.upVoted} name="thumbs-up" onPress={this.props.grievanceFeedback.bind(this, 'no')}/>;
    } else if (this.props.auth) {
      if (this.props.marker.reportedUser && this.props.auth.objectId !== this.props.marker.reportedUser._id)
        upVoteBtn = <Icon style={styles.notUpVoted} name="thumbs-up" onPress={this.props.grievanceFeedback.bind(this, 'yes')}/>;
      else
        upVoteMsg = upVoteMsg+' upvoted';
    }

    if (this.props.marker.curlyUrlSmall) {
      thumbnail = <Thumbnail square small style={{width: height/7, height: height/7}} source={{uri: this.props.marker.curlyUrlSmall}}/>;
    }
    return (
      <View>
        <Card style={styles.card}>
            <TouchableWithoutFeedback onPressIn={this.props.cardAction}>
              <CardItem style= {styles.cardItem}>
                <View>{thumbnail}</View>
                <View style={{paddingTop: 2, paddingBottom: 2, paddingRight: 2, paddingLeft: 4, flexDirection: 'column', justifyContent: 'space-between', flex: 2}}>
                  <View><Title style={{fontSize: 16, fontWeight: '500'}}>{this.props.marker.tag}</Title></View>
                  <View style={{flex: 2, overflow: 'hidden', paddingTop: 3}}><Text numberOfLines={4} style={{lineHeight: 12, fontSize: 12}}>{this.props.marker.description}</Text></View>
                  <View style={styles.btns}>
                    <View><Text note>{upVoteMsg}</Text></View>
                    <View>{upVoteBtn}</View>
                  </View>
                </View>
              </CardItem>
            </TouchableWithoutFeedback>
        </Card>
      </View>
    );
  }
}
