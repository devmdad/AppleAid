import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';

const ReplyInputModal = ({ visible, onClose, commentId }) => {
  const [reply, setReply] = useState('');

  const handleReply = () => {
    // Handle the submission of the reply message
    // Here you can use the commentId to associate the reply with the correct comment
    console.log('Reply:', reply);
    // Clear the reply input
    setReply('');
    // Close the modal
    onClose();
  };

  return (
    visible && (
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Write your reply..."
          value={reply}
          onChangeText={text => setReply(text)}
          multiline
        />
        <TouchableOpacity style={styles.button} onPress={handleReply}>
          <Text style={styles.buttonText}>Reply</Text>
        </TouchableOpacity>
      </View>
    )
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    minHeight: 100,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ReplyInputModal;
