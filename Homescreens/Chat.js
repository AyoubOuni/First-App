import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native'; // Import useNavigation
import firebase from '../Config/Index';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

const database = firebase.database();
const storage = firebase.storage();

export default function Chat() {
  const route = useRoute();
  const navigation = useNavigation(); // Initialize navigation
  const { currentId, id_user } = route.params;
  const [msg, setMsg] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [postImage, setPostImage] = useState(null);

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
    const imageRef = storageRef.child(`horizon_chat_images/${Date.now()}.jpg`);

    await imageRef.put(blob);
    const url = await imageRef.getDownloadURL();

    return url;
  };

  const flatListRef = useRef();

  useEffect(() => {
    const messageRef = database.ref('msgS').orderByChild('time');
    messageRef.on('child_added', (snapshot) => {
      const newMessage = snapshot.val();

      if ((newMessage.sender === currentId && newMessage.receiver === id_user) ||
        (newMessage.sender === id_user && newMessage.receiver === currentId)) {
        setMessages((prevMessages) => [...prevMessages, { ...newMessage, id: snapshot.key }]);
      }


      flatListRef.current.scrollToEnd({ animated: true });
    });

    return () => {
      messageRef.off('child_added');
    };
  }, []);

  const sendMessage = async () => {
    let imageUrl = null;
    if (postImage) {
      imageUrl = await uploadImageToFirebase(postImage);
      setPostImage(imageUrl);
    }
    const currentTime = new Date().toISOString();
    const ref_msg = database.ref('msgS');
    const key = ref_msg.push().key;
    ref_msg.child(key).set({
      msg: msg,
      sender: currentId,
      receiver: id_user,
      time: currentTime,
      imageUrl: imageUrl,
      status: false,
    });
    setMsg('');
    setPostImage(null);
  };

  const handleTyping = (isFocused) => {
    const currentUserTypingRef = database.ref(`conversation/${currentId}_${id_user}/isTyping`);
    currentUserTypingRef.set(isFocused);

    const otherUserTypingRef = database.ref(`conversation/${id_user}_${currentId}/isTyping`);
    otherUserTypingRef.on('value', (snapshot) => {
      const otherUserIsTyping = snapshot.val();
      setIsTyping(otherUserIsTyping);
    });
  };

  const renderMessage = ({ item }) => {
    const isCurrentUser = item.sender === currentId;
    console.log('User details updated successfully!' + item.imageUrl);
    return (
      <View
        style={[styles.messageContainer, isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage]}
      >
        {item.imageUrl && (
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.postImage}
            resizeMode="fill"
          />
        )}
        <Text>{item.msg}</Text>


      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Back</Text>

        </TouchableOpacity>
      </View>
      <View style={styles.contentContainer}>
        <FlatList
          data={messages}
          extraData={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          keyboardShouldPersistTaps="always"
          ref={flatListRef}
        /></View><View style={styles.bottomContainer}>
        {/* {isTyping && <Text style={styles.typingIndicator}>{`${currentId} current user`}</Text>} */}
        {isTyping && <Text style={styles.typingIndicator}>{`typing...`}</Text>}

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.inputContainer}
        >

          <TouchableOpacity onPress={pickImage}>
            <Ionicons
              name={'image-outline'}
              size={24}
              color='#6B52AE'
              marginRight={15}
            />
          </TouchableOpacity>
          {postImage && <Image source={{ uri: postImage }} style={styles.previewImage} />}


          <TextInput
            value={msg}
            onChangeText={(text) => setMsg(text)}
            onFocus={() => handleTyping(true)}
            onBlur={() => handleTyping(false)}
            placeholder="Type your message here"
            style={styles.inputField}
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>

        </KeyboardAvoidingView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inverted: {
    transform: [{ scaleY: -1 }],
  }, contentContainer: {
    flex: 1,
  },
  header: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#6B52AE",
    borderRadius: 25,
    marginBottom: 15,
  }, bottomContainer: {
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    paddingVertical: 10,
  },
  postImage: {
    width: 250
    ,
    height: 200,
    marginTop: 10,
    borderRadius: 5,
    marginBottom: 10

  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  messageContainer: {
    flexDirection: 'column-reverse',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    maxWidth: "150%",
  },
  currentUserMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#6B52AE",
  },
  otherUserMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#FFFFFF",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    paddingVertical: 10,
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#6B52AE",
    borderRadius: 25,
    marginRight: 5,
    marginBottom: 15
  },
  backButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  previewImage: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  inputField: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#6B52AE",
    borderRadius: 25,
    marginRight: 10,
    color: "#FFFFFF",
  },
  sendButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#6B52AE",
    borderRadius: 25,
  },
  sendButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  typingIndicator: {
    fontStyle: 'italic',
    color: "#FFFFFF",
  },
});