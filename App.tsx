import React, {useState} from 'react';
import type {PropsWithChildren} from 'react';
import {COLORS, SIZES} from './constants/theme';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Image,
} from 'react-native';
import OnBoarding from './UI/OnBoarding';
// import Login from './UI/Login/Login';
import ParentEmail from './UI/Login/ParentEmail';
import EmailRegister from './UI/Login/EmailRegister';
import HomeScreen from './Screens/HomeScreen';
// import { navigationRef } from './RootNavigation';
import Login from './Screens/Manual Login/Login';
import Registeration from './Screens/Manual Login/Registeration';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ForgotPassword from './Screens/Manual Login/ForgotPassword';
import ImageUploadScreen from './Screens/Main Screens/ImageUploadScreen';

const Stack = createStackNavigator();

function App(): JSX.Element {
  const [showHomePage, setShowHomePage] = useState(false);
  // const [manualLogin, setManualLogin] = useState(false);

  const updateShowHomepage = (newState: boolean) => {
    setShowHomePage(newState);
  };

  // const updateManualLogin = (newState: boolean) => {
  //   setManualLogin(newState);
  // };

  StatusBar.setBarStyle('light-content', true);
  StatusBar.setBackgroundColor(COLORS.primary);

  if (!showHomePage) {
    return (
      <OnBoarding
        homepage={showHomePage}
        onUpdateShowHomepage={updateShowHomepage}
      />
    );
  }

  return (
    // <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    //   {/* Other components */}
    //   <Login />
    // </View>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Registeration" component={Registeration} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="ImageUpload" component={ImageUploadScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
