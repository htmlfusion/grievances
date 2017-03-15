import React, {Component} from 'react';
import {Container, Content, Header, Footer, Button, Icon,Title,Text, Left, Right, Body} from 'native-base';
import {StyleSheet, View} from 'react-native';
import {Actions} from 'react-native-router-flux';
import _ from 'underscore';

let styles = StyleSheet.create({
  headerFont: {

  }
});
export default class Layout extends Component {

  render() {
    let headerRight = null,
      headerRightProps = this.props.headerRight,
      headerBack = null,
      header,
      footerContent = this.props.footerContent,
      headerTitle = this.props.headerTitle,
      headerChildren = this.props.headerChildren,
      noHeaderRight = this.props.noHeaderRight || null,
      headerStyle = {
        flexDirection: 'row',
        justifyContent: 'space-between'
      }/*,
      headerStyleRight = {
        flexDirection: 'row-reverse'
      }*/;

    if (this.props.isHeaderBack) {
      headerBack = <Left><Button transparent onPress={() => Actions.pop()}>
        <Icon name="ios-arrow-back" />
      </Button></Left>;
    }
    if (noHeaderRight) {
      noHeaderRight = <Right></Right>;
    }
    if (headerTitle) {
      headerTitle = <Body>
        <Title>
          {headerTitle}
        </Title>
      </Body>;
    }
    if (headerRightProps) {
      let btnText;
      if (headerRightProps.iconName) {
        btnText=<Icon name={headerRightProps.iconName} />;
      } else {
        btnText=<Text>{headerRightProps.text}</Text>;
      }
      headerRight = <Right>
        <Button transparent onPress={headerRightProps.action} isDisabled={headerRightProps.isDisabled}>
          {btnText}
        </Button>
      </Right>;
      // headerStyle = _.extend({}, headerStyle, headerStyleRight);
    }
    if (this.props.dummyBack) {
      headerBack = <Left>
        <Button transparent></Button>
      </Left>;
    }

    if (headerBack || headerRight || headerTitle || headerChildren) {

      header = <Header>
        {headerBack}
        {headerTitle}
        {headerRight}
        {noHeaderRight}
        {headerChildren}
      </Header>;
    }
    return (
      <Container style={{flex: 1}}>
          {header}
        <Content style={{paddingRight: 10, paddingLeft: 10}}>
          {this.props.children}
        </Content>
        {/*<Footer>
          {footerContent}
        </Footer>*/}
      </Container>
    );

  }
}
