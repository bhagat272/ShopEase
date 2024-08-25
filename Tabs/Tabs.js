import { StyleSheet, Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import HomeScreen from '../components/HomeScreen';
import ComponentScreen from '../components/ComponentScreen';
import SettingsScreen from '../components/SettingsScreen';
import LoginScreen from '../components/LoginScreen';
import HeaderBackground from '../components/HeaderBackground';

// Import custom icons
import homeIcon from '../assets/icons/home.png'; // Example path
import cartIcon from '../assets/icons/cart.png'; // Example path
import settingsIcon from '../assets/icons/settings.png'; // Example path
import loginIcon from '../assets/icons/login.png'; // Example path
import PostScreenIcon from '../assets/icons/post.png'; // Example path
import PostScreen from '../components/PostScreen';

const Tabs = () => {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconSource;

          if (route.name === 'Home') {
            iconSource = homeIcon;
          } else if (route.name === 'Cart') {
            iconSource = cartIcon;
          } else if (route.name === 'Settings') {
            iconSource = settingsIcon;
          } else if (route.name === 'Login') {
            iconSource = loginIcon;
          }
          else if (route.name === 'Post') {
            iconSource = PostScreenIcon;
          }

          return (
            <Image
              source={iconSource}
              style={{
                width: size,
                height: size,
                tintColor: color, // This will tint the icon with the color passed
              }}
            />
          );
        },
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'black',
        headerBackground: () => <HeaderBackground />,
        tabBarBackground: () => <HeaderBackground />,
        headerStatusBarHeight: 9,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Cart" component={ComponentScreen} />
      <Tab.Screen name="Post" component={PostScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
      <Tab.Screen name="Login" component={LoginScreen} />
    </Tab.Navigator>
  );
};

export default Tabs;

const styles = StyleSheet.create({});