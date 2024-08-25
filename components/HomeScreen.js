import React, { useEffect, useRef, useState } from 'react';
import { View, FlatList, TouchableOpacity, ImageBackground, StyleSheet, Animated, Text, Modal, Image } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../redux/slices/productsSlice';
import { fetchUsers } from '../redux/slices/userSlice';
import { addToCart } from '../redux/slices/cartSlice';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons, AntDesign, FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';

const stories = [
  { id: '1', image: 'https://pixabay.com/vectors/broken-link-404-link-rot-2367103/' },
  { id: '2', image: 'https://cdn.pixabay.com/photo/2016/10/10/14/46/icon-1728548_640.jpg' },
  { id: '3', image: 'https://cdn.pixabay.com/photo/2013/07/12/15/53/globe-150498_640.png' },
  { id: '4', image: 'https://cdn.pixabay.com/photo/2014/04/02/14/08/mouse-306274_640.png' },
  { id: '5', image: 'https://cdn.pixabay.com/photo/2017/03/08/14/20/flat-2126879_640.png' },
  { id: '6', image: 'https://cdn.pixabay.com/photo/2020/09/07/16/31/chain-5552305_640.jpg' },
  { id: '7', image: 'https://pixabay.com/illustrations/diversity-team-puzzle-gender-share-7921759/' },
  { id: '8', image: 'https://images.freeimages.com/images/large-previews/d45/sydney-harbour-bridge-1-1213044.jpg?fmt=webp&w=500' },
  { id: '9', image: 'https://images.freeimages.com/images/large-previews/757/windows-1213732.jpg?fmt=webp&w=500' },
  { id: '10', image: 'https://media.istockphoto.com/id/2156676914/photo/man-with-happy-expression-driving-a-car.webp?b=1&s=612x612&w=0&k=20&c=olUUmUOXgBdOe9gl1heNQrc0z2_T3SOIA8bCd-8WYI8=' },
  { id: '11', image: 'https://images.freeimages.com/images/large-previews/8f9/caution-tape-1228201.jpg?fmt=webp&w=500' },
  { id: '12', image: 'https://media.istockphoto.com/id/802301588/photo/male-it-engineer-works-on-a-laptop-in-a-big-data-center-rows-of-rack-servers-are-seen.webp?b=1&s=612x612&w=0&k=20&c=OhH2MeB65m60kc-NtiHnCWx6Fbk0-kj2NyX2iifvO-8=' },
];

