import React, {Component, useReducer} from 'react';
import superagent from 'superagent';
import firebase from 'react-native-firebase';
import {Actions} from 'react-native-router-flux';

import {Text, View, ScrollView} from 'react-native';
import {Card, Button, CardSection, Loader} from '../common/';

export default class UploadRequest extends Component {
  state = {
    uploadLoader: false,
    loading: false,
  };

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

  uploadToDb = (date, imageurl, schedule) => {
    console.log('a gia ma');
    console.log(date, imageurl, schedule);

    const {currentUser} = firebase.auth();

    const streetName = this.props.streetName;

    const locality = this.props.locality;

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
  };
  uploadStatus() {
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
      </View>
    );
  }
  checkAttendance() {
    if (this.props.checkTime) {
      console.log(this.props.checkTime);
      let d = new Date(parseInt(this.props.checkTime, 10)).toString();
      const B = (props) => <Text style={{color: 'green'}}>{d}</Text>;
      const S = (props) => (
        <Text style={{color: 'red'}}>{this.props.checkSchedule}</Text>
      );

      return (
        <CardSection style={styles.cardSectionStyle}>
          <Text style={styles.textStyle}>
            Last attendance submitted at : {'\n'} <B></B> {'\n'}
          </Text>
        </CardSection>
      );
    }
  }
  render() {
    return (
      <ScrollView>
        <View>
          <View style={styles.logoContainer}></View>
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
