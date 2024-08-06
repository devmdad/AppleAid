import {firebase} from '@react-native-firebase/auth';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Button,
  FlatList,
  SafeAreaView,
} from 'react-native';
import FeedbackModal from './Main Screens/FeedbackModal';
import {COLORS} from '../constants/theme';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import the icon library
import ConfirmationModal from '../UI/ConfirmationModal';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';

const Profile = () => {
  // Configure GoogleSignIn
  GoogleSignin.configure({
    // Add your configuration options here
    webClientId:
      '471027721988-vsqtfcd0l3hbe0183e3cna0knirk3g5d.apps.googleusercontent.com', // Replace with your Web Client ID
  });

  const handleLogout = async () => {
    try {
      // Sign out the current user from Firebase
      await auth().signOut();

      // Revoke access and clear authentication state from Google Sign-In
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const [detectionHistory, setDetectionHistory] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);

  useEffect(() => {
    const fetchDetectionHistory = async () => {
      const userId = firebase.auth().currentUser.uid;
      const snapshot = await firestore()
        .collection('predictionResults')
        .doc(userId)
        .collection('results')
        .orderBy('createdAt', 'desc')
        .get();

      const history = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
      setDetectionHistory(history);
    };

    fetchDetectionHistory();
  }, [detectionHistory]);

  const userName = firebase.auth().currentUser?.displayName || 'User';

  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const deleteHistoryItem = async () => {
    try {
      const userId = firebase.auth().currentUser.uid;
      await firestore()
        .collection('predictionResults')
        .doc(userId)
        .collection('results')
        .doc(selectedItemId)
        .delete();

      // Remove the deleted item from the detection history
      setDetectionHistory(prevHistory =>
        prevHistory.filter(item => item.id !== selectedItemId),
      );
    } catch (error) {
      console.error('Error deleting history item:', error);
    } finally {
      // Reset selectedItemId and close the confirmation modal
      setSelectedItemId(null);
      setIsConfirmationVisible(false);
    }
  };

  const openConfirmationModal = itemId => {
    setSelectedItemId(itemId);
    setIsConfirmationVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileHeader}>
        <Text style={styles.profileName}>Hello {userName}</Text>
      </View>
      <ConfirmationModal
        isVisible={isConfirmationVisible}
        onCancel={() => setIsConfirmationVisible(false)}
        onConfirm={deleteHistoryItem}
      />

      <View style={[styles.section, detectionHistory.length >= 4 && {flex: 1}]}>
        <Text style={styles.sectionTitle}>Disease Detection History</Text>
        {detectionHistory.length > 0 ? (
          <FlatList
            data={detectionHistory}
            renderItem={({item}) => (
              <View style={styles.itemContainer}>
                <Image source={{uri: item.imagePath}} style={styles.image} />
                <View style={styles.textContainer}>
                  <Text style={styles.label}>{item.label}</Text>
                  <Text style={styles.confidence}>
                    Confidence: {item.confidence}
                  </Text>
                </View>
                {/* Add delete icon */}
                <TouchableOpacity
                  onPress={() => openConfirmationModal(item.id)}>
                  <Icon name="trash" size={20} color="red" />
                </TouchableOpacity>
              </View>
            )}
            keyExtractor={item => item.id}
          />
        ) : (
          <Text style={{color: 'gray'}}>No history found</Text>
        )}
      </View>

      <View style={styles.buttonContainer}>
        {/* Add a button to open the feedback modal */}
        <TouchableOpacity onPress={toggleModal} style={styles.feedbackButton}>
          <Text style={{fontSize: 18}}>Give Feedback</Text>
        </TouchableOpacity>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={{fontSize: 18}}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Render the feedback modal */}
      <FeedbackModal visible={isModalVisible} onClose={toggleModal} />

      {/* Render the confirmation modal */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.bg,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    color: 'black',
  },
  section: {
    // flex: 1,
    marginBottom: 20,
    // backgroundColor: COLORS.primary,
    padding: 20,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 20,
    borderRadius: 10,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'black',
  },
  confidence: {
    fontSize: 16,
    color: 'black',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    marginBottom: 60,
    backgroundColor: '#eee',
    padding: 20,
    borderRadius: 5,
    borderColor: 'gray',
    borderWidth: 2,
  },
  feedbackButton: {
    backgroundColor: COLORS.primary,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  logoutButton: {
    backgroundColor: 'gray',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    flex: 1,
  },
});

export default Profile;
