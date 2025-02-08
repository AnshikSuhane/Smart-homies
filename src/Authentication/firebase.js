import { initializeApp } from "firebase/app";
import { getAuth, updateProfile } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyAsFXihxDk0a_jhAG98xRKh7Uw5z8jBZE8",
  authDomain: "smart-home-application-6cce4.firebaseapp.com",
  databaseURL: "https://smart-home-application-6cce4-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "smart-home-application-6cce4",
  storageBucket: "smart-home-application-6cce4.firebasestorage.app",
  messagingSenderId: "624627653108",
  appId: "1:624627653108:web:70d57fbf740c7eaa68c1a1",
  measurementId: "G-EWBT5QJ07L"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app); 
const db = getFirestore(app);
const storage = getStorage(app);
const updateUserProfile = async (displayName, photoURL) => {
  const user = auth.currentUser;

  if (user) {
    try {
      await updateProfile(user, {
        displayName: displayName,
        photoURL: photoURL
      });
      console.log("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  } else {
    console.error("No user is currently signed in.");
  }
};
export { auth, db, storage, updateUserProfile };
export default app;
