

import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  PermissionsAndroid,
  Platform,
  StatusBar,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {COLORS, SIZES} from '../../constants/theme';
import Config from 'react-native-config';
import axios from 'axios';
import PermissionsService, {isIOS} from '../../Permissions';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import DiseaseInfo from './DiseaseInfo';
import ScanningAnimation from '../../UI/ScanningAnimation';

axios.interceptors.request.use(
  async config => {
    let request = config;
    request.headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    request.url = configureUrl(config.url);
    return request;
  },
  error => error,
);

export const configureUrl = url => {
  let authUrl = url;
  if (url && url[url.length - 1] === '/') {
    authUrl = url.substring(0, url.length - 1);
  }
  return authUrl;
};

const ImageUploadScreen = () => {
  const [result, setResult] = useState('');
  const [label, setLabel] = useState('');
  const [image, setImage] = useState('');

  const [disease, setDisease] = useState('');
  const [showAnimation, setShowAnimation] = useState(false);

  const getPrediction = async (uri, fileName) => {
    const serverUrl =
      'https://us-central1-linear-pursuit-408818.cloudfunctions.net/predictv2';

    // const serverUrl =
    //   'http://localhost:8000/predict';

    console.log('Preparing to send request to:', serverUrl);
    console.log('Image URI:', uri);

    try {
      const formData = new FormData();
      formData.append('file', {
        uri: uri,
        name: fileName,
        type: 'image/jpeg', // Adjust based on actual image type
      });

      const response = await fetch(serverUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const result = await response.json();
      console.log('Full Response:', result);

      if (!response.ok) {
        console.error(
          'Error predicting:',
          response.status,
          response.statusText,
          result,
        );
        throw new Error('Network request failed');
      }

      if (
        !result ||
        typeof result.class === 'undefined' ||
        typeof result.confidence === 'undefined'
      ) {
        console.error('Missing class or confidence in response:', result);
        throw new Error('Invalid response format');
      }

      console.log('Prediction result:', result);
      return result;
    } catch (error) {
      console.error('Error in getPrediction:', error);
      throw error;
    }
  };

  // Inside your component or function
  const getCurrentUserId = () => {
    const currentUser = auth().currentUser;
    if (currentUser) {
      return currentUser.uid;
    } else {
      return console.log('user id not found');
    }
  };

  const getResult = async (path, response) => {
    console.log('Getting prediction...');
    setLabel('Predicting...');
    setResult('');
    setImage(path);

    const fileName = response.assets[0].fileName;

    // Get current user ID
    const userId = getCurrentUserId();

    // Introduce a short delay to allow UI update
    setTimeout(async () => {
      try {
        console.log('Calling getPrediction...');
        const predictionResult = await getPrediction(path, fileName);
        console.log('Prediction result:', predictionResult);
        setLabel(predictionResult.class);
        setResult(predictionResult.confidence);
        setDisease(predictionResult.class);

        setShowAnimation(false);

        // Save prediction result to Firestore
        await savePredictionResult(userId, path, predictionResult);
      } catch (error) {
        console.error('Error predicting:', error);
        setLabel('Failed to predict');
      }
    }, 100); // delay in milliseconds
  };

  const savePredictionResult = async (userId, imagePath, predictionResult) => {
    try {
      // Upload image to Firebase Storage
      const imageRef = storage().ref(
        `predictionImages/${userId}/${Date.now()}.jpg`,
      );
      await imageRef.putFile(imagePath);

      // Get download URL of the uploaded image
      const imageUrl = await imageRef.getDownloadURL();

      // Store prediction details in Firestore
      await firestore()
        .collection('predictionResults')
        .doc(userId)
        .collection('results')
        .add({
          imagePath: imageUrl, // Store image URL instead of local path
          label: predictionResult.class,
          confidence: predictionResult.confidence,
          createdAt: firestore.FieldValue.serverTimestamp(),
        });

      console.log('Prediction result saved successfully!');
    } catch (error) {
      console.error('Error saving prediction result:', error);
    }
  };

  const options = {
    mediaType: 'photo',
    quality: 1,
    width: 224,
    height: 224,
    includeBase64: false,
  };

  const clearOutput = () => {
    setLabel('');
    setResult('');
    setImage('');
  };

  const handleTakePicture = async () => {
    launchCamera(options, async response => {
      console.log('Camera response:', response); // Log the response object
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        clearOutput();
        const uri = response?.assets[0]?.uri;
        console.log('Image URI:', uri); // Log the image URI
        const path = Platform.OS !== 'ios' ? uri : 'file://' + uri;
        getResult(path, response);
        setShowAnimation(true);
      }
    });
  };

  const OpenGallery = async () => {
    launchImageLibrary(options, async response => {
      console.log('Gallery response:', response); // Log the response object
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        clearOutput();
        const uri = response?.assets[0]?.uri;
        console.log('Image URI:', uri); // Log the image URI
        const path = Platform.OS !== 'ios' ? uri : 'file://' + uri;
        getResult(path, response);
        const outputData = await model.run(path);
        console.log(outputData);
        setShowAnimation(true);
      }
    });
  };

  return (
    
    <ScrollView contentContainerStyle={styles.container}>
      {/* Icons */}
      <View style={styles.iconsContainer}>
        <TouchableOpacity style={styles.icon}>
          <Icon name="leaf" size={50} color="#2E7D32" />
          <Text style={styles.iconLabel}>Upload Picture</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.icon}>
          <Icon name="disease" size={50} color="#FF5252" />
          <Text style={styles.iconLabel}>See Diagnosis</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.icon}>
          <Icon name="hand-holding-medical" size={50} color="#FF8F00" />
          <Text style={styles.iconLabel}>Explore Treatment</Text>
        </TouchableOpacity>
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          width: '100%',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          style={styles.takePictureButton}
          onPress={handleTakePicture}>
          <Text style={styles.buttonText}>Take a Picture</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.takePictureButton}
          onPress={OpenGallery}>
          <Text style={styles.buttonText}>Open Gallery</Text>
        </TouchableOpacity>
      </View>

      {image && (
        <Image
          style={{
            width: 300,
            height: 300,
            marginHorizontal: 20,
            marginTop: 30,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
          }}
          source={{uri: image}}
        />
      )}
      {/* {label && <Text style={styles.labelText}>Disease: {label}</Text>} */}

      {label === 'Predicting...' ? (
        <View
          style={{
            backgroundColor: 'white',
            width: 300,
            padding: 12,
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
            alignItems: 'center', // Center the text
          }}>
          <Text style={styles.ptext}>{label}</Text>
        </View>
      ) : (
        label &&
        result && (
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
              <Text style={styles.ptext}>{label}</Text>
            </View>
            <View style={styles.pwrapper}>
              <Text style={styles.ptext}>Confidence: </Text>
              <Text style={styles.ptext}>
                {parseFloat(result).toFixed(2) + '%'}
              </Text>
            </View>
          </View>
        )
      )}
      {/* <ScanningAnimation visible={showAnimation} /> */}
      {disease && <DiseaseInfo disease={disease} />}
    </ScrollView>

  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    paddingBottom: 50,
    backgroundColor: '#E7FFD2',
    justifyContent: 'flex-start',
    alignItems: 'center',
    // backgroundColor: 'blue',
  },
  iconsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 10,
    // backgroundColor: 'red',
  },
  icon: {
    flex: 1,
    alignItems: 'center',
    flexWrap: 'wrap',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 10,
  },
  iconLabel: {
    marginTop: 5,
    color: 'black',
    fontSize: 14,
    textAlign: 'center',
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

  pwrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },

  ptext: {
    color: 'black',
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 30,
  },
});

