import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Provider as PaperProvider, Avatar, List, Card, Divider, Text, IconButton } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'; // Import for navigation

const SettingsScreen = () => {
  const [image, setImage] = useState(null);
  const navigation = useNavigation(); // Initialize navigation

  // Load the image URI from AsyncStorage on component mount
  useEffect(() => {
    const loadImage = async () => {
      try {
        const savedImage = await AsyncStorage.getItem('profileImage');
        if (savedImage) {
          setImage(savedImage);
        }
      } catch (error) {
        console.error('Failed to load image from storage', error);
      }
    };

    loadImage();
  }, []);

  const openCamera = async () => {
    try {
      // Request camera permissions
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Camera permission is required!');
        return;
      }

      // Launch camera
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      console.log('ImagePicker Result:', result);

      if (result.cancelled) {
        Alert.alert('No photo selected.');
      } else if (result.uri) {
        // Save the image URI to AsyncStorage
        await AsyncStorage.setItem('profileImage', result.uri);
        setImage(result.uri);
      } else {
        Alert.alert('Failed to get image URI.');
      }
    } catch (error) {
      console.error('Failed to save image to storage', error);
      Alert.alert('Failed to save image. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      // Clear AsyncStorage
      await AsyncStorage.clear();

      // Optionally, navigate to a login screen
      navigation.navigate('Login'); // Replace 'LoginScreen' with your actual login screen name

      // Optionally, alert the user
      Alert.alert('Logged out', 'You have been logged out successfully.');
    } catch (error) {
      console.error('Failed to log out', error);
      Alert.alert('Logout failed', 'Failed to log out. Please try again.');
    }
  };

  return (
    <PaperProvider>
      <View style={{ flex: 1 }}>
        <View style={styles.container}>
          <View style={styles.profileSection}>
            <Avatar.Image
              size={100}
              source={image ? { uri: image } : require('../assets/shop.png')}
              style={styles.avatar}
            />
            <Text style={styles.profileName}>User Name</Text>
            <Text style={styles.profileEmail}>user@example.com</Text>
            <IconButton
              icon="pencil"
              size={24}
              onPress={openCamera}
              style={styles.editProfileButton}
            />
          </View>
          <Card style={styles.card}>
            <List.Section>
              <List.Item
                title="Profile Update"
                left={(props) => <List.Icon {...props} icon="account" />}
                onPress={() => console.log('Profile Update')}
                style={styles.listItem}
              />
              <Divider />
              <List.Item
                title="About"
                left={(props) => <List.Icon {...props} icon="information" />}
                onPress={() => console.log('About')}
                style={styles.listItem}
              />
              <Divider />
              <List.Item
                title="Help"
                left={(props) => <List.Icon {...props} icon="help" />}
                onPress={() => console.log('Help')}
                style={styles.listItem}
              />
              <Divider />
              <List.Item
                title="Log Out"
                left={(props) => <List.Icon {...props} icon="logout" />}
                onPress={handleLogout} // Updated to call handleLogout
                style={styles.listItem}
              />
            </List.Section>
          </Card>
        </View>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#eaeaea',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    elevation: 2,
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 8,
    color: '#333333',
  },
  profileEmail: {
    fontSize: 16,
    color: '#888888',
    marginBottom: 12,
  },
  avatar: {
    marginBottom: 12,
  },
  editProfileButton: {
    position: 'absolute',
    bottom: -10,
    right: 10,
  },
  card: {
    padding: 16,
    borderRadius: 8,
    elevation: 2,
  },
  listItem: {
    paddingVertical: 8,
  },
});

export default SettingsScreen;
