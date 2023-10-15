// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";


//import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCjcw5bKpV_MwyfXFK7Qussu1ZBcA1zzNM",
  authDomain: "projeto-myphotos.firebaseapp.com",
  projectId: "projeto-myphotos",
  storageBucket: "projeto-myphotos.appspot.com",
  messagingSenderId: "156783944309",
  appId: "1:156783944309:web:605079dbb077ed618c4e3c",
  measurementId: "G-FLN6Y419X8",
  databaseURL: "https://projeto-myphotos-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const database = getDatabase(app);
//const analytics = getAnalytics(app);

export default app;