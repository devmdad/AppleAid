import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useColorScheme,
  Image,
} from 'react-native';

const CustomBullet = require('../../assets/icons/custom_bullet.png'); // Import the custom bullet icon

const DiseaseInfo = ({disease}) => {
  // const colorScheme = useColorScheme();

  // Define colors based on the color scheme
  const colors = {
    background: '#FFFFFF',
    text: '#000000',
    shadow: '#000000',
  };

  // Define the data for causes and treatments based on the detected disease
  const diseaseData = {
    'Black Rot': {
      causes: [
        'Fungal infection caused by Botryosphaeria obtusa',
        'Spread through infected fruit, leaves, or pruning wounds',
        'Favors warm, wet weather conditions',
      ],
      treatment: [
        'Prune and dispose of infected plant parts',
        'Apply fungicides before flowering and continue as needed',
        'Ensure good air circulation and reduce humidity around plants',
      ],
    },
    'Cedar Apple Rust': {
      causes: [
        'Fungal infection caused by Gymnosporangium juniperi-virginianae',
        'Requires both apple and cedar trees to complete its life cycle',
        'Spreads through spores during wet weather',
      ],
      treatment: [
        'Remove nearby cedar trees if possible',
        'Prune and dispose of infected plant parts',
        'Apply fungicides according to label instructions',
      ],
    },
    'Apple Scab': {
      causes: [
        'Fungal infection caused by Venturia inaequalis',
        'Favors cool, wet weather conditions',
        'Spread through spores released from infected leaves',
      ],
      treatment: [
        'Prune and dispose of infected plant parts',
        'Apply fungicides preventatively',
        'Practice good sanitation to reduce overwintering spores',
      ],
    },
    Healthy: {
      causes: ['The apple is healthy'],
      treatment: ['No treatment required, keep watering!'],
    },
    Other: {
      causes: ['Seems like you have not uploaded the right image'],
      treatment: ['Please upload the apple lead image with a closeup shot'],
    },
  };

  // Get the causes and treatment data based on the detected disease
  const {causes, treatment} = diseaseData[disease];
  // console.log(diseaseData[disease]);

  return (
    <View style={[styles.container]}>
      {/* Healthy or Other */}
      {disease === 'Other' ? (
        <View
          style={[
            styles.block,
            {shadowColor: colors.shadow, backgroundColor: colors.background},
          ]}>
          <Text
            style={[styles.text, {color: colors.text}, {textAlign: 'center'}]}>
            Seems like you didn't upload the right image. Please upload an image
            of apple leaf with a close-up shot
          </Text>
        </View>
      ) : (
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <View
            style={[
              styles.block,
              {shadowColor: colors.shadow, backgroundColor: colors.background},
            ]}>
            <Text style={[styles.title, {color: colors.text}]}>
              Causes of {disease}
            </Text>
            {causes.map((cause, index) => (
              <View key={index} style={styles.listItem}>
                <Image source={CustomBullet} style={styles.bulletIcon} />
                {/* Use custom bullet icon */}
                <Text style={[styles.text, {color: colors.text}]}>{cause}</Text>
              </View>
            ))}
          </View>
          <View
            style={[
              styles.block,
              {shadowColor: colors.shadow, backgroundColor: colors.background},
            ]}>
            <Text style={[styles.title, {color: colors.text}]}>
              Treatment for {disease}
            </Text>
            {treatment.map((treat, index) => (
              <View key={index} style={styles.listItem}>
                <Image source={CustomBullet} style={styles.bulletIcon} />
                {/* Use custom bullet icon */}
                <Text style={[styles.text, {color: colors.text}]}>{treat}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  block: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    width: '90%',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
    lineHeight: 22,
    margin: 10,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10, // Adding margin between list items
  },
  bulletIcon: {
    width: 20,
    height: 20,
    marginRight: 10, // Adjusting margin for bullet icon
  },
});

export default DiseaseInfo;
