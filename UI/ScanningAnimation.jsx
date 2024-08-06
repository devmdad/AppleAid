// ScanningAnimation.js
import React, {useEffect} from 'react';
import {View, StyleSheet, Animated, Easing} from 'react-native';

const ScanningAnimation = ({visible}) => {
  const rotation = new Animated.Value(0);

  const startAnimation = () => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  };

  useEffect(() => {
    if (visible) {
      startAnimation();
    } else {
      rotation.stopAnimation();
    }
  }, [visible]);

  const rotateInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return visible ? (
    <View style={styles.container}>
      <Animated.View
        style={[styles.animation, {transform: [{rotate: rotateInterpolate}]}]}
      />
    </View>
  ) : null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  animation: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: 'white',
    borderStyle: 'dashed',
  },
});

export default ScanningAnimation;
