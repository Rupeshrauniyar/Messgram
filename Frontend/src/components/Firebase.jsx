// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAlO30VozRDtaAjUJqm3hU3NfqJNw75y-0",
  authDomain: "messgram-2082.firebaseapp.com",
  projectId: "messgram-2082",
  storageBucket: "messgram-2082.firebasestorage.app",
  messagingSenderId: "954956170983",
  appId: "1:954956170983:web:f3683345d7e049d5230442",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export default app;