export default ImageUploadScreen;



// // ImageUploadScreen.js
// import React, {useState} from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Image,
//   Platform,
//   ScrollView,
//   Alert,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/FontAwesome5';
// import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
// import {COLORS} from '../../constants/theme';
// // import Config from 'react-native-config';
// import axios from 'axios';
// // import PermissionsService, {isIOS} from '../../Permissions';
// import firestore from '@react-native-firebase/firestore';
// import auth from '@react-native-firebase/auth';
// import storage from '@react-native-firebase/storage';
// import DiseaseInfo from './DiseaseInfo';
// // import ScanningAnimation from '../../UI/ScanningAnimation';
// // import {set} from 'date-fns';

// // import {decode, Tensor} from 'tfjs-react-native';
// import {decode, Tensor} from '@tensorflow/tfjs';
// import * as jpeg from 'jpeg-js';

// axios.interceptors.request.use(
//   async config => {
//     let request = config;
//     request.headers = {
//       'Content-Type': 'application/json',
//       Accept: 'application/json',
//     };
//     request.url = configureUrl(config.url);
//     return request;
//   },
//   error => error,
// );

// export const configureUrl = url => {
//   let authUrl = url;
//   if (url && url[url.length - 1] === '/') {
//     authUrl = url.substring(0, url.length - 1);
//   }
//   return authUrl;
// };

