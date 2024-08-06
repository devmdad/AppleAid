import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SIZES } from '../constants/theme';

const ConfirmationModal = ({ isVisible, onCancel, onConfirm }) => {
  if (!isVisible) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.modal}>
        <Text style={styles.title}>Confirmation</Text>
        <Text style={styles.message}>Are you sure you want to delete this item?</Text>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.button} onPress={onCancel}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.confirmButton]} onPress={onConfirm}>
            <Text style={[styles.buttonText, styles.confirmButtonText]}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  modal: {
    backgroundColor: 'black',
    padding: 30,
    borderRadius: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
  },
  buttonText: {
    fontSize: 16,
  },
  confirmButton: {
    backgroundColor: 'red',
  },
  confirmButtonText: {
    color: 'white',
  },
});

export default ConfirmationModal;
