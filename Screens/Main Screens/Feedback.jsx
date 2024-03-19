import React, {useState, useEffect} from 'react';
import {View, Text, TextInput, Button, StyleSheet} from 'react-native';
import {firebase} from '@react-native-firebase/firestore';

const Feedback = () => {
  const [feedback, setFeedback] = useState('');
  const [userFeedback, setUserFeedback] = useState([]);

  useEffect(() => {
    fetchUserFeedback(); // Fetch user's feedback on component mount
  }, []);

  const fetchUserFeedback = async () => {
    const currentUser = firebase.auth().currentUser;
    if (currentUser) {
      try {
        const feedbackRef = firebase
          .firestore()
          .collection('feedback')
          .where('userId', '==', currentUser.uid);
        const snapshot = await feedbackRef.get();
        const userFeedbackData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUserFeedback(userFeedbackData);
      } catch (error) {
        console.error('Error fetching user feedback:', error);
      }
    }
  };

  const submitFeedback = async () => {
    const currentUser = firebase.auth().currentUser;
    if (currentUser && feedback) {
      try {
        await firebase.firestore().collection('feedback').add({
          userId: currentUser.uid,
          feedback: feedback,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
        setFeedback(''); // Clear input field after submission
        fetchUserFeedback(); // Fetch updated feedback list
      } catch (error) {
        console.error('Error submitting feedback:', error);
      }
    }
  };

  const handleFeedbackChange = text => {
    setFeedback(text);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Give Feedback</Text>
      <TextInput
        style={styles.input}
        multiline
        numberOfLines={4}
        placeholder="Enter your feedback..."
        value={feedback}
        onChangeText={handleFeedbackChange}
      />
      <Button title="Submit Feedback" onPress={submitFeedback} />

      {/* Display User's Feedback History */}
      <View style={styles.feedbackHistory}>
        <Text style={styles.subtitle}>Your Feedback History</Text>
        {userFeedback.map(item => (
          <View key={item.id} style={styles.feedbackItem}>
            <Text>{item.feedback}</Text>
            {/* Add Edit/Delete buttons here */}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  feedbackHistory: {
    marginTop: 20,
  },
  feedbackItem: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
});

export default Feedback;
