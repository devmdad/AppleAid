// Navigation.js
import React, {useEffect, useState} from 'react';
import {DarkTheme, DefaultTheme, NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useSelector} from 'react-redux'; // If you're using Redux for state management

import {COLORS} from '../constants/theme';
import Tips from '../Screens/Main Screens/Tips/Tips';
import ImageUploadScreen from '../Screens/Main Screens/ImageUploadScreen';
import CommunityScreen from '../Screens/Main Screens/Community/CommunityScreen';
import Profile from '../Screens/Profile';
import Icon from 'react-native-vector-icons/AntDesign';
import FwIcon5 from 'react-native-vector-icons/FontAwesome5';
import FwIcon6 from 'react-native-vector-icons/FontAwesome6';
import Registration from '../Screens/Manual Login/Registeration';
import ForgotPassword from '../Screens/Manual Login/ForgotPassword';
import Login from '../Screens/Manual Login/Login';
import HomeScreen from '../Screens/HomeScreen';
import {Text, View, useColorScheme} from 'react-native';
import auth from '@react-native-firebase/auth';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const screenOptions = {
  tabBarShowLabel: false,
  headerShown: false,
  tabBarStyle: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    elevation: 0,
    height: 60,
    backgroundColor: COLORS.primary,
  },
};

const AuthStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Login" component={Login} />
    {/* Add more screens for registration, forgot password, etc. */}
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="Registeration" component={Registration} />
    <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
    <Stack.Screen name="Community" component={CommunityScreen} />
  </Stack.Navigator>
);

const MainTabs = () => (
  <Tab.Navigator screenOptions={screenOptions} id="main">
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{
        tabBarIcon: ({focused}) => {
          return (
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <Icon
                name="home"
                size={24}
                color={focused ? COLORS.bg : '#fff'}
              />
              <Text style={{fontSize: 12, color: '#fff'}}>HOME</Text>
            </View>
          );
        },
      }}
    />

    <Tab.Screen
      name="Tips"
      component={Tips}
      options={{
        tabBarIcon: ({focused}) => {
          return (
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <Icon
                name="bulb1"
                size={24}
                color={focused ? COLORS.bg : '#fff'}
              />

              <Text style={{fontSize: 12, color: '#fff'}}>TIPS</Text>
            </View>
          );
        },
      }}
    />

    <Tab.Screen
      name="Disease-Detection"
      component={ImageUploadScreen}
      options={{
        tabBarIcon: ({focused}) => {
          return (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: focused ? COLORS.primary : '#f2f2f2',
                width: Platform.OS == 'ios' ? 50 : 60,
                height: Platform.OS == 'ios' ? 50 : 60,
                top: Platform.OS == 'ios' ? -10 : -20,
                borderRadius: Platform.OS == 'ios' ? 25 : 30,
              }}>
              <FwIcon5
                name="virus"
                size={32}
                color={focused ? '#fff' : COLORS.primary}
              />
            </View>
          );
        },
      }}
    />

    <Tab.Screen
      name="Community"
      component={CommunityScreen}
      options={{
        tabBarIcon: ({focused}) => {
          return (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <FwIcon6
                name="people-roof"
                size={24}
                color={focused ? COLORS.bg : '#fff'}
              />

              <Text style={{fontSize: 12, color: '#fff'}}>COMMUNITY</Text>
            </View>
          );
        },
      }}
    />

    <Tab.Screen
      name="Profile"
      component={Profile}
      options={{
        tabBarIcon: ({focused}) => {
          return (
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <Icon
                name="setting"
                size={24}
                color={focused ? COLORS.bg : '#fff'}
              />
              <Text style={{fontSize: 12, color: '#fff'}}>PROFILE</Text>
            </View>
          );
        },
      }}
    />
  </Tab.Navigator>
);

const Navigation = () => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn); // Example of getting login state from Redux

  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(user => {
      setUser(user);
      if (initializing) {
        setInitializing(false);
      }
    });

    return unsubscribe;
  }, []);

  if (initializing) {
    return null;
  }

  return (
    <NavigationContainer theme={isDarkMode ? DarkTheme : DefaultTheme}>
      {user ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default Navigation;
