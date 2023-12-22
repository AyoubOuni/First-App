import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Image, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import firebase from '../Config/Index';
import Review from './Review';
import { Ionicons } from '@expo/vector-icons';
const database = firebase.database();
const storage = firebase.storage();

export default function Posts() {
  const [postText, setPostText] = useState('');
  const [postImage, setPostImage] = useState(null);
  const [posts, setPosts] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  // Fetch posts and user profile from Firebase on component mount
  useEffect(() => {
    // Fetch user profile
    const userProfileRef = database.ref(`profils/${firebase.auth().currentUser.uid}`);
    userProfileRef.on('value', (snapshot) => {
      setUserProfile(snapshot.val());
    });

    // Fetch posts
    const postsRef = database.ref('horizonPosts');
    postsRef.on('value', (snapshot) => {
      if (snapshot.exists()) {
        const postsData = snapshot.val();
        const postsArray = Object.keys(postsData).map((key) => ({ id: key, ...postsData[key] }));
        setPosts(postsArray.reverse()); // Reverse the array to show newest posts first
      }
    });

    return () => {
      postsRef.off('value');
      userProfileRef.off('value');
    };
  }, []);

  // Function to handle image selection
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setPostImage(result.assets[0].uri);
    }
  };

  const uploadImageToFirebase = async (uri) => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.error(e);
        reject(new TypeError('Network request failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    });

    const storageRef = storage.ref();
    const imageRef = storageRef.child(`horizon_post_images/${Date.now()}.jpg`);

    await imageRef.put(blob);
    const url = await imageRef.getDownloadURL();

    return url;
  };

  const submitPost = async () => {
    setLoading(true);

    let imageUrl = null;

    try {
      if (postImage) {
        imageUrl = await uploadImageToFirebase(postImage);
        setPostImage(imageUrl);
      }

      if (postText || imageUrl) {
        const currentTime = new Date().toISOString();
        const postsRef = database.ref('horizonPosts');
        const newPostKey = postsRef.push().key;

        const newPost = {
          id: newPostKey,
          text: postText,
          image: imageUrl,
          timestamp: currentTime,
          userProfile: userProfile,
          likes: 0,
          likedBy: []
        };

        await postsRef.child(newPostKey).set(newPost);

        setPostText('');
        setPostImage(null);
      }
    } catch (error) {
      console.error('Error submitting post:', error);
    } finally {
      setLoading(false);
    }
  };


  const likePost = async (postId, currentLikes) => {
    try {
      const userId = firebase.auth().currentUser.uid;
      const postsRef = database.ref('horizonPosts');
      const postRef = postsRef.child(postId);

      postRef.transaction((post) => {
        if (post) {
          if (!post.likes) {
            post.likes = 1;
            post.likedBy = [userId];
          } else {
            const likedIndex = post.likedBy.indexOf(userId);
            if (likedIndex === -1) {
              post.likes += 1;
              post.likedBy.push(userId);
            } else {
              post.likes -= 1;
              post.likedBy.splice(likedIndex, 1);
            }
          }
        }
        return post;
      });
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const isPostLiked = (postId) => {
    // Get the current user's ID
    const userId = firebase.auth().currentUser.uid;

    // Find the post in the posts array
    const likedPost = posts.find((post) => post.id === postId);

    // Check if the post is liked by the current user
    return likedPost && likedPost.likedBy && likedPost.likedBy.includes(userId);
  };

  const submitReview = async (postId, comment) => {
    try {
      const userId = firebase.auth().currentUser.uid;
      const reviewsRef = database.ref(`horizonReviews/${postId}`);
      const newReviewKey = reviewsRef.push().key;
      const currentTime = new Date().toISOString();
      const newReview = {
        id: newReviewKey,
        user: userId,
        postId: postId,
        comment,
        timestamp: currentTime,
        userProfile: userProfile,
        likes: 0,
        likedBy: [],
      };

      await reviewsRef.child(newReviewKey).set(newReview);
    } catch (error) {
      console.error('Error adding review:', error);
    }
  };


  const likeReview = async (postId, reviewId) => {
    try {
      const userId = firebase.auth().currentUser.uid;
      const reviewsRef = database.ref(`horizonReviews/${postId}`);
      const reviewRef = reviewsRef.child(reviewId);

      reviewRef.transaction((review) => {
        if (review) {
          if (!review.likes) {
            review.likes = 1;
            review.likedBy = [userId];
          } else {
            const likedIndex = review.likedBy.indexOf(userId);
            if (likedIndex === -1) {
              review.likes += 1;
              review.likedBy.push(userId);
            } else {
              review.likes -= 1;
              review.likedBy.splice(likedIndex, 1);
            }
          }
        }
        return review;
      });
    } catch (error) {
      console.error('Error liking review:', error);
    }
  };



  // Function to format the timestamp in a human-readable format
  const formatTimestamp = (timestamp) => {
    const postDate = new Date(timestamp);
    const currentDate = new Date();

    const seconds = Math.floor((currentDate - postDate) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) {
      return `${seconds} ${seconds === 1 ? 'second' : 'seconds'} ago`;
    } else if (minutes < 60) {
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (hours < 24) {
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else {
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    }
  };


  return (
    <View style={styles.container}>
      <View style={styles.postForm}>
        <TextInput
          value={postText}
          onChangeText={(text) => setPostText(text)}
          placeholder="Write your post..."
          style={styles.input}
        />
        <TouchableOpacity onPress={pickImage}>
          <Text style={styles.chooseImageButton}>Choose Image</Text>
        </TouchableOpacity>
        {postImage && <Image source={{ uri: postImage }} style={styles.previewImage} />}
        <Button title="Post" onPress={submitPost} />
        {loading && <ActivityIndicator size="large" color="#0000ff" />}
      </View>

      <FlatList
        data={posts}
        renderItem={({ item }) => (
          <View style={styles.postItem}>
            <View style={styles.postHeader}>
              <Image source={{ uri: item.userProfile?.url }} style={styles.userProfileImage} />
              <Text style={styles.userName}>{`${item.userProfile?.nom} ${item.userProfile?.prenom}`}</Text>
              <Text style={styles.timestamp}>{formatTimestamp(item.timestamp)}</Text>
            </View>

            <Text>{item.text}</Text>
            {item.image && (
              <Image
                source={{ uri: item.image }}
                style={styles.postImage}
                resizeMode="fill"
              />
            )}
            <View style={styles.likeContainer}>
              <TouchableOpacity onPress={() => likePost(item.id, item.likes)}>
                <Ionicons
                  name={isPostLiked(item.id) ? 'heart' : 'heart-outline'}
                  size={24}
                  color={isPostLiked(item.id) == true ? 'red' : 'black'}
                />
              </TouchableOpacity>
              <Text style={styles.likeText}>{`${item.likes} ${item.likes === 1 ? 'like' : 'likes'}`}</Text>
            </View>

            <Review
              postId={item.id}
              addReview={submitReview}
              likeReview={likeReview}
              userProfile={userProfile}
            />

          </View>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  likeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    marginLeft: 10
  },
  likeText: {
    marginLeft: 5,
    marginRight: 10,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  postForm: {
    marginBottom: 20,
  },
  input: {
    height: 40,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
  chooseImageButton: {
    color: 'blue',
    marginBottom: 10,
  },
  previewImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  postItem: {
    marginBottom: 20,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  userProfileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  userName: {
    fontWeight: 'bold',
    marginRight: 10,
  },
  timestamp: {
    color: '#888',
  },
  postImage: {
    width: '100%',
    height: 300,
    marginTop: 10,
    borderRadius: 5,
  },
});