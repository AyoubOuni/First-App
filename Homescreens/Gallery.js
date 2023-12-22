import React, { useState, useEffect } from 'react';
import { View, Image, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import the icon library

import firebase from '../Config/Index';

const database = firebase.database();

const Gallery = () => {
  const [userImages, setUserImages] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const navigation = useNavigation();

  useEffect(() => {
    // Fetch user's images from the database
    const userId = firebase.auth().currentUser.uid;
    const imagesRef = database.ref('horizonImages').orderByChild('user').equalTo(userId);

    const imagesListener = imagesRef.on('value', (snapshot) => {
      const images = snapshot.val();
      if (images) {
        const imagesArray = Object.values(images);
        setUserImages(imagesArray);
      } else {
        setUserImages([]);
      }
    });

    return () => imagesRef.off('value', imagesListener);
  }, []);

  const openImageViewer = (index) => {
    setSelectedIndex(index);
    setVisible(true);
  };

  const closeImageViewer = () => {
    setVisible(false);
  };

  const downloadImage = (imageUrl) => {
    // Implement image download logic here
    // You can use a library like react-native-fetch-blob or expo-file-system for downloading
    // Example: https://github.com/joltup/react-native-fetch-blob
  };

  const renderImage = ({ item, index }) => (
    <TouchableOpacity onPress={() => openImageViewer(index)}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      {/* Download icon overlay */}
      <TouchableOpacity
        style={styles.downloadIcon}
        onPress={() => downloadImage(item.imageUrl)}
      >
        <Icon name="download" size={20} color="white" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={userImages}
        renderItem={renderImage}
        keyExtractor={(item) => item.id}
      />

      <ImageViewer
        imageUrls={userImages.map((image) => ({ url: image.imageUrl }))}
        index={selectedIndex}
        visible={visible}
        onCancel={closeImageViewer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 8,
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 5,
    marginVertical: 10,
  },
  downloadIcon: {
    position: 'absolute',
    top: 25,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 5,
    borderRadius: 20,
  },
});

export default Gallery;