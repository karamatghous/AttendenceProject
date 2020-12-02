import React, {Component} from 'react';
import firebase from 'react-native-firebase';
import {Actions} from 'react-native-router-flux';

import {View, Alert} from 'react-native';
import {Button, CardSection, Input, Loader} from '../common/';
export default class Forgot extends Component {
  state = {
    email: '',
    password: '',
    loading: false,
  };

  sendResetLink() {
    this.setState({
      loading: true,
    });
    const {email} = this.state;

    firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        this.setState({
          loading: false,
        });
        Alert.alert(
          'Upload Successful',
          'Sending Credentials',
          [{text: 'OK', onPress: Actions.LoginForm()}],
          {cancelable: false},
        );
      })
      .catch((e) => {
        this.setState({
          loading: false,
        });
        alert(e);
      });
  }
  statusCheck() {
    if (this.state.loading) {
      return <Loader size="small" />;
    }
    return <Button onPress={this.sendResetLink.bind(this)}>Send Link</Button>;
  }

  render() {
    return (
      <View>
        <View style={styles.logoContainer}></View>
        <CardSection>
          <Input
            value={this.state.email}
            label="Email :"
            placeholder="Enter Your email "
            onChangeText={(email) => this.setState({email})}
          />
        </CardSection>
        <CardSection style={styles.cardSectionStyle}>
          {this.statusCheck()}
        </CardSection>
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
