// src/services/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// (Opcional) analytics solo funciona en web, en React Native puede dar problemas
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBacVPzYYERMcRdVPJuH68mgPI3HhtIOss",
  authDomain: "medicare-app-651c8.firebaseapp.com",
  projectId: "medicare-app-651c8",
  storageBucket: "medicare-app-651c8.firebasestorage.app",
  messagingSenderId: "72020908661",
  appId: "1:72020908661:web:07382e7d498a054dc5b63c",
  measurementId: "G-VJ30KPTQZM"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// 🔥 ESTA ES LA CLAVE
export const auth = getAuth(app);