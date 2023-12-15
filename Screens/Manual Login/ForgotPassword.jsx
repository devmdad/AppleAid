// ForgotPassword.js
import React, {useState, useEffect} from 'react';
import {View, Text, TextInput, Button, StyleSheet, TouchableOpacity} from 'react-native';
import auth from '@react-native-firebase/auth';
import { COLORS } from '../../constants/theme';

const ForgotPassword = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [isResetSent, setIsResetSent] = useState(false);
  const [error, setError] = useState(null);

  const handleForgotPassword = async () => {
    try {
      await auth().sendPasswordResetEmail(email);
      setIsResetSent(true);
      console.log('Password reset email sent successfully.');
    } catch (error) {
      console.error('Forgot password failed:', error.message);
      setError(
        'Failed to send password reset email. Please check your email and try again.',
      );
    }
  };

  useEffect(() => {
    // Cleanup when component is unmounted
    return () => {
      setIsResetSent(false); // Clear/reset state when navigating away
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>
      {error && <Text style={styles.error}>{error}</Text>}
      {isResetSent ? (
        <Text style={styles.successMessage}>
          Password reset email sent successfully.
        </Text>
      ) : (
        <>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={text => setEmail(text)}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor='grey'
          />

          <TouchableOpacity
        onPress={handleForgotPassword}
        style={{
          backgroundColor: COLORS.primary,
          borderRadius: 4,
        }}>
        <Text
          style={{
            paddingHorizontal: 30,
            paddingVertical: 12,
            color: 'white',
            fontWeight: '500',
            fontSize: 16,
          }}>
          Reset Password
        </Text>
      </TouchableOpacity>
      
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: 'black',
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingLeft: 10,
  },
  successMessage: {
    color: 'green',
    marginBottom: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 10,
  },
});

export default ForgotPassword;
