import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
const firebaseConfig = {
    apiKey: "AIzaSyDe105fglm-9FoWOBL9zTAt__fULyz99Ns",
    authDomain: "pantry-bf7a8.firebaseapp.com",
    projectId: "pantry-bf7a8",
    storageBucket: "pantry-bf7a8.appspot.com",
    messagingSenderId: "281268358401",
    appId: "1:281268358401:web:f69b53eaa9619760cbdf00"
  };
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
export { firestore };