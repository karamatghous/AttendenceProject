/**
 * @Author: Harsha Attray <harsha>
 * @Date:   2017-08-17T18:15:36+05:30
 * @Project: Retailstore-Attendance-Monitor
 * @Filename: upload.js
 * @Last modified by:   harsha
 * @Last modified time: 2017-08-22T15:32:33+05:30
 * @License: Apache License v2.0
 */

import React, {Component, useReducer} from 'react';
/*superagent for network requests*/
import superagent from 'superagent';
/*sha1  js function for hashing messages with the SHA-1 algorithm*/
import sha1 from 'sha1';
import firebase from 'react-native-firebase';
/*State traversal workhorse function for route traversal*/
import {Actions} from 'react-native-router-flux';

/*react-native-dotenv extracts keys defined in .env file.
Here we import Cloudinary Credentials and keys*/
// import {
//   CLOUDINARY_CLOUDNAME,
//   CLOUDINARY_API_SECRET,
//   CLOUDINARY_API_KEY,
//   CLOUDINARY_UPLOAD_PRESET
// } from 'react-native-dotenv';

import {
  Text,
  View,
  Alert,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
/*Importing Common UI-components*/
import {Card, Button, CardSection, Loader} from '../common/';
import SuccessView from './success';

/*Upload Screen Component*/
export default class UploadRequest extends Component {
  /* Defining state variables which can be manipulated later*/
  state = {
    uploadLoader: false,
    loading: false,
  };
  /*uploadImage Function with Cloudinary upload request along with image encoding and
  data retrieval from cloudinary*/
  uploadImage(text) {
    const {currentUser} = firebase.auth();
    const d = Date.now();
    this.setState({uploadLoader: true});
    let reference = firebase.storage().ref(`${d}/${currentUser._user.uid}`);
    let task = reference.putFile(this.props.SavedImage);
    task
      .then((rs) => {
        console.log(rs);
        console.log('Image uploaded to the bucket!');
        this.uploadToDb(rs.metadata.timeCreated, rs.downloadURL, text);
        this.setState({
          uploadLoader: false,
          status: 'Image uploaded successfully',
        });
      })
      .catch((e) => {
        status = 'Something went wrong';
        console.log('uploading image error => ', e);
        this.setState({uploadLoader: false, status: 'Something went wrong'});
      });
  }
  showProgress() {
    if (this.state.loading) {
      return <Progress.CircleSnail color={['orange']} />;
    }
  }

  /*uploadToDb)() function executes  a FirebaseDB  write call with an upload path and params */
  uploadToDb = (date, imageurl, schedule) => {
    console.log('a gia ma');
    console.log(date, imageurl, schedule);
    /*This fetches the currentUser details from firebase.
    We use this to extract the uid(unique id  generated by firebase for each user) */
    const {currentUser} = firebase.auth();
    /*the streetName variable is updated with the reverse geocoded data passed on from the
    AttendanceCam view via Actions(). These are accessed via props*/
    const streetName = this.props.streetName;
    /*the locality variable is updated with the reverse geocoded data passed on from the
    AttendanceCam view via Actions(). These are accessed via props*/
    const locality = this.props.locality;
    /*FirebaseDB upload call with the upload path.This is a custom path set to
    access employee records.Accessibility  of the data from this path is based
    on the DB rules set in the firebase console
    */
    firebase
      .database()
      .ref(`/employees/records/${currentUser._user.uid}/`)
      .push({
        date,
        imageurl,
        streetName,
        locality,
        schedule,
      })
      .then(() => {
        Actions.successView();
      });
    /*Upon success, the Actions() based scene traversal takes over and the user is
    directed to successView
    */
  };
  uploadStatus() {
    /*renders the check-in and Check-Out buttons with the uploadImage() function call
    each button takes in a requisite text param that is passed on based on the kind of
    attendance check the user is attempting
    */
    if (this.state.uploadLoader) {
      return <Loader size="small" />;
    }
    return (
      <View>
        <Card>
          <CardSection>
            <Button onPress={this.uploadImage.bind(this, 'Check-In')}>
              Check-In
            </Button>
          </CardSection>
        </Card>
        {/* <Card style={{paddingTop: 300}}>
          <CardSection styles={{paddingTop: 100}}>
            <Button onPress={this.uploadImage.bind(this, 'Check-Out')}>
              Check-Out
            </Button>
          </CardSection>
        </Card> */}
      </View>
    );
  }
  checkAttendance() {
    /*checkAttendance() is a status watcher function that shows the user their last
    attendance update if any*/
    if (this.props.checkTime) {
      /*Inline styled components to show the time and the kind of attendance that
      the user has uploaded previously*/
      console.log(this.props.checkTime);
      let d = new Date(parseInt(this.props.checkTime, 10)).toString();
      const B = (props) => <Text style={{color: 'green'}}>{d}</Text>;
      const S = (props) => (
        <Text style={{color: 'red'}}>{this.props.checkSchedule}</Text>
      );

      //    const T = (props) => <Text style={{ color: 'orange' }}>
      //    Last attendance submitted at
      //  </Text>;

      return (
        <CardSection style={styles.cardSectionStyle}>
          <Text style={styles.textStyle}>
            Last attendance submitted at : {'\n'} <B></B> {'\n'}
            {/* Check-Type:{' '} */}
            {/* <S></S> {'\n'}
            Please select one of the choices below to submit your attendance */}
          </Text>
        </CardSection>
      );
    }
    // return (
    //   <CardSection style={styles.cardSectionStyle}>
    //     <Text style={styles.textStyle}>
    //       Please select one of the choices below to submit your attendance
    //     </Text>
    //   </CardSection>
    // );
  }
  render() {
    return (
      <ScrollView>
        <View>
          <View style={styles.logoContainer}>
            <Image source={require('../../Images/images.png')} />
          </View>
          {this.checkAttendance()}
          {this.uploadStatus()}
          {/* <SuccessView /> */}
        </View>
      </ScrollView>
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
};
