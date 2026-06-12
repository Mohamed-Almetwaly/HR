// firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  // ضع هنا إعدادات الـ SDK الخاصة بمشروعك من موقع Firebase
  apiKey: "YOUR_API_KEY",
  authDomain: "company-s-management-system.firebaseapp.com",
  projectId: "company-s-management-system",
  storageBucket: "company-s-management-system.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);