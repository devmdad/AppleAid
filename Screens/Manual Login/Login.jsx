// Login.js
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import {COLORS, SIZES} from '../../constants/theme';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import ImageUploadScreen from '../Main Screens/ImageUploadScreen';
import {useDispatch} from 'react-redux';
import {loginSuccess} from '../authSlice';

const Login = ({navigation}) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = useState(null);

  const dispatch = useDispatch(); // Example of using Redux dispatch

  const handleLogin = async () => {
    try {
      if (email && password) {
        const userCredential = await auth().signInWithEmailAndPassword(
          email,
          password,
        );

        console.log('User logged in:', userCredential.user);
        dispatch(loginSuccess());
        navigation.navigate('Home');
      } else {
        throw new Error(error);
      }
      // setError(null);
    } catch (error) {
      console.error('Login failed:', error.message);
      setError('Invalid or empty email or password!');
      // setEmail('');
      // setPassword('');
    }
  };

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
      dispatch(loginSuccess());
      navigation.navigate('Home');
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

  const handleForgotPassword = async () => {
    try {
      await auth().sendPasswordResetEmail(email);
      console.log('Password reset email sent successfully.');
    } catch (error) {
      console.error('Forgot password failed:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.subcontainer}>
        <Image
          source={require('../../assets/app_icon.png')}
          style={{
            width: 200,
            height: 200,
            resizeMode: 'contain',
            margin: 10,
          }}
        />
        <Text
          style={{
            fontSize: 24,
            color: 'black',
            fontWeight: '800',
            marginBottom: 20,
          }}>
          LOGIN
        </Text>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={text => setEmail(text)}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="grey"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={text => setPassword(text)}
          placeholderTextColor="grey"
        />
        <TouchableOpacity
          onPress={handleLogin}
          style={{
            backgroundColor: COLORS.primary,
            borderRadius: 4,
          }}>
          <Text
            style={{
              paddingHorizontal: 30,
              paddingVertical: 12,
              color: 'white',
              fontWeight: '500',
              fontSize: 16,
            }}>
            LOGIN
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Registeration')}>
          <Text style={styles.registerLink}>
            Don't have an account? Register
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.googleContainer}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    height: SIZES.height,
  },

  subcontainer: {
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
  },

  googleContainer: {
    marginTop: 50,
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingLeft: 10,
    color: 'black',
  },
  forgotPassword: {
    marginTop: 10,
    color: 'blue',
  },
  registerLink: {
    marginTop: 16,
    color: 'blue',
    fontWeight: 'bold',
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
  errorText: {
    color: 'red',
    fontSize: 14,
    margin: 10,
  },
});

export default Login;
