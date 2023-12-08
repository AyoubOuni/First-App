import app from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/database";
import "firebase/compat/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDy9oL91nSk-Zc44hrT5p0Ve98ik0XjpMU",
  authDomain: "whatsapp-42971.firebaseapp.com",
  projectId: "whatsapp-42971",
  storageBucket: "whatsapp-42971.appspot.com",
  messagingSenderId: "118539763437",
  appId: "1:118539763437:web:37833c7b724d44a66996e4",
  measurementId: "G-GJ00YXXJ5V"
};

// Initialize Firebase
const firebase=app.initializeApp(firebaseConfig);
export default firebase;