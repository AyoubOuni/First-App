import React, { useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Button, TextInput, Card } from 'react-native-paper';
import img from './../assets/user.png';
import firebase from '../Config/Index';
const database=firebase.database();
const MyAccount = () => {
  const [nom, setnom] = useState('Ayoub');
  const [prenom, setSsetprenom] = useState('Ouni');
  const [tel, settel] = useState('+216 99 656 639');

  const handleNameChange = (text) => {
    setnom(text);
  };

  const handleSurnameChange = (text) => {
    setSsetprenom(text);
  };

  const handleEmailChange = (text) => {
    settel(text);
  };

  const saveUserData = () => {
    const ref_profils=database.ref("profils");
    const key=ref_profils.push().key;
    const ref_un_profile=ref_profils.child("profil" + key);
    ref_un_profile.set(
        {
            nom:nom,
            prenom:prenom,
            tel:tel,
        }
    )
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>My Account</Text>

      {/* User Photo */}
      <Image source={img} style={styles.userPhoto} />

      {/* Name Card */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>Nom</Text>
          <TextInput
            value={nom}
            onChangeText={handleNameChange}
            style={styles.input}
          />
        </Card.Content>
      </Card>

      {/* Surname Card */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>Prenom</Text>
          <TextInput
            value={prenom}
            onChangeText={handleSurnameChange}
            style={styles.input}
          />
        </Card.Content>
      </Card>

      {/* Email Card */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>Email</Text>
          <TextInput
            value={tel}
            onChangeText={handleEmailChange}
            style={styles.input}
          />
        </Card.Content>
      </Card>

      {/* Save Button */}
      <Button
        mode="contained"
        style={styles.saveButton}
        labelStyle={styles.buttonLabel}
        onPress={saveUserData}
      >
        Save
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  userPhoto: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  card: {
    width: '30%',
    marginBottom: 20,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    marginBottom: 10,
  },
  saveButton: {
    width: '30%',
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
  },
  buttonLabel: {
    fontSize: 16,
  },
});

export default MyAccount;
