import React, {Component} from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import * as firebase from 'react-native-firebase';
import Geocoder from 'react-native-geocoder';
import {Actions} from 'react-native-router-flux';
import * as Progress from 'react-native-progress';

export default class AttendanceCam extends Component {
  state = {
    cameraType: 'front',
    mirrorMode: true,
    showModal: false,
    position: null,
    captureLoading: false,
    streetName: '',
    locality: '',
    checkTime: null,
    checkSchedule: null,
    loadingCred: false,
  };

  async takeLocation() {
    const NY = {
      lat: this.props.lat,
      lng: this.props.long,
    };

    try {
      const res = await Geocoder.geocodePosition(NY);

      console.log('res', res);
      this.setState({
        streetName: res[0].streetName,
        locality: res[0].formattedAddress,
      });
    } catch (err) {}
  }

  takePicture() {
    this.setState({
      loadingCred: true,
    });

    const options = {};

    this.takeLocation();

    this.camera
      .takePictureAsync({metadata: options})
      .then((data) => {
        const SavedImage = data.uri;
        if (SavedImage) {
          const {currentUser} = firebase.auth();
          console.log('currentUser', currentUser);

          const userPath = '/employees/records/' + `${currentUser._user.uid}`;
          console.log('userPath', userPath);

          firebase
            .database()
            .ref(userPath)
            .on('value', (snapshot) => {
              console.log('snapshot', snapshot);

              if (snapshot.val()) {
                const dataStore = snapshot.val();
                console.log(dataStore);
                const lastCheck = dataStore[Object.keys(dataStore)[0]];
                this.setState({
                  checkTime: lastCheck.date,
                  checkSchedule: lastCheck.schedule,
                });
              }
              this.setState({
                loadingCred: false,
              });

              Actions.initUpload({
                SavedImage,
                streetName: this.state.streetName,
                locality: this.state.locality,
                checkTime: this.state.checkTime,
                checkSchedule: this.state.checkSchedule,
              });
            });
        }
      })
      .catch((err) => console.error(err));
  }

  captureSwitch() {
    if (this.state.loadingCred) {
      return (
        <View style={styles.buttonContainer}>
          <View style={styles.smallButtonContainer}>
            <Progress.CircleSnail color={['orange']} />
          </View>
        </View>
      );
    }

    return (
      <View style={styles.buttonContainer}>
        <View style={styles.smallButtonContainer}>
          <TouchableOpacity
            onPress={this.takePicture.bind(this)}
            transparent
            style={styles.captureButton}>
            <Image source={require('../../Images/ic_camera.png')} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.main}>
        <RNCamera
          ref={(cam) => {
            this.camera = cam;
          }}
          style={styles.camera}
          type={this.state.cameraType}
          mirrorImage={this.state.mirrorMode}
          playSoundOnCapture={false}
        />

        {this.captureSwitch()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  capture: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 5,
    color: '#000',
    padding: 10,
    margin: 40,
  },

  main: {
    flex: 1,
    flexDirection: 'row',
  },
  camera: {
    opacity: 1,
    position: 'absolute',
    backgroundColor: 'white',
    flex: 1,
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
  },

  buttonContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  smallButtonContainer: {
    width: 50,
    height: 50,
    marginBottom: 50,
  },
  captureButton: {
    borderRadius: 50,
    width: 50,
    height: 50,
    backgroundColor: 'white',
  },
});
