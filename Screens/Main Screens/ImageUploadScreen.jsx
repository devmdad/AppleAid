// ImageUploadScreen.js
import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  PermissionsAndroid,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
// import ImagePicker from 'react-native-image-picker';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

const ImageUploadScreen = () => {
  const [cameraPhoto, setCameraPhoto] = useState();
  const [galleryPhoto, setGalleryPhoto] = useState();

  const options = {
    mediaType: 'photo',
    quality: 1,
  };

  const handleTakePicture = async () => {

    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      const result = await launchCamera(options);
      setCameraPhoto(result.assets[0].uri);
    }

    // const OpenCamera = async () => {
    //     const result = launchCamera(options);
    // }

    // launchCamera(options, (response) => {
    //     if (response.uri) {
    //             setImageUri(response.uri);
    //             // You can now use the 'response' object for further processing
    //             console.log('Image URI:', response.uri);
    //           }
    // });

    // You can also use as a promise without 'callback':
    // const result = launchImageLibrary(options);

    // launchImageLibrary(options, (response) => {
    //   if (response.uri) {
    //     setImageUri(response.uri);
    //     // You can now use the 'response' object for further processing
    //     console.log('Image URI:', response.uri);
    //   }
    // });
  };

  const OpenGallery = async () => {
    const result = await launchImageLibrary(options);
    setGalleryPhoto(result.assets[0].uri);
  };

  return (
    <View style={styles.container}>
      {/* Icons */}
      <View style={styles.iconsContainer}>
        <TouchableOpacity style={styles.icon}>
          <Icon name="leaf" size={30} color="#2E7D32" />
          <Text style={styles.iconLabel}>Leaf</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.icon}>
          <Icon name="bug" size={30} color="#FF8F00" />
          <Text style={styles.iconLabel}>Bug</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.icon}>
          <Icon name="disease" size={30} color="#FF5252" />
          <Text style={styles.iconLabel}>Disease</Text>
        </TouchableOpacity>
      </View>

      {/* Take a Picture Button */}
      <Image style={{width: 200, height: 200, margin: 20}} source={{uri: cameraPhoto}} />

      <TouchableOpacity
        style={styles.takePictureButton}
        onPress={handleTakePicture}
        // disabled={imageUri !== null}
      >
        <Text style={styles.buttonText}>Take a Picture</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.takePictureButton}
        onPress={OpenGallery}
        // disabled={imageUri !== null}
      >
        <Text style={styles.buttonText}>Open Gallery</Text>
      </TouchableOpacity>

      <Image style={{width: 200, height: 200, margin: 20}} source={{uri: galleryPhoto}} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E7FFD2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  icon: {
    alignItems: 'center',
  },
  iconLabel: {
    marginTop: 5,
  },
  takePictureButton: {
    backgroundColor: '#2E7D32',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default ImageUploadScreen;
