import React, {Component} from 'react';
import {Scene, Router, Actions, ActionConst} from 'react-native-router-flux';
import firebase from 'react-native-firebase';
import LoginScreen from '../screens/LoginScreen';
import AttendanceCam from './AttendanceCam';
import ForgotPassword from '../screens/Forgotpassword';
import UploadRequest from './upload';
import SuccessView from './success';

export default class RouterComponent extends Component {
  logoutHandler() {
    firebase.auth().signOut();

    Actions.auth();
  }
  render() {
    return (
      <Router sceneStyle={{paddingTop: 65}}>
        <Scene key="auth" type={ActionConst.RESET}>
          <Scene
            key="LoginForm"
            component={LoginScreen}
            title="SignUp"
            initial={!this.props.loggedIn}
          />

          <Scene
            key="passwordReset"
            component={ForgotPassword}
            title="Forgot Password"
          />
        </Scene>

        <Scene
          key="mainCamView"
          rightTitle="Logout"
          onRight={this.logoutHandler.bind(this)}
          type={ActionConst.RESET}
          initial={this.props.loggedIn}>
          <Scene
            key="AttendanceCamScreen"
            component={AttendanceCam}
            title="Snap Your attendance here"
            lat={this.props.lat}
            long={this.props.long}
            type={ActionConst.REFRESH}
          />

          <Scene
            key="initUpload"
            title="Upload Screen"
            component={UploadRequest}
          />
        </Scene>

        <Scene key="successView">
          <Scene
            key="success"
            rightTitle="Logout"
            component={SuccessView}
            title="Congratulations"
            onRight={this.logoutHandler.bind(this)}
          />
        </Scene>
      </Router>
    );
  }
}
