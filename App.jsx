import React, {useEffect, useState} from 'react';
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
  Platform,
} from 'react-native';
import OnBoarding from './UI/OnBoarding';
// import Login from './UI/Login/Login';
import ParentEmail from './UI/Login/ParentEmail';
import EmailRegister from './UI/Login/EmailRegister';
import HomeScreen from './Screens/HomeScreen';
// import { navigationRef } from './RootNavigation';
import Login from './Screens/Manual Login/Login';
import Registeration from './Screens/Manual Login/Registeration';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import ForgotPassword from './Screens/Manual Login/ForgotPassword';
import ImageUploadScreen from './Screens/Main Screens/ImageUploadScreen';
import {
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import Tips from './Screens/Main Screens/Tips/Tips';
import CommunityScreen from './Screens/Main Screens/Community/CommunityScreen';
import Profile from './Screens/Profile';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/AntDesign';
import FwIcon5 from 'react-native-vector-icons/FontAwesome5';
import FwIcon6 from 'react-native-vector-icons/FontAwesome6';
import BottomNav from './UI/BottomNav';
import Navigation from './UI/Navigation';
import {Provider} from 'react-redux';
import store from './Screens/store';

function App() {
  const [showHomePage, setShowHomePage] = useState(false);
  const Stack = createStackNavigator();

  // const [manualLogin, setManualLogin] = useState(false);

  const updateShowHomepage = newState => {
    setShowHomePage(newState);
  };

  // const updateManualLogin = (newState: boolean) => {
  //   setManualLogin(newState);
  // };

  StatusBar.setBarStyle('light-content', true);
  StatusBar.setBackgroundColor(COLORS.primary);

  let currentUser = auth().currentUser;
  useEffect(() => {
    currentUser = auth().currentUser;
    currentUser && setShowHomePage(true);
    console.log(currentUser);
  }, []);

  if (!showHomePage) {
    return (
      <OnBoarding
        homepage={showHomePage}
        onUpdateShowHomepage={updateShowHomepage}
      />
    );
  }

  const Tab = createBottomTabNavigator();

  return (
    //     <View style={{flex: 1}}>
    //       {/* // <NavigationContainer>
    //     //   <Stack.Navigator initialRouteName={currentUser ? 'Home' : 'Login'}>
    //     //     <Stack.Screen name="Home" component={HomeScreen} />
    //     //     <Stack.Screen name="Login" component={Login} />
    //     //     <Stack.Screen name="Registeration" component={Registeration} />
    //     //     <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
    //     //     {<Stack.Screen name="Home" component={HomeScreen} />
    //     //     {<Stack.Screen name="Community" component={CommunityScreen} />}
    //     //   </Stack.Navigator>
    //     // </NavigationContainer> */}

    //       {/* <NavigationContainer>

    //      <Stack.Navigator>
    //             <Stack.Screen name="Home" component={HomeScreen} />
    //             <Stack.Screen name="Login" component={Login} />
    //             <Stack.Screen name="Registeration" component={Registeration} />
    //             <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
    //             <Stack.Screen name="Community" component={CommunityScreen} />
    //           </Stack.Navigator>
    // </NavigationContainer> */}

    //       <NavigationContainer independent={true}>
    //         <Stack.Navigator>
    //           <Stack.Screen name="Login" component={Login} />
    //           <Stack.Screen name="Home" component={HomeScreen} />
    //         </Stack.Navigator>
    //       </NavigationContainer>

    //       {currentUser ? (
    //           <BottomNav />
    //       ) : (
    //         <Login />
    //       )}
    //     </View>

    <Provider store={store}>
      <Navigation />
    </Provider>
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