// const ImageUploadScreen = async () => {
//   const [result, setResult] = useState('');
//   const [label, setLabel] = useState('');
//   const [image, setImage] = useState('');

//   const [disease, setDisease] = useState('');
//   // const [showAnimation, setShowAnimation] = useState(false);

//   const model = await loadTensorflowModel(require('../../assets/model.tflite'));
//   const [imageUri, setImageUri] = useState(null);
//   const [preprocessedImage, setPreprocessedImage] = useState(null);

//   const getPrediction = async (uri, fileName) => {
//     const serverUrl =
//       'https://us-central1-linear-pursuit-408818.cloudfunctions.net/predictv2';

//     // const serverUrl =
//     //   'http://localhost:8000/predict';

//     console.log('Preparing to send request to:', serverUrl);
//     console.log('Image URI:', uri);

//     try {
//       const formData = new FormData();
//       formData.append('file', {
//         uri: uri,
//         name: fileName,
//         type: 'image/jpeg', // Adjust based on actual image type
//       });

//       const response = await fetch(serverUrl, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//         body: formData,
//       });

//       const result = await response.json();
//       console.log('Full Response:', result);

//       if (!response.ok) {
//         console.error(
//           'Error predicting:',
//           response.status,
//           response.statusText,
//           result,
//         );
//         throw new Error('Network request failed');
//       }

//       if (
//         !result ||
//         typeof result.class === 'undefined' ||
//         typeof result.confidence === 'undefined'
//       ) {
//         console.error('Missing class or confidence in response:', result);
//         throw new Error('Invalid response format');
//       }

//       console.log('Prediction result:', result);
//       return result;
//     } catch (error) {
//       console.error('Error in getPrediction:', error);
//       throw error;
//     }
//   };

//   // Inside your component or function
//   const getCurrentUserId = () => {
//     const currentUser = auth().currentUser;
//     if (currentUser) {
//       return currentUser.uid;
//     } else {
//       return console.log('user id not found');
//     }
//   };

//   const getResult = async (path, response) => {
//     console.log('Getting prediction...');
//     setLabel('Predicting...');
//     setResult('');
//     setImage(path);

//     const fileName = response.assets[0].fileName;

//     // Get current user ID
//     // const userId = getCurrentUserId();

//     // Introduce a short delay to allow UI update
//     setTimeout(async () => {
//       try {
//         console.log('Calling getPrediction...');
//         const predictionResult = await getPrediction(path, fileName);
//         console.log('Prediction result:', predictionResult);
//         setLabel(predictionResult.class);
//         setResult(predictionResult.confidence);
//         setDisease(predictionResult.class);

//         setShowAnimation(false);

//         // Save prediction result to Firestore
//         await savePredictionResult(userId, path, predictionResult);
//       } catch (error) {
//         console.error('Error predicting:', error);
//         setLabel('Failed to predict');
//       }
//     }, 100); // delay in milliseconds
//   };

