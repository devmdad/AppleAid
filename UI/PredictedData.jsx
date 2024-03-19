import {View, Text, StyleSheet} from 'react-native';
import React from 'react';

const PredictedData = () => {
  return (
    <View
      style={{
        backgroundColor: 'white',
        width: 300,
        padding: 12,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
      }}>
      <View style={styles.pwrapper}>
        <Text style={styles.ptext}>Label: </Text>
        <Text style={styles.ptext}>Cedar Apple Rust </Text>
      </View>

      <View style={styles.pwrapper}>
        <Text style={styles.ptext}>Confidence: </Text>
        <Text style={styles.ptext}>98.2% </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pwrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },

  ptext: {
    fontSize: 16,
    fontWeight: '500',
    color: 'black',
  },
});

export default PredictedData;
