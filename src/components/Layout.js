import React, {Component} from 'react';
import {Container, Content, Header, Footer, Button, Icon,Title,Text} from 'native-base';
import {StyleSheet, View} from 'react-native';
import {Actions} from 'react-native-router-flux';
import _ from 'underscore';

let styles = StyleSheet.create({
  headerFont: {
    color: '#fff'
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
      headerStyle = {
        backgroundColor: '#337ab7',
        borderColor: '#2e6da4',
        flexDirection: 'row',
        justifyContent: 'space-between'
      },
      headerStyleRight = {
        flexDirection: 'row-reverse'
      };

    if (this.props.isHeaderBack) {
      headerBack = <Button transparent onPress={() => Actions.pop()}>
        <Icon name="ios-arrow-back" style={styles.headerFont}/>
      </Button>;
    }
    if (headerTitle) {
      headerTitle = <Title><Text style={styles.headerFont}>{headerTitle}</Text></Title>;
    }
    if (headerRightProps) {
      headerRight = <Button transparent onPress={headerRightProps.action}>
        <Icon name={headerRightProps.iconName} style={styles.headerFont} isDisabled={headerRightProps.isDisabled}/>
      </Button>;
      headerStyle = _.extend({}, headerStyle, headerStyleRight);
    }

    if (headerBack || headerRight || headerTitle) {

      header = <Header style={headerStyle}>
        {headerBack}
        {headerTitle}
        {headerRight}
      </Header>;
    }
    return (
      <Container>
          {header}
        <Content>
          {this.props.children}
        </Content>
        {/*<Footer>
          {footerContent}
        </Footer>*/}
      </Container>
    );

  }
}