//   const savePredictionResult = async (userId, imagePath, predictionResult) => {
//     try {
//       // Upload image to Firebase Storage
//       const imageRef = storage().ref(
//         `predictionImages/${userId}/${Date.now()}.jpg`,
//       );
//       await imageRef.putFile(imagePath);

//       // Get download URL of the uploaded image
//       const imageUrl = await imageRef.getDownloadURL();

//       // Store prediction details in Firestore
//       await firestore()
//         .collection('predictionResults')
//         .doc(userId)
//         .collection('results')
//         .add({
//           imagePath: imageUrl, // Store image URL instead of local path
//           label: predictionResult.class,
//           confidence: predictionResult.confidence,
//           createdAt: firestore.FieldValue.serverTimestamp(),
//         });

//       console.log('Prediction result saved successfully!');
//     } catch (error) {
//       console.error('Error saving prediction result:', error);
//     }
//   };

//   const options = {
//     mediaType: 'photo',
//     quality: 1,
//     width: 224,
//     height: 224,
//     includeBase64: false,
//   };

//   const clearOutput = () => {
//     setLabel('');
//     setResult('');
//     setImage('');
//   };

//   const handleTakePicture = async () => {
//     setDisease('');
//     launchCamera(options, async response => {
//       console.log('Camera response:', response); // Log the response object
//       if (response.didCancel) {
//         console.log('User cancelled image picker');
//       } else if (response.error) {
//         console.log('ImagePicker Error: ', response.error);
//       } else if (response.customButton) {
//         console.log('User tapped custom button: ', response.customButton);
//       } else {
//         clearOutput();
//         const uri = response?.assets[0]?.uri;
//         console.log('Image URI:', uri); // Log the image URI
//         const path = Platform.OS !== 'ios' ? uri : 'file://' + uri;
//         getResult(path, response);
//         setShowAnimation(true);
//       }
//     });
//   };

//   const OpenGallery = async () => {
//     setDisease('');
//     launchImageLibrary(options, async response => {
//       console.log('Gallery response:', response); // Log the response object
//       if (response.didCancel) {
//         console.log('User cancelled image picker');
//       } else if (response.error) {
//         console.log('ImagePicker Error: ', response.error);
//       } else if (response.customButton) {
//         console.log('User tapped custom button: ', response.customButton);
//       } else {
//         clearOutput();
//         const uri = response?.assets[0]?.uri;
//         console.log('Image URI:', uri); // Log the image URI

//         setImageUri(uri);
//         await preprocessImage(imageUri).then(async preprocessedImage => {
//           // Use preprocessedImage for inference with your TensorFlow Lite model
//           const outputData = await model.run(preprocessImage);
//           console.log('Perform inference with preprocessed image:', outputData);
//         });

//         const path = Platform.OS !== 'ios' ? uri : 'file://' + uri;
//         getResult(path, response);
//         const outputData = await model.run(path);
//         console.log(outputData);
//         setShowAnimation(true);
//       }
//     });
//   };

//   const preprocessImage = async () => {
//     if (imageUri) {
//       const imgData = await fetch(imageUri);
//       const imgBlob = await imgData.blob();

//       const imgReader = new FileReader();
//       imgReader.readAsArrayBuffer(imgBlob);

//       imgReader.onloadend = async () => {
//         const imageBuffer = imgReader.result;
//         const rawImageData = jpeg.decode(imageBuffer, true);

//         const resizedImage = tf.image.resizeBilinear(
//           tf.tensor3d(rawImageData.data, 'float32', [
//             rawImageData.height,
//             rawImageData.width,
//             3,
//           ]),
//           [224, 224],
//         );