const HomeScreen = () => {
  const products = useSelector((state) => state.products?.items || []);
  const users = useSelector((state) => state.users?.items || []);
  const productStatus = useSelector((state) => state.products?.status || 'idle');
  const userStatus = useSelector((state) => state.users?.status || 'idle');
  const dispatch = useDispatch();
  const animations = useRef([]);
  const flatListRef = useRef();
  const navigation = useNavigation();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);
  const [likedProducts, setLikedProducts] = useState(new Set());

  useEffect(() => {
    if (productStatus === 'idle') {
      dispatch(fetchProducts());
    }
    if (userStatus === 'idle') {
      dispatch(fetchUsers());
    }
  }, [productStatus, userStatus, dispatch]);

  useEffect(() => {
    animations.current = products.map(() => new Animated.Value(-500));
    products.forEach((_, index) => {
      Animated.timing(animations.current[index], {
        toValue: 0,
        duration: 500,
        delay: index * 100,
        useNativeDriver: false,
      }).start();
    });
  }, [products]);

  const toggleLike = (productId) => {
    setLikedProducts((prevLikedProducts) => {
      const newLikedProducts = new Set(prevLikedProducts);
      if (newLikedProducts.has(productId)) {
        newLikedProducts.delete(productId);
      } else {
        newLikedProducts.add(productId);
      }
      return newLikedProducts;
    });
  };

  const getUserForProduct = (productId) => {
    const user = users.find(user => user.id === productId);
    return user || { username: 'Unknown', avatar: 'https://via.placeholder.com/40' };
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      // Handle the picked image
      console.log(result.uri);
    }
  };

  const renderStoryItem = ({ item, index }) => (
    <TouchableOpacity
      style={styles.storyContainer}
      onPress={() => {
        if (index === 0) {
          pickImage(); // Open image picker if it's the first story
        } else {
          setSelectedStory(item);
          setIsModalVisible(true);
        }
      }}
    >
      <LinearGradient
        colors={['red', 'green','yellow']} // Gradient from Red to Green
        style={styles.gradientBorder}
      >
        <Image source={{ uri: item.image }} style={styles.storyImage} />
      </LinearGradient>
      {index === 0 && (
        <View style={styles.addIconContainer}>
          <MaterialIcons name="add" size={30} color="white" />
        </View>
      )}
    </TouchableOpacity>
  );

  const renderItem = ({ item, index }) => {
    const animatedStyle = {
      transform: [{ translateX: animations.current[index] || new Animated.Value(0) }],
    };
    const isLiked = likedProducts.has(item.id);
    const { username, avatar } = getUserForProduct(item.id);

    return (
      <Animated.View style={[styles.productContainer, animatedStyle]} key={item.id}>
        <View style={styles.userInfoContainer}>
          <Image
            source={{ uri: avatar }}
            style={styles.userAvatar}
          />
          <Text style={styles.username}>@{username}</Text>
        </View>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => navigation.navigate('ProductDetails', { product: item })}
        >
          <ImageBackground
            source={{ uri: item.thumbnail }}
            style={styles.backgroundImage}
            imageStyle={{ borderRadius: 8 }}
          >
            <View style={styles.textContainer}>
              <Text style={styles.productTitle}>{item.title}</Text>
              <Text style={styles.productPrice}>${item.price}</Text>
            </View>
          </ImageBackground>
        </TouchableOpacity>
        
        <View style={styles.actionsContainer}>
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => toggleLike(item.id)}
            >
              <AntDesign name={isLiked ? "heart" : "hearto"} size={24} color={isLiked ? "red" : "black"} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <FontAwesome name="comment-o" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <MaterialIcons name="share" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <MaterialIcons name="more-vert" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.addToCartButton}
            onPress={() => dispatch(addToCart(item))}
          >
            <Text style={styles.addToCartText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList showsHorizontalScrollIndicator={false}
        horizontal
        data={stories}
        renderItem={renderStoryItem}
        keyExtractor={(item) => item.id}
        style={styles.storiesList}
      />
      <FlatList showsVerticalScrollIndicator={false}
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.flatListContent}
        ref={flatListRef}
      />
      <Modal
        visible={isModalVisible}
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          {selectedStory && (
            <View style={styles.modalContent}>
              <Image source={{ uri: selectedStory.image }} style={styles.modalImage} />
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  flatListContent: {
    paddingBottom: 20,
  },
  storyContainer: {
    marginHorizontal: 8,
    marginBottom: 8,
    position: 'relative', // Ensure the gradient is positioned correctly
  },
  gradientBorder: {
    borderRadius: 50,
    overflow: 'hidden',
    marginBottom: 14,
    padding: 2, // Add padding to create the border effect
  },
  storyImage: {
    width: 80,
    height: 80,
    borderRadius: 90,
  },
  addIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 5,
  },
  productContainer: {
    margin: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  username: {
    fontWeight: 'bold',
  },
  backgroundImage: {
    width: '100%',
    height: 200,
    justifyContent: 'flex-end',
  },
  textContainer: {
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  productTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  productPrice: {
    color: '#fff',
    fontSize: 14,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
  },
  actionsRow: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  addToCartButton: {
    backgroundColor: 'black',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  addToCartText: {
    color: 'white',
    fontWeight: 'bold',
  },
  storiesList: {
    paddingVertical: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
    padding: 20,
    alignItems: 'center',
  },
  modalImage: {
    width: 300,
    height: 300,
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default HomeScreen;
