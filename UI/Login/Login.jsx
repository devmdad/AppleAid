import React, { useState, useEffect } from 'react';
import {GoogleSignin, GoogleSigninButton , statusCodes } from '@react-native-google-signin/google-signin';
import {StyleSheet, TouchableOpacity, View, Text} from 'react-native';
import auth from '@react-native-firebase/auth';

const Login = ({onManualLogin, onUpdateManualLogin}) => {

    // useEffect(() => {
    //     GoogleSignin.configure();
    // }, []);

    const handleManualEmailNavigate = () => {
        onUpdateManualLogin(!onManualLogin);
        console.log(onManualLogin);
    }


    useEffect(() => {
        GoogleSignin.configure({
          scopes: ['email'], // what API you want to access on behalf of the user, default is email and profile
          webClientId:
            '471027721988-vsqtfcd0l3hbe0183e3cna0knirk3g5d.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
          offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
        });
      }, []);

    const [userInfo, setUserInfo] = useState(null);
    
    const GoogleLogIn = async () => {
        try {
          await GoogleSignin.hasPlayServices();

          const { user, accessToken, idToken } = await GoogleSignin.signIn();
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

      signOut = async () => {
        try {
          await GoogleSignin.signOut();
          setUserInfo({ user: null }); // Remember to remove the user from your app's state as well
        } catch (error) {
          console.error(error);
        }
      };


  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.btnStyle} onPress={GoogleLogIn}>
        <Text>Google Signin</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btnStyle} onPress={signOut}>
        <Text>Signout</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btnStyle} onPress={handleManualEmailNavigate}>
        <Text>Manual Login</Text>
      </TouchableOpacity>
    </View>
  );
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  btnStyle: {
    height: 48,
    paddingHorizontal: 8,
    backgroundColor: 'pink',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
});

export default Login;
