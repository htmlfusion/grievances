import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import {Text, Card, CardItem, Button, Title, Thumbnail} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import Dimensions from 'Dimensions';
import ErrorAlert from './ErrorAlert';

const {
  ShareDialog
} = require('react-native-fbsdk');
const  shareLinkContent = {
  contentType: 'link',
  contentUrl: "https://facebook.com",
  contentDescription: 'Wow, check out this great site!',
};

var {height, width} = Dimensions.get('window');

let THEME_COLOR= '#5067FF';
let styles = StyleSheet.create({
  card: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    padding: 8
  },
  btns: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 5
  },
  btn: {
    marginRight: 3
  },
  cardItem: {
    flexDirection: 'row',
    borderBottomWidth: 0,
    padding: 0
  },
  upVoted: {
    fontSize: 20,
    color: THEME_COLOR
  },
  notUpVoted: {
    fontSize: 20
  },
  msg: {
    color: THEME_COLOR
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
      if (this.props.marker.reportedUser && this.props.auth.objectId === this.props.marker.reportedUser._id)
        upVoteMsg = upVoteMsg+' upvotes';
      else
        upVoteBtn = <Icon style={styles.notUpVoted} name="thumbs-up" onPress={this.props.grievanceFeedback.bind(this, 'yes')}/>;
    }

    if (this.props.marker.curlyUrlSmall) {
      thumbnail = <Thumbnail square small style={this.props.thumbnailDim} source={{uri: this.props.marker.curlyUrlSmall}}/>;
    }
    return (
        <Card style={[styles.card, this.props.cardDimension]}>
          <CardItem style= {styles.cardItem} onPress={this.props.cardAction}>
            <View style={{height: this.props.thumbnailDim.height}}>{thumbnail}</View>
            <View style={{paddingLeft: 5, flexDirection: 'column', justifyContent: 'space-between', flex: 2}}>
              <View><Text style={{fontSize: 16, fontWeight: '500'}}>{this.props.marker.tag}</Text></View>
                <View style={{flex: 1}}>
                  <Button transparent >
                    <Icon name="social-facebook"/>
                    <Icon name="social-googleplus"/>
                  </Button>
                </View>
              <View style={{flex: 2, overflow: 'hidden', paddingTop: 3}}><Text numberOfLines={this.props.noLines} style={{lineHeight: 12, fontSize: 12}}>{this.props.marker.description}</Text></View>
              <View style={styles.btns}>
                <View><Text note style={styles.msg}>{upVoteMsg}</Text></View>
                <View>{upVoteBtn}</View>
              </View>
            </View>
          </CardItem>
        </Card>
    );
  }
}
