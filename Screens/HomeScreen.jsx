import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Modal,
  useColorScheme,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconFa5 from 'react-native-vector-icons/FontAwesome5';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import LinearGradient from 'react-native-linear-gradient';
import Tips from './Main Screens/Tips/Tips';
import {COLORS} from '../constants/theme';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState(''); // State to hold username

  // const scheme = useColorScheme();

  const [isMenuVisible, setIsMenuVisible] = useState(false); // State to control menu visibility

  useEffect(() => {
    // Fetch username from Firebase or authentication provider
    const currentUser = auth().currentUser;
    currentUser && setUsername(`Hello ${currentUser.displayName}`); // Placeholder for demonstration
  }, [, username]);

  const navigateToProfile = () => {
    navigation.navigate('Profile');
  };

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  const navigateToScreen = screen => {
    // Navigate to the selected screen and close the menu
    navigation.navigate(screen);
    toggleMenu();
  };

  const navigateToDiseaseDetection = () => {
    // Navigate to Disease Detection screen
    navigation.navigate('Disease-Detection');
  };

  const navigateToCommunity = () => {
    // Navigate to Community screen
    navigation.navigate('Community');
  };

  const navigateToTips = () => {
    // Navigate to Tips screen
    navigation.navigate('Tips');
  };

  // Define gradient colors for light and dark modes
  const gradientColors = ['#9ACD32', '#32CD32'];

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.bg,
        paddingVertical: 20,
        paddingHorizontal: 20,
      }}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.username}>{username ? username : 'Hello'}</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={[styles.iconButton]}
            onPress={navigateToProfile}>
            <Icon name="user-circle" size={30} color="gray" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={toggleMenu}>
            <Icon name="bars" size={30} color="gray" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={{flex: 1, justifyContent: 'center', gap: 50}}>
        <View>
          <Text style={styles.heading}>Explore Apple Aid</Text>
        </View>
        <View>
          <TouchableOpacity
            style={[styles.block, styles.lowerBlock]}
            onPress={navigateToDiseaseDetection}>
            <LinearGradient
              colors={gradientColors}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={[StyleSheet.absoluteFill, styles.gradient]}
            />
            <IconFa5 name="shield-virus" size={50} color="#FFFFFF" />
            <Text style={styles.blockText}>Disease Detection</Text>
          </TouchableOpacity>
          <View style={styles.sideBySide}>
            <TouchableOpacity
              style={[styles.block, styles.halfBlock]}
              onPress={navigateToCommunity}>
              {/* <LinearGradient
                colors={gradientColors}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={[StyleSheet.absoluteFill, styles.gradient]}
              /> */}
              <Icon name="users" size={50} color={COLORS.primary} />
              <Text style={[styles.blockText, {color: COLORS.primary}]}>
                Community
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.block, styles.halfBlock]}
              onPress={navigateToTips}>
              {/* <LinearGradient
                colors={gradientColors}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={[StyleSheet.absoluteFill, styles.gradient]}
              /> */}
              <Icon name="lightbulb-o" size={50} color={COLORS.primary} />
              <Text style={[styles.blockText, {color: COLORS.primary}]}>
                Tips
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <Modal
        visible={isMenuVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={toggleMenu}>
        <View style={styles.menuContainer}>
          <TouchableOpacity
            onPress={toggleMenu}
            style={{position: 'absolute', top: 20, right: 20}}>
            <Icon name="window-close" size={30} color="gray" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigateToScreen('Home')}>
            <Text style={styles.menuText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigateToScreen('Disease-Detection')}>
            <Text style={styles.menuText}>Disease Detection</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigateToScreen('Community')}>
            <Text style={styles.menuText}>Community</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigateToScreen('Tips')}>
            <Text style={styles.menuText}>Tips</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigateToScreen('Profile')}>
            <Text style={styles.menuText}>Profile</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#444',
  },
  headerRight: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 20,
  },
  heading: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#164a04',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'poppins',
  },
  block: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 20,
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 3,
    // },
    // shadowOpacity: 0.27,
    // shadowRadius: 4.65,
    // elevation: 6,
  },
  lowerBlock: {
    height: 150,
  },
  halfBlock: {
    flex: 1,
    aspectRatio: 1, // Square shape
    borderWidth: 4,
    borderColor: COLORS.primary,
  },
  blockText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 10,
  },
  sideBySide: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  menuContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
    backgroundColor: 'black',
    padding: 16,
  },
  menuItem: {
    paddingVertical: 20,
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    margin: 8,
  },
  menuText: {
    fontSize: 20,
    color: 'green',
    fontWeight: '600',
  },
  gradient: {
    borderRadius: 10,
  },
});

export default HomeScreen;
