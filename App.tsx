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
import Login from './UI/Login/Login';



function App(): JSX.Element {
  
  const [showHomePage, setShowHomePage] = useState(false);

  const updateShowHomepage = (newState: boolean) => {
    setShowHomePage(newState);
  }

  StatusBar.setBarStyle('light-content', true);
  StatusBar.setBackgroundColor(COLORS.primary);


  if (!showHomePage) {
    return (
      <OnBoarding homepage={showHomePage} onUpdateShowHomepage={updateShowHomepage}  />
    );
  }

  return (
    <View style={styles.container}>
      <Text>Welcome to Home Screen!</Text>
      <Login />
    </View>
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
