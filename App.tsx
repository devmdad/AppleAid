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
import AppIntroSlider from 'react-native-app-intro-slider';

const slides = [
  {
    id: 1,
    title: 'Health Check',
    description:
      'Take picture of your crop or upload image to detect disease and receive treatment advice',
    image: require('./assets/onboarding/1-health-check.png'),
  },
  {
    id: 2,
    title: 'Cultivation Tip',
    description:
      'Receive Farming advice about your plant, How to improve yield',
    image: require('./assets/onboarding/2-cultivation-tip.png'),
  },
  {
    id: 3,
    title: 'Community',
    description:
      'Ask a question about your crop to receive help from the community',
    image: require('./assets/onboarding/3-community.png'),
  },
];

function App(): JSX.Element {
  const [showHomePage, setShowHomePage] = useState(false);

  StatusBar.setBarStyle('light-content', true);
  StatusBar.setBackgroundColor(COLORS.primary);

  const buttonLabel = (label: string) => {
    return (
      <View
        style={{
          padding: 12,
        }}>
        <Text
          style={{
            color: COLORS.title,
            fontWeight: '600',
            fontSize: SIZES.h4,
          }}>
          {label}
        </Text>
      </View>
    );
  };

  if (!showHomePage) {
    return (
      <AppIntroSlider
        data={slides}
        renderItem={({item}) => {
          return (
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                padding: 15,
                paddingTop: 100,
              }}>
              <Image
                source={item.image}
                style={{
                  width: SIZES.width - 80,
                  height: 400,
                }}
                resizeMode="contain"
              />
              <Text
                style={{
                  fontWeight: 'bold',
                  color: COLORS.title,
                  fontSize: SIZES.h1,
                }}>
                {item.title}
              </Text>
              <Text
                style={{
                  textAlign: 'center',
                  paddingTop: 5,
                  color: COLORS.title,
                }}>
                {item.description}
              </Text>
            </View>
          );
        }}
        activeDotStyle={{
          backgroundColor: COLORS.primary,
          width: 30,
        }}
        showSkipButton
        renderNextButton={() => buttonLabel('Next')}
        renderSkipButton={() => buttonLabel('Skip')}
        renderDoneButton={() => buttonLabel('Done')}
        onDone={() => {
          setShowHomePage(true);
        }}
      />
    );
  }

  return (
    <View>
      <Text>Welcome to Home Screen!</Text>
    </View>
  );
}

const styles = StyleSheet.create({});

export default App;
