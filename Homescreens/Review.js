// Review component
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, TextInput, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import firebase from '../Config/Index';

const database = firebase.database();

export default function Review({ postId, addReview, likeReview, userProfile }) {
    const [commentText, setCommentText] = useState('');
    const [reviews, setReviews] = useState([]);
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        // Set up a listener for real-time updates on reviews
        const reviewsRef = database.ref(`horizonReviews/${postId}`);
        const reviewsListener = reviewsRef.on('value', (snapshot) => {
            if (snapshot.exists()) {
                const reviewsData = snapshot.val();
                const reviewsArray = Object.keys(reviewsData).map((key) => ({ id: key, ...reviewsData[key] }));
                setReviews(reviewsArray);
            } else {
                setReviews([]);
            }
        });

        // Cleanup function to remove the listener when the component unmounts
        return () => {
            reviewsRef.off('value', reviewsListener);
        };
    }, [postId]);

    const submitReview = () => {
        if (commentText.trim() !== '') {
            addReview(postId, commentText);
            setCommentText('');
        }
    };

    const submitLike = (reviewId) => {
        likeReview(postId, reviewId);
    };

    const toggleExpand = () => {
        setExpanded(!expanded);
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

    const isReviewLiked = (reviewId) => {
        // Get the current user's ID
        const userId = firebase.auth().currentUser.uid;

        // Find the post in the posts array
        const likedReview = reviews.find((review) =>  review.id === reviewId);

        // Check if the post is liked by the current user
        return likedReview && likedReview.likedBy && likedReview.likedBy.includes(userId);
    };

    return (
        <View style={styles.reviewContainer}>
            <TouchableOpacity onPress={toggleExpand}>
                <Text style={styles.expandButton}>{expanded ? 'Shrink Reviews' : 'Expand Reviews'}</Text>
            </TouchableOpacity>
            {expanded && (
                <View>
                    <View style={styles.commentContainer}>
                        <TextInput
                            placeholder="Add a comment..."
                            value={commentText}
                            onChangeText={(text) => setCommentText(text)}
                            style={styles.commentInput}
                        />
                        <TouchableOpacity onPress={submitReview}>
                            <Ionicons name="send" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={reviews}
                        renderItem={({ item }) => (
                            <View style={styles.reviewItem}>
                                <View style={styles.reviewHeader}>
                                    <Image source={{ uri: item.userProfile?.url }} style={styles.userProfileImage} />
                                    <Text style={styles.userName}>{`${item.userProfile?.nom} ${item.userProfile?.prenom}`}</Text>
                                    <Text style={styles.timestamp}>{formatTimestamp(item.timestamp)}</Text>
                                </View>
                                <Text style={styles.commentText}>{item.comment}</Text>
                                <View style={styles.likeContainer}>
                                    <TouchableOpacity onPress={() => submitLike(item.id)}>
                                        <Ionicons
                                            name={isReviewLiked(item.id) ? 'heart' : 'heart-outline'}
                                            size={24}
                                            color={isReviewLiked(item.id) ? 'red' : 'black'}
                                        />
                                    </TouchableOpacity>
                                    <Text style={styles.likeText}>{`${item.likes} ${item.likes === 1 ? 'like' : 'likes'}`}</Text>
                                </View>
                            </View>
                        )}
                        keyExtractor={(item) => item.id}
                    />
                </View>
            )}
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
    },
    commentText: {
        marginLeft: 15,
    },
    reviewContainer: {
        marginLeft: 15,
        marginBottom: 20,
    },
    expandButton: {
        color: 'blue',
        marginBottom: 10,
    },
    reviewItem: {
        marginBottom: 10,
    },
    reviewHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
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
    commentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20
    },
    commentInput: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        marginRight: 10,
    },
});
