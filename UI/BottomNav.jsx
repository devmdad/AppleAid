import {View, Text} from 'react-native';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from '../Screens/HomeScreen';
import { COLORS } from '../constants/theme';
import Tips from '../Screens/Main Screens/Tips/Tips';
import ImageUploadScreen from '../Screens/Main Screens/ImageUploadScreen';
import CommunityScreen from '../Screens/Main Screens/Community/CommunityScreen';
import Profile from '../Screens/Profile';
import Icon from 'react-native-vector-icons/AntDesign';
import FwIcon5 from 'react-native-vector-icons/FontAwesome5';
import FwIcon6 from 'react-native-vector-icons/FontAwesome6';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const BottomNav = () => {

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


  return (

    <View>
        <NavigationContainer independent={true}>
        <Tab.Navigator screenOptions={screenOptions} id="main">
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{
              tabBarIcon: ({focused}) => {
                return (
                  <View
                    style={{alignItems: 'center', justifyContent: 'center'}}>
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
                  <View
                    style={{alignItems: 'center', justifyContent: 'center'}}>
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
                  <View
                    style={{alignItems: 'center', justifyContent: 'center'}}>
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
        </NavigationContainer>
    </View>
  );
};

export default BottomNav;
