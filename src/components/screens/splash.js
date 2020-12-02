import React, {Component} from 'react';
import {Text, StyleSheet, ActivityIndicator} from 'react-native';

export default class Splash extends Component {
  render() {
    return (
      <>
        <ActivityIndicator
          style={[styles.centering]}
          size="large"
          color="white"></ActivityIndicator>
        <Text style={styles.text}>
          Please wait, fetching your location .....{' '}
        </Text>
      </>
    );
  }
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    alignSelf: 'stretch',
    width: null,
  },
  text: {
    textAlign: 'center',
    color: 'black',
    backgroundColor: 'rgba(0,0,0,0)',
    fontSize: 18,
    paddingBottom: 100,
  },
  centering: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
