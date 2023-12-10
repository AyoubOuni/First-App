import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import picture from "./../assets/bg.jpg";
import firebase from '../Config/Index';
const auth=firebase.auth();
const Login = (props) => {
    const handleCreateAccount = () => {
      props.navigation.navigate('Inscription');
    };
    const [error, setError] = useState(null);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    

    const handleHome = async () => {
      try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const uid = userCredential.user.uid;
        props.navigation.navigate('Home', { currentid: uid });
      } catch (error) {
        setError('Invalide Email or Password !'); // Set error message if authentication fails
      }
    };

    
    const handleForgotPassword = () => {
      props.navigation.navigate('ResetPassword');
    };
   
  
    return (
      <ImageBackground source={picture} style={styles.backgroundImage}>
          <Text style={styles.title}>Login</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            onChangeText={(text) => setEmail(text)}
            value={email}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            onChangeText={(text) => setPassword(text)}
            value={password}
            secureTextEntry={true}
          />
                {error && <Text style={styles.errorText}>{error}</Text>} {/* Display error message */}

          <TouchableOpacity style={styles.loginButton} onPress={handleHome}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleCreateAccount}>
            <Text style={styles.createAccountText}>Create Account</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleForgotPassword}>
        <Text style={styles.forget}>Forgot Password?</Text>
      </TouchableOpacity>
      </ImageBackground>
    );
  };
const styles = StyleSheet.create({
  errorText: {
    marginTop: 15,
    color: 'red',
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: 'rgba(255, 0, 0, 0.2)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom:10,
    marginTop:10,
  },
  forgotPasswordText: {
    marginTop: 15,
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: 'grey',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // or 'stretch' as per your preference
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // Adjust the opacity as needed
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
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
  loginButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  createAccountText: {
    marginTop: 15,
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: 'grey',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  forget: {
    marginTop: 15,
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: 'orange',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
});

export default Login;
