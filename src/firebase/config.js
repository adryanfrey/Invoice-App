
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyAohxq0q1F0GkeV9y85S0Km5z7jK9K1QiQ",
  authDomain: "invoice-app-b9eae.firebaseapp.com",
  projectId: "invoice-app-b9eae",
  storageBucket: "invoice-app-b9eae.appspot.com",
  messagingSenderId: "919202223461",
  appId: "1:919202223461:web:cf91b91161075b1022bd8c"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app)
const auth = getAuth(app)

export {db, auth}