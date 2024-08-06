// FeedbackModal.js

import React from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  useColorScheme,
} from 'react-native';
import Feedback from './Feedback'; // Import your FeedbackScreen component
import Icon from 'react-native-vector-icons/AntDesign';

const FeedbackModal = ({visible, onClose}) => {
  const colorScheme = useColorScheme();
  // const isDarkMode = colorScheme === 'dark';
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View
        style={{
          flex: 1,
          backgroundColor: colorScheme === 'dark' ? 'black' : 'white',
        }}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Icon name="closecircle" size={24} color="gray" />
        </TouchableOpacity>
        <Feedback />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
  },
});

export default FeedbackModal;
