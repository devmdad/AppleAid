import React, {useState} from 'react';
import {Modal, View, TextInput, Button} from 'react-native';

const CommentInputModal = ({visible, onClose, onSubmit}) => {
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    onSubmit(comment);
    setComment('');
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <TextInput
          value={comment}
          onChangeText={setComment}
          placeholder="Enter your comment"
          multiline
          style={{borderWidth: 1, padding: 10, width: '80%', marginBottom: 10}}
        />
        <Button title="Submit" onPress={handleSubmit} />
        <Button title="Cancel" onPress={onClose} />
      </View>
    </Modal>
  );
};

export default CommentInputModal;
