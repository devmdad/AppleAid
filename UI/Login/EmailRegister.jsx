// #6 Email Authentication using Firebase Authentication in React Native App
// https://aboutreact.com/react-native-firebase-authentication/

// Import React and Component
import React, {useState, createRef, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TextInput,
  View,
  Text,
  Image,
  KeyboardAvoidingView,
  Keyboard,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';

import auth from '@react-native-firebase/auth';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {COLORS} from '../../constants/theme';

var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height

const EmailRegister = ({ navigation }) => {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [errortext, setErrortext] = useState('');

  const emailInputRef = createRef();
  const passwordInputRef = createRef();

  useEffect(() => {
    GoogleSignin.configure({
      scopes: ['email'], // what API you want to access on behalf of the user, default is email and profile
      webClientId:
        '471027721988-vsqtfcd0l3hbe0183e3cna0knirk3g5d.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
      offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
    });
  }, []);

  const [userInfo, setUserInfo] = useState(null);

  
  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();

      const {user, accessToken, idToken} = await GoogleSignin.signIn();
      setUserInfo(user);
      //   console.log('user info ', user);

      const credential = auth.GoogleAuthProvider.credential(
        idToken,
        accessToken,
      );
      await auth().signInWithCredential(credential);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log(error);
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log(error);
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log(error);
        // play services not available or outdated
      } else {
        console.log(error);
        // some other error happened
      }
    }
  };

  const handleSubmitButton = () => {
    setErrortext('');
    if (!userName) return alert('Please fill Name');
    if (!userEmail) return alert('Please fill Email');
    if (!userPassword) return alert('Please fill Address');

    auth()
      .createUserWithEmailAndPassword(userEmail, userPassword)
      .then(user => {
        console.log('Registration Successful. Please Login to proceed');
        console.log(user);
        if (user) {
          auth()
            .currentUser.updateProfile({
              displayName: userName,
            })
            .then(() => navigation.replace('../../Screens/HomeScreen'))
            .catch(error => {
              alert(error);
              console.error(error);
            });
        }
      })
      .catch(error => {
        console.log(error);
        if (error.code === 'auth/email-already-in-use') {
          setErrortext('That email address is already in use!');
        } else {
          setErrortext(error.message);
        }
      });
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'center',
        width: width,
        backgroundColor: COLORS.bg,
      }}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          height: height,
          justifyContent: 'space-between',
          paddingTop: 20
        }}>
        <View style={{alignItems: "center" }}>
          <Image
            source={require("../../assets/app_icon.png")}
            style={{
              width: 200,
              height: 200,
              resizeMode: "contain",
              margin: 20,
            }}
          />
          <Text style={{fontSize: 24, color: COLORS.primary, fontWeight: 'bold'}}>REGISTER NOW</Text>
        </View>
        <KeyboardAvoidingView enabled>
          <View style={styles.sectionStyle}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={UserName => setUserName(UserName)}
              underlineColorAndroid="#f000"
              placeholder="Enter Name"
              placeholderTextColor="#8b9cb5"
              autoCapitalize="sentences"
              returnKeyType="next"
              onSubmitEditing={() =>
                emailInputRef.current && emailInputRef.current.focus()
              }
              blurOnSubmit={false}
            />
          </View>
          <View style={styles.sectionStyle}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={UserEmail => setUserEmail(UserEmail)}
              underlineColorAndroid="#f000"
              placeholder="Enter Email"
              placeholderTextColor="#8b9cb5"
              keyboardType="email-address"
              ref={emailInputRef}
              returnKeyType="next"
              onSubmitEditing={() =>
                passwordInputRef.current && passwordInputRef.current.focus()
              }
              blurOnSubmit={false}
            />
          </View>
          <View style={styles.sectionStyle}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={UserPassword => setUserPassword(UserPassword)}
              underlineColorAndroid="#f000"
              placeholder="Enter Password"
              placeholderTextColor="#8b9cb5"
              ref={passwordInputRef}
              returnKeyType="next"
              secureTextEntry={true}
              onSubmitEditing={Keyboard.dismiss}
              blurOnSubmit={false}
            />
          </View>
          {errortext != '' ? (
            <Text style={styles.errorTextStyle}> {errortext} </Text>
          ) : null}
          <TouchableOpacity
            style={styles.buttonStyle}
            activeOpacity={0.5}
            onPress={handleSubmitButton}>
            <Text style={styles.buttonTextStyle}>REGISTER</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>

      <Text
        style={{
          fontSize: 16,
          textAlign: 'center',
          color: 'black',
        }}>
        Already have account?
      </Text>
      <Text
        style={{
          marginTop: 4,
          fontSize: 16,
          textAlign: 'center',
          color: 'black',
          fontWeight: 'bold'
        }}>
        Login
      </Text>

      <View style={styles.container}>
        <TouchableOpacity
          onPress={signInWithGoogle}
          style={styles.googleButton}>
          <View style={styles.googleButtonContent}>
            <Text style={styles.googleButtonText}>Sign in with Google</Text>
            <Image
              source={require('../../assets/google_icon.png')}
              style={styles.googleIcon}
            />
          </View>
        </TouchableOpacity>
      </View>
      </ScrollView>

      
    </SafeAreaView>
  );
};
export default EmailRegister;

const styles = StyleSheet.create({
  sectionStyle: {
    flexDirection: 'row',
    height: 50,
    marginTop: 20,
    marginHorizontal: 35,
    margin: 10,
  },
  buttonStyle: {
    backgroundColor: COLORS.primary,
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#7DE24E',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    marginHorizontal: '10%',
    marginVertical: 20,
  },
  buttonTextStyle: {
    color: '#FFFFFF', 
    paddingVertical: 10,
    fontSize: 16,
  },
  inputStyle: {
    flex: 1,
    color: 'white',
    paddingLeft: 15,
    paddingRight: 25,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: COLORS.primary,
  },
  errorTextStyle: {
    color: 'red',
    textAlign: 'center',
    fontSize: 14,
  },

  //

  container: {
    flex: 1,
    marginTop: 40,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  googleButton: {
    backgroundColor: 'white',
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderRadius: 30,
    height: 60,
    width: '80%', // Adjust the width as needed
    alignItems: 'center',
    
  },
  googleButtonContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  googleButtonText: {
    color: '#4285F4', // Google Blue
    fontSize: 16,
    fontWeight: 'bold',
  },
  googleIcon: {
    width: 25,
    height: 25,
  },
});
