import React, {Component} from 'react';
import {Platform, PermissionsAndroid} from 'react-native';
import * as firebase from 'react-native-firebase';

import LocationServicesDialogBox from 'react-native-android-location-services-dialog-box';
import FCM, {
  FCMEvent,
  NotificationType,
  WillPresentNotificationResult,
  RemoteNotificationResult,
} from 'react-native-fcm';

import Splash from './src/components/screens/splash';

import RouterComponent from './src/components/core/Router';
import Geolocation from '@react-native-community/geolocation';

export default class App extends Component {
  state = {
    loggedIn: null,
    latitude: '',
    longitude: 'null',
  };

  componentWillMount() {}

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          loggedIn: true,
          userCred: user.email,
        });
      } else {
        this.setState({
          loggedIn: false,
          userCred: '',
        });
      }
    });
    Platform.OS === 'ios' ? this.locationFetchiOS() : this.locationFetchAnd();
    FCM.requestPermissions(); // for iOS
    this.fcmLookup();
  }

  componentWillUnmount() {
    Geolocation.clearWatch(this.navigationId);
    this.notificationListener.remove();
    this.refreshTokenListener.remove();
  }
  locationFetchAnd = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Cool Photo App Camera Permission',
          message:
            'Cool Photo App needs access to your camera ' +
            'so you can take awesome pictures.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      console.log(granted);
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        this.navigationId = Geolocation.watchPosition(
          (position) => {
            this.setState({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              error: null,
            });
          },
          (error) => console.log(error),
          {
            enableHighAccuracy: true,
            timeout: 20000,
            maximumAge: 1000,
          },
        );
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  locationFetchiOS() {
    this.navigationId = Geolocation.watchPosition(
      (position) => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
        });
      },
      (error) => this.setState({error: error.message}),
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000,
        distanceFilter: 10,
      },
    );
  }

  fcmLookup() {
    FCM.requestPermissions(); // for iOS
    FCM.getFCMToken().then((token) => {});
    this.notificationListener = FCM.on(FCMEvent.Notification, async (notif) => {
      if (notif.local_notification) {
      }
      if (notif.opened_from_tray) {
      }

      if (Platform.OS === 'ios') {
        switch (notif._notificationType) {
          case NotificationType.Remote:
            notif.finish(RemoteNotificationResult.NewData);
            break;
          case NotificationType.NotificationResponse:
            notif.finish();
            break;
          case NotificationType.WillPresent:
            notif.finish(WillPresentNotificationResult.All);
            break;
        }
      }
    });
    this.refreshTokenListener = FCM.on(FCMEvent.RefreshToken, (token) => {});
  }
  render() {
    if (this.state.latitude === '') {
      return <Splash />;
    }
    return (
      <RouterComponent
        lat={this.state.latitude}
        long={this.state.longitude}
        loggedIn={this.state.loggedIn}
      />
    );
  }
}