//         setPreprocessedImage(resizedImage);
//       };
//     } else {
//       Alert.alert('Please upload an image first.');
//     }
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       {/* Icons */}
//       <View style={styles.iconsContainer}>
//         <TouchableOpacity style={styles.icon}>
//           <Icon name="leaf" size={50} color="#2E7D32" />
//           <Text style={styles.iconLabel}>Upload Picture</Text>
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.icon}>
//           <Icon name="disease" size={50} color="#FF5252" />
//           <Text style={styles.iconLabel}>See Diagnosis</Text>
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.icon}>
//           <Icon name="hand-holding-medical" size={50} color="#FF8F00" />
//           <Text style={styles.iconLabel}>Explore Treatment</Text>
//         </TouchableOpacity>
//       </View>

//       <View
//         style={{
//           flexDirection: 'row',
//           justifyContent: 'space-around',
//           width: '100%',
//           alignItems: 'center',
//         }}>
//         <TouchableOpacity
//           style={styles.takePictureButton}
//           onPress={handleTakePicture}>
//           <Text style={styles.buttonText}>Take a Picture</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.takePictureButton}
//           onPress={OpenGallery}>
//           <Text style={styles.buttonText}>Open Gallery</Text>
//         </TouchableOpacity>
//       </View>

//       {image && (
//         <Image
//           style={{
//             width: 300,
//             height: 300,
//             marginHorizontal: 20,
//             marginTop: 30,
//             borderTopLeftRadius: 10,
//             borderTopRightRadius: 10,
//           }}
//           source={{uri: image}}
//         />
//       )}
//       {/* {label && <Text style={styles.labelText}>Disease: {label}</Text>} */}

//       {label === 'Predicting...' ? (
//         <View
//           style={{
//             backgroundColor: 'white',
//             width: 300,
//             padding: 12,
//             borderBottomLeftRadius: 10,
//             borderBottomRightRadius: 10,
//             alignItems: 'center', // Center the text
//           }}>
//           <Text style={styles.ptext}>{label}</Text>
//         </View>
//       ) : (
//         label &&
//         result && (
//           <View
//             style={{
//               backgroundColor: 'white',
//               width: 300,
//               padding: 12,
//               borderBottomLeftRadius: 10,
//               borderBottomRightRadius: 10,
//             }}>
//             <View style={styles.pwrapper}>
//               <Text style={styles.ptext}>Label: </Text>
//               <Text style={styles.ptext}>{label}</Text>
//             </View>
//             <View style={styles.pwrapper}>
//               <Text style={styles.ptext}>Confidence: </Text>
//               <Text style={styles.ptext}>
//                 {parseFloat(result).toFixed(2) + '%'}
//               </Text>
//             </View>
//           </View>
//         )
//       )}
//       {/* <ScanningAnimation visible={showAnimation} /> */}
//       {disease && <DiseaseInfo disease={disease} />}
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     // flex:
//     // height: SIZES.height,
//     paddingVertical: 60,
//     backgroundColor: COLORS.bg,
//     justifyContent: 'flex-start',
//     alignItems: 'center',
//     // backgroundColor: 'blue',
//   },
//   iconsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     width: '100%',
//     marginBottom: 20,
//     paddingHorizontal: 10,
//     // backgroundColor: 'red',
//   },
//   icon: {
//     flex: 1,
//     alignItems: 'center',
//     flexWrap: 'wrap',
//     flexDirection: 'column',
//     justifyContent: 'center',
//     padding: 10,
//   },
//   iconLabel: {
//     marginTop: 5,
//     color: 'black',
//     fontSize: 14,
//     textAlign: 'center',
//   },
//   takePictureButton: {
//     backgroundColor: '#2E7D32',
//     paddingVertical: 15,
//     paddingHorizontal: 20,
//     borderRadius: 10,
//     marginTop: 20,
//   },
//   buttonText: {
//     color: 'white',
//     fontSize: 18,
//   },

//   pwrapper: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingHorizontal: 16,
//   },

//   ptext: {
//     color: 'black',
//     fontSize: 18,
//     fontWeight: '500',
//     lineHeight: 30,
//   },
// });

// export default ImageUploadScreen;



// ImageUploadScreen.js