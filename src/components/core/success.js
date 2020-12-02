import React, {Component} from 'react';

import {Text, View, Image, Platform, BackHandler} from 'react-native';

import {Button, CardSection} from '../common/';

export default class SuccessView extends Component {
  successSwitch() {
    if (Platform.OS === 'ios') {
      return <Text style={styles.textStyle}>.</Text>;
    }
    return (
      <CardSection style={styles.cardSectionStyle}>
        <Button onPress={() => BackHandler.exitApp()}>Done</Button>
      </CardSection>
    );
  }
  render() {
    return (
      <View>
        <View style={styles.logoContainer}>
          <Image source={require('../../Images/images.png')} />
        </View>
        <CardSection style={styles.cardSectionStyle}>
          <Text style={styles.textStyle}>
            Your Attendance Has been submitted - Happy Working
          </Text>
        </CardSection>
        {this.successSwitch()}
      </View>
    );
  }
}
const styles = {
  cardSectionStyle: {
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'center',
  },
  textStyle: {
    flex: 1,
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 40,
    paddingTop: 50,
    paddingBottom: 50,
  },
  containerStyle: {
    backgroundColor: 'rgba(0,0,0.75)',
    position: 'relative',
    flex: 1,
    justifyContent: 'center',
  },
};
