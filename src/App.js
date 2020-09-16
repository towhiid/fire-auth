import React, { useState } from 'react';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';

firebase.initializeApp(firebaseConfig);

function App() {
  const [newUser, setNewUser] = useState(false);
  const [user,setUser] = useState({
    isSignedIn : false,
    name : '',
    email : '',
    password: '',
    photo : ''
  })
  const provider = new firebase.auth.GoogleAuthProvider();
  const fbProvider = new firebase.auth.FacebookAuthProvider();
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

  const handleFbSignIn = () => {
    firebase.auth().signInWithPopup(fbProvider)
    .then(function(result) {
      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      var token = result.credential.accessToken;
      // The signed-in user info.ds
      var user = result.user;
      console.log('signed in', user);
      
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    });
  }
  
  const handleSignOut = () => {
    firebase.auth().signOut()
    .then(res => {
      const signOutUser = {
        isSignedIn : false,
        name : '',
        email: '',
        photo : '',
        error : '',
        success: false
      }
      setUser(signOutUser);
    })
    .catch(err => {
      console.log(err);
    })
  }

  const handleSubmit = (e) => {
    // console.log(user.email, user.password);
    if(newUser && user.email && user.password){
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then(res => {
        const newUserInfo = {...user};
        newUserInfo.error = '';
        newUserInfo.success = true;
        setUser(newUserInfo);
        updateUserName(user.name);
      })
      .catch(error => {
        // Handle Errors here.
        const newUserInfo = {...user};
        newUserInfo.error = error.message;
        newUserInfo.success = false;
        setUser(newUserInfo);
      });
    }
    if(!newUser && user.email && user.password){
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
      .then(res =>{
        const newUserInfo = {...user};
        newUserInfo.error = '';
        newUserInfo.success = true;
        setUser(newUserInfo);
        console.log('signed in', res.user);
      })
      .catch(function(error) {
        const newUserInfo = {...user};
        newUserInfo.error = error.message;
        newUserInfo.success = false;
        setUser(newUserInfo);
      });
    }

    e.preventDefault();
  }

  const updateUserName = name =>{
    const user = firebase.auth().currentUser;

    user.updateProfile({
      displayName: name
    }).then(function() {
      console.log('Updated');
    }).catch(function(error) {
     console.log(error);
    });
  }
  const handleBlur = (e) =>{

      let isFormValid;
      if(e.target.name === "email"){
        isFormValid = /\S+@\S+\.\S+/.test(e.target.value);
      }
      if(e.target.name === "password"){
        const isPassValid = e.target.value.length > 8;
        const passHasNum = /\d{1}/.test(e.target.value);
        isFormValid = isPassValid && passHasNum;
      }
      if(isFormValid){
        const newUserInfo = {...user};
        newUserInfo[e.target.name] = e.target.value;
        setUser(newUserInfo);

      }
  }
  

  return (
    <div className = "App">
      {
        user.isSignedIn ? <button onClick = {handleSignOut}>Sign Out</button> :
        <button onClick = {handleSign}>Sign In</button>
      }
      <br/>
      <button onClick = {handleFbSignIn}>Sign In using Facebook</button>
      
      {
        user.isSignedIn && <div>
          <p>Welcome, {user.name}</p>
          <p>Your email : {user.email}</p>
          <img src= {user.photo} alt=""/>
        </div>
      }

      <h1>Our Own Authentication</h1>

      <input type="checkbox" name="newUser" onChange = {() => setNewUser(!newUser)} id = ""/>
      <label htmlFor="newUser">Sign Up Here.</label>
        
      <form onSubmit = {handleSubmit}>
        {newUser && <input type="text" name="name" onBlur = {handleBlur} placeholder = "Your name"/>}
        <br/>
        <input type="text" name = "email" onBlur = {handleBlur} placeholder = "Email" required/>
        <br/>
        <input type="password" name = "password" onBlur = {handleBlur} placeholder = "enter password" required/>
        <br/>
        <input type="submit" value={newUser ? 'Sign Up' : 'Sign In'}/>
      </form>
      <p style= {{color : "red"}}>{user.error}</p>
      {user.success && <p style= {{color : "green"}}>User {newUser ? 'created' : 'logged in'} Successfully.</p>}
    </div>
  );
}

export default App;
