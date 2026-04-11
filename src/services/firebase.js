// src/services/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // 🔥 FALTABA ESTO

const firebaseConfig = {
  apiKey: "AIzaSyBacVPzYYERMcRdVPJuH68mgPI3HhtIOss",
  authDomain: "medicare-app-651c8.firebaseapp.com",
  projectId: "medicare-app-651c8",
  storageBucket: "medicare-app-651c8.firebasestorage.app",
  messagingSenderId: "72020908661",
  appId: "1:72020908661:web:07382e7d498a054dc5b63c",
};

// 🔥 Inicializar
const app = initializeApp(firebaseConfig);

// 🔥 EXPORTAR TODO
export const auth = getAuth(app);
export const db = getFirestore(app); // 🔥 ESTA ES LA CLAVE