import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import picture from "./../assets/bg.jpg"
import firebase from '../Config/Index';
const auth=firebase.auth();
const Inscription = (props) => {

  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [confirmmotDePasse, setconfirmmotDePasse] = useState('');

  const handleInscription = () => {

    if(motDePasse === confirmmotDePasse) {
      auth.createUserWithEmailAndPassword(email, motDePasse)
      .then(()=>{
        props.navigation.navigate('Home');

      }).catch(err => {alert(err)})
    }
    // Handle inscription logic here
    // Add your inscription logic
  };

  return (
    <ImageBackground source={picture} style={styles.backgroundImage}>
        <Text style={styles.title}>Inscription</Text>
      
        <TextInput
          style={styles.input}
          placeholder="Email"
          onChangeText={(text) => setEmail(text)}
          value={email}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Mot de passe"
          onChangeText={(text) => setMotDePasse(text)}
          value={motDePasse}
          secureTextEntry={true}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Paswword"
          onChangeText={(text) => setconfirmmotDePasse(text)}
          value={confirmmotDePasse}
          secureTextEntry={true}
        />
       
        <TouchableOpacity style={styles.createAccountButton} onPress={handleInscription}>
          <Text style={styles.buttonText}>S'inscrire</Text>
        </TouchableOpacity>
    </ImageBackground>
  );
};

// Styles
const styles = StyleSheet.create({
    backgroundImage: {
      flex: 1,
      resizeMode: 'cover',
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      color: '#fff',
    },
    input: {
      width: '80%',
      height: 40,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      marginBottom: 15,
      paddingHorizontal: 10,
      backgroundColor: '#fff',
    },
    createAccountButton: {
      backgroundColor: '#007bff',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
    },
  });
  
export default Inscription;
