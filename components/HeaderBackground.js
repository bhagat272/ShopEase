// HeaderBackground.js
import React from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';

const HeaderBackground = () => (
  <ImageBackground
    source={{ uri: 'https://png.pngtree.com/thumb_back/fh260/background/20230408/pngtree-rainbow-curves-abstract-colorful-background-image_2164067.jpg' }} // Replace with your image URL
    style={StyleSheet.absoluteFillObject}
  >
    <View style={StyleSheet.absoluteFillObject} />
  </ImageBackground>
);

export default HeaderBackground;
