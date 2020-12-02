import React, {Component} from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Image,
  ScrollView,
} from 'react-native';
import firebase from 'react-native-firebase';
import {Actions} from 'react-native-router-flux';
import {Button, Card, CardSection, Input, Loader} from '../common/';

class LoginScreen extends Component {
  state = {
    email: '',
    password: '',
    fname: '',
    lname: '',
    id: '',
    error: '',
    loading: false,
    userCheck: false,
  };

  onloginSubmit() {
    const {email, password} = this.state;
    console.log('onloginSubmit', email, password);
    this.setState({
      error: '',
      loading: true,
    });

    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        console.log('response');
        this.loginSuccessHandle();
      })
      .catch((e) => {
        console.log('error');
        this.loginFailedHandle(e);
        alert(e);
      });
  }

  onUserCreate() {
    this.userCreate();
    const {email, password, fname, lname, id} = this.state;
    if (this.state.fname) {
      this.setState({
        error: '',
        loading: true,
      });
      const name = fname + ' ' + lname;
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then((user) => {
          console.log('user', user);
          this.loginSuccessHandle();

          user.user.updateProfile({
            displayName: name,
          });
          const {currentUser} = firebase.auth();

          firebase
            .database()
            .ref(`/employees/info/${currentUser._user.uid}/`)
            .push({
              name,
              email,
              id,
            });
          this.loginSuccessHandle();
        })
        .catch(this.loginFailedHandle.bind(this));
    } else {
      this.setState({
        error: 'Please enter First name',
        loading: false,
      });
    }
  }

  loginSuccessHandle = () => {
    console.log('Q G CHASS AE KA NAE');
    Actions.mainCamView();
    this.setState({
      email: '',
      password: '',
      loading: false,
      error: '',
    });
  };
  loginFailedHandle(w) {
    console.log(w);
    this.setState({
      error: 'Authentication Failed',
      loading: false,
    });
  }
  passwordReset() {
    Actions.passwordReset();
  }

  userCreate() {
    this.setState({
      userCheck: true,
      loading: false,
    });
  }

  initScreen() {
    this.setState({
      userCheck: false,
      loading: false,
      error: '',
    });
  }
  loadingCheck() {
    if (this.state.loading) {
      return <Loader size="small" />;
    } else if (this.state.userCheck) {
      return (
        <Button onPress={this.onUserCreate.bind(this)}>Create User</Button>
      );
    }
    return (
      <Button
        disabled={!this.state.email}
        onPress={this.onloginSubmit.bind(this)}>
        Login
      </Button>
    );
  }
  toggleSignup() {
    if (this.state.loading) {
      return <Loader size="small" />;
    } else if (this.state.userCheck) {
      return (
        <Card>
          <CardSection>
            <Button onPress={this.initScreen.bind(this)}>Back</Button>
          </CardSection>
        </Card>
      );
    }
    return (
      <Card>
        <CardSection>
          <Button onPress={this.userCreate.bind(this)}>Create User</Button>
        </CardSection>
        <CardSection>
          <Text
            style={styles.textStyle}
            onPress={this.passwordReset.bind(this)}>
            Forgot Password?
          </Text>
        </CardSection>
      </Card>
    );
  }
  createUserForm() {
    if (this.state.userCheck) {
      return (
        <View>
          <KeyboardAvoidingView behavior="padding">
            <CardSection>
              <Input
                value={this.state.fname}
                label="First Name :"
                placeholder="Enter First Name "
                onChangeText={(fname) => this.setState({fname})}
              />
            </CardSection>
            <CardSection>
              <Input
                value={this.state.lname}
                label="Last Name :"
                placeholder="Enter Last Name "
                onChangeText={(lname) => this.setState({lname})}
              />
            </CardSection>
            <CardSection>
              <Input
                value={this.state.id}
                label="EmpId :"
                placeholder="Employee ID "
                onChangeText={(id) => this.setState({id})}
              />
            </CardSection>
          </KeyboardAvoidingView>
        </View>
      );
    }
  }
  render() {
    return (
      <ScrollView>
        <View style={styles.loginStyles}>
          <KeyboardAvoidingView behavior="padding">
            <Card>
              {this.createUserForm()}
              <CardSection>
                <Input
                  value={this.state.email}
                  label="Email :"
                  placeholder="example@email.com"
                  onChangeText={(email) => this.setState({email})}
                />
              </CardSection>
              <CardSection>
                <Input
                  secureTextEntry={true}
                  label="Password :"
                  placeholder="Enter password"
                  value={this.state.password}
                  onChangeText={(password) => this.setState({password})}
                />
              </CardSection>
              <Text style={styles.errorTextStyles}>{this.state.error}</Text>
              <Text style={styles.text}>
                {' '}
                * Password must be 6 characters long
              </Text>
              <CardSection>{this.loadingCheck()}</CardSection>
              {this.toggleSignup()}
            </Card>
          </KeyboardAvoidingView>
        </View>
      </ScrollView>
    );
  }
}

const styles = {
  loginStyles: {
    paddingTop: 100,
    color: 'blue',
  },
  logoContainer: {
    paddingTop: 50,
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'center',
  },
  errorTextStyles: {
    fontSize: 20,
    alignSelf: 'center',
    color: 'orange',
  },
  textStyle: {
    flex: 1,
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 40,
    paddingTop: 20,
    color: 'blue',
    paddingBottom: 20,
  },
  text: {
    textAlign: 'center',
    color: 'blue',
    backgroundColor: 'rgba(0,0,0,0)',
    fontSize: 16,
  },
};

export default LoginScreen;
