import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Button, TextInput, Card } from 'react-native-paper';
import img from './../assets/user.png';
import * as ImagePicker from "expo-image-picker";
import firebase from '../Config/Index';
import { TouchableOpacity } from 'react-native-web';
const database = firebase.database();
import { useRoute } from '@react-navigation/native';

const MyAccount = (props) => {
  const route = useRoute();
  const currentid = route.params?.currentid;
  const [userDetails, setUserDetails] = useState({
    nom: '',
    prenom: '',
    tel: '',
    url: '',
    uid: "",
  });
  const [Isdefault, setIsdefault] = useState(true);
  const [urlImage, seturlImage] = useState('');

  useEffect(() => {
    const profileRef = database.ref(`profils/${currentid}`);
    setUserDetails({ ...userDetails, uid: currentid });

    profileRef.once('value', (snapshot) => {
      if (snapshot.exists()) {
        const profileData = snapshot.val();
        setUserDetails({ ...profileData, uid: currentid });
        setIsdefault(true);
      }
    })
  }, []);

  const handleNameChange = (text) => {
    setUserDetails({ ...userDetails, nom: text });
  };

  const handleSurnameChange = (text) => {
    setUserDetails({ ...userDetails, prenom: text });
  };

  const handleEmailChange = (text) => {
    setUserDetails({ ...userDetails, tel: text });
  };

  const saveUserData = async () => {
    await database.ref(`profils/${currentid}`).set(userDetails);
    console.log('User details updated successfully!');
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setIsdefault(false);
      seturlImage(result.assets[0].uri);
      setUserDetails({ ...userDetails, url: result.assets[0].uri });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.container}>
        <Text style={styles.title}>My Account</Text>

        <TouchableOpacity onPress={async () => { await pickImage(); }}>
          <Image source={Isdefault ? userDetails.url ? { uri: userDetails.url } : require('./../assets/user.png') : { uri: urlImage }} style={styles.userPhoto} />
        </TouchableOpacity>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>Nom</Text>
            <TextInput
              value={userDetails.nom}
              onChangeText={handleNameChange}
              style={styles.input}
            />
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>Prenom</Text>
            <TextInput
              value={userDetails.prenom}
              onChangeText={handleSurnameChange}
              style={styles.input}
            />
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>N°Tel</Text>
            <TextInput
              value={userDetails.tel}
              onChangeText={handleEmailChange}
              style={styles.input}
            />
          </Card.Content>
        </Card>

        <Button
          mode="contained"
          style={styles.saveButton}
          labelStyle={styles.buttonLabel}
          onPress={async () => { await saveUserData() }}
        >
          Save
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f2f2f2',
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  userPhoto: {
    width: 120,
    height: 120,
    borderRadius: 75,
    marginBottom: 20,
  },
  card: {
    width: '80%',
    marginBottom: 10,
    elevation: 4,
    backgroundColor: '#fff',
  },
  cardTitle: {
    fontSize: 15,
    marginBottom: 10,
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    height: 30,
    marginBottom: 10,
  },
  saveButton: {
    width: '70%',
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    backgroundColor: '#009688',
  },
  buttonLabel: {
    fontSize: 16,
    color: '#fff',
  },
});

export default MyAccount;
