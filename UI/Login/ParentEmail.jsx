// #6 Email Authentication using Firebase Authentication in React Native App
// https://aboutreact.com/react-native-firebase-authentication/
// import "react-native-gesture-handler"
// import {GestureHandlerRootView} from 'react-native-gesture-handler';

// Import React and Component
import React from 'react';

// Import Navigators from React Navigation
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

// Import Screens
import SplashScreen from '../SplashScreen';
import HomeScreen from '../../Screens/HomeScreen';
import EmailLogin from './EmailLogin';
import EmailRegister from './EmailRegister';

const Stack = createStackNavigator();

const Auth = () => {
  // Stack Navigator for Login and Sign up Screen
  return (
    <Stack.Navigator initialRouteName="EmailRegister">
      <Stack.Screen
        name="EmailRegister"
        component={EmailRegister}
      />

      <Stack.Screen
        name="EmailLogin"
        component={EmailLogin}
      />
    </Stack.Navigator>
  );
};

/* Main Navigator */
const ParentEmail = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Auth">
        {/* SplashScreen which will come once for 2 Seconds */}
        {/* <Stack.Screen
          name="SplashScreen"
          component={SplashScreen}
          // Hiding header for Splash Screen
          options={{headerShown: false}}
        /> */}
        {/* Auth Navigator which include Login Signup */}
        <Stack.Screen
          name="Auth"
          component={Auth}
          // options={{headerShown: false}}
        />
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default ParentEmail;
