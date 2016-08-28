import React, {Component} from 'react';
import {Container, Content, Header, Footer, Button, Icon,Title,Text} from 'native-base';
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
      headerStyle = {
        backgroundColor: '#337ab7',
        borderColor: '#2e6da4',
        flexDirection: 'row',
        justifyContent: 'space-between'
      }/*,
      headerStyleRight = {
        flexDirection: 'row-reverse'
      }*/;

    if (this.props.isHeaderBack) {
      headerBack = <Button transparent onPress={() => Actions.pop()}>
        <Icon name="ios-arrow-back" style={styles.headerFont}/>
      </Button>;
    }
    if (headerTitle) {
      headerTitle = <Title><Text style={styles.headerFont}>{headerTitle}</Text></Title>;
    }
    if (headerRightProps) {
      let btnText;
      if (headerRightProps.iconName) {
        btnText=<Icon name={headerRightProps.iconName} style={styles.headerFont} />;
      } else {
        btnText=headerRightProps.text;

      }
      headerRight = <Button transparent onPress={headerRightProps.action} isDisabled={headerRightProps.isDisabled}>
        {btnText}
      </Button>;
      // headerStyle = _.extend({}, headerStyle, headerStyleRight);
    }
    if (this.props.dummyBack) {
      headerBack = <Button transparent>{''}</Button>;
    }
    if (headerBack || headerRight || headerTitle || headerChildren) {

      header = <Header>
        {headerBack}
        {headerTitle}
        {headerRight}
        {headerChildren}
      </Header>;
    }
    return (
      <Container style={{flex: 1}}>
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
