import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Image, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import firebase from '../Config/Index';

const database = firebase.database();
const storage = firebase.storage();

const Horizon = () => {
    const [text, setText] = useState('');
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [userProfile, setUserProfile] = useState(null);
    useEffect(() => {
        // Fetch user profile
        const userProfileRef = database.ref(`profils/${firebase.auth().currentUser.uid}`);
        userProfileRef.on('value', (snapshot) => {
            setUserProfile(snapshot.val());
        });

        return () => {
            userProfileRef.off('value');
        };
    }, []);

    const handleImaginePress = async () => {
        try {
            setLoading(true);

            const response = await fetch('https://8111-34-87-189-13.ngrok.io/horizon', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: text,
                }),
                mode: 'cors',
            });

            if (response.ok) {
                const blob = await response.blob();
                const imageUrl = URL.createObjectURL(blob);
                console.log('Server response:', response);
                await uploadImageToFirebase(imageUrl);
            } else {
                Alert.alert('Error', 'Failed to imagine. Please try again.');
            }
        } catch (error) {
            console.error('Error imagining:', error);
            Alert.alert('Error', 'An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const submitImage = async (imageUrl) => {
        try {
            const userId = firebase.auth().currentUser.uid;
            const reviewsRef = database.ref(`horizonImages/`);
            const newImageKey = reviewsRef.push().key;
            const currentTime = new Date().toISOString();
            const newImage = {
                id: newImageKey,
                user: userId,
                imageUrl: imageUrl,
                timestamp: currentTime,
            };

            await reviewsRef.child(newImageKey).set(newImage);
            setImage(imageUrl);
        } catch (error) {
            console.error('Error adding Image:', error);
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
            xhr.open('GET', uri, true); // Use the provided uri directly
            xhr.send(null);
        });

        const storageRef = storage.ref();
        const imageRef = storageRef.child(`horizon_images/${Date.now()}.jpg`);

        await imageRef.put(blob);
        const url = await imageRef.getDownloadURL();

        // Call the submitImage function with the URL
        submitImage(url);

        return url;
    };

    const handleReImaginePress = () => {
        setImage(null);
        setText('');
    };

    const handleSharePress = async () => {
        setLoading(true);
        try {

            const currentTime = new Date().toISOString();
            const postsRef = database.ref('horizonPosts');
            const newPostKey = postsRef.push().key;

            const newPost = {
                id: newPostKey,
                text: text,
                image: image,
                timestamp: currentTime,
                userProfile: userProfile,
                likes: 0,
                likedBy: []
            };

            await postsRef.child(newPostKey).set(newPost);


        } catch (error) {
            console.error('Error submitting post:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {image ? (
                <View style={styles.imageContainer}>
                    <Image source={{ uri: image }} style={styles.image} resizeMode="stretch" />
                    <TouchableOpacity style={styles.button} onPress={handleSharePress}>
                        <Text style={styles.buttonLabel}>Share</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.textAreaContainer}>
                    <TextInput
                        placeholder="Enter text here..."
                        value={text}
                        onChangeText={(newText) => setText(newText)}
                        multiline
                        style={styles.textArea}
                    />
                    <TouchableOpacity style={styles.button} onPress={handleImaginePress}>
                        <Text style={styles.buttonLabel}>Imagine</Text>
                    </TouchableOpacity>
                </View>
            )}

            {loading && (
                <ActivityIndicator style={styles.loadingIndicator} size="large" color="#3498db" />
            )}

            {image && (
                <TouchableOpacity style={styles.button} onPress={handleReImaginePress}>
                    <Text style={styles.buttonLabel}>Re Imagine</Text>
                </TouchableOpacity>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flex: 1,
        alignItems: 'center',
        padding: 20,
    },
    imageContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginVertical: 10,
        padding: 10,
        width: '100%',
        shadowColor: 'black',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
    textAreaContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginVertical: 10,
        padding: 10,
        width: '100%',
        shadowColor: 'black',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
    textArea: {
        height: 150,
    },
    button: {
        backgroundColor: '#3498db',
        padding: 10,
        borderRadius: 5,
        marginVertical: 10,
    },
    buttonLabel: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',

    },
    image: {
        width: '100%',
        height: 300,

        marginVertical: 10,
    },
    loadingIndicator: {
        marginVertical: 10,
    },
});

export default Horizon;
