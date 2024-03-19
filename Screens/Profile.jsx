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
} from 'react-native';
import Feedback from './Main Screens/Feedback';
import FeedbackModal from './Main Screens/FeedbackModal';
import {COLORS} from '../constants/theme';
import firestore from '@react-native-firebase/firestore';

const Profile = () => {
  const handleLogout = async () => {
    try {
      await firebase.auth().signOut(); // Sign out the current user
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const [detectionHistory, setDetectionHistory] = useState([]);

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
  }, []);

  const userName = firebase.auth().currentUser?.displayName || 'User';

  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <Text style={styles.profileName}>{userName}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Disease Detection History</Text>
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
            </View>
          )}
          keyExtractor={item => item.id}
        />
      </View>

      <View>
        {/* Add a button to open the feedback modal */}
        <TouchableOpacity
          onPress={toggleModal}
          style={{
            backgroundColor: COLORS.primary,
            padding: 15,
            borderRadius: 5,
            alignItems: 'center',
            marginTop: 15,
          }}>
          <Text>Give Feedback</Text>
        </TouchableOpacity>

        {/* Render the feedback modal */}
        <FeedbackModal visible={isModalVisible} onClose={toggleModal} />
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  editButton: {
    marginTop: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  logoutButton: {
    backgroundColor: 'gray',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 15,
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
  },
  confidence: {
    fontSize: 16,
  },
});

export default Profile;
