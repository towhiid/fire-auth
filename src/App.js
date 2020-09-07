import React, { useState } from 'react';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';

firebase.initializeApp(firebaseConfig);

function App() {
  const [user,setUser] = useState({
    isSignedIn : false,
    name : '',
    email : '',
    photo : ''
  })
  const provider = new firebase.auth.GoogleAuthProvider();
  const handleSign = () => {
    firebase.auth().signInWithPopup(provider)
    .then(res => {
      const {displayName, email, photoURL} = res.user;
      const signedUser = {
        isSignedIn : true,
        name : displayName,
        email : email,
        photo : photoURL
      }
      setUser(signedUser);
      console.log(displayName, email, photoURL);
    })
    .catch(err => {
      console.log(err);
      console.log(err.message);
    })
  }
  
  const handleSignOut = () => {
    firebase.auth().signOut()
    .then(res => {
      const signOutUser = {
        isSignedIn : false,
        name : '',
        email: '',
        photo : ''
      }
      setUser(signOutUser);
    })
    .catch(err => {
      console.log(err);
    })
  }
  

  return (
    <div className = "App">
      {
        user.isSignedIn ? <button onClick = {handleSignOut}>Sign Out</button> :
        <button onClick = {handleSign}>Sign In</button>
      }
      {
        user.isSignedIn && <div>
          <p>Welcome, {user.name}</p>
          <p>Your email : {user.email}</p>
          <img src= {user.photo} alt=""/>
        </div>
      }
    </div>
  );
}

export default App;
