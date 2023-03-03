import { initializeApp } from 'firebase/app'
import {
    getAuth,
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendEmailVerification,
    //read data from Firebase    
} from "firebase/auth"
//ref = reference to a "collection"
import {
    getDatabase,
    ref as firebaseDatabaseRef,
    set as firebaseSet,
    child,
    get,
    onValue,
} from "firebase/database"

const firebaseConfig = {
    apiKey: "AIzaSyBfJ8J3hFKZsXoK33xGnzUcAz0zpopCCns",
    authDomain: "project-513d6.firebaseapp.com",
    databaseURL: "https://project-513d6-default-rtdb.asia-southeast1.firebasedatabase.app/",
    projectId: "project-513d6",
    storageBucket: "project-513d6.appspot.com",
    appId: '1:387514969597:android:4dd7b47e27097936bf3d94',
    messagingSenderId: "387514969597",
}

const app = initializeApp(firebaseConfig)
const auth = getAuth() // xác thực account
const firebaseDatabase = getDatabase()

export {
    auth,
    firebaseDatabase,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendEmailVerification,
    onAuthStateChanged,
    getDatabase,
    firebaseDatabaseRef,
    firebaseSet,
    child,
    get,
    onValue,
}