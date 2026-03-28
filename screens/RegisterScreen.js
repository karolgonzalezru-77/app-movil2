import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity
} from "react-native";

// 🔥 Firebase
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../src/services/firebase";

export default function RegisterScreen({ navigation }) {

  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {

    console.log("CLICK REGISTER 🚀");

    if (nombre === "" || correo === "" || password === "") {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return;
    }

    console.log("AUTH:", auth);

    try {
      //  Crear usuario en Firebase
      console.log("ANTES DE CREAR USUARIO");
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        correo,
        password
      );

      console.log("ANTES DE CREAR USUARIO");

      // Guardar nombre del usuario
      await updateProfile(userCredential.user, {
        displayName: nombre
      });

      console.log("USUARIO CREADO");

      console.log("Usuario creado:", userCredential.user);

      Alert.alert("Éxito", "Cuenta creada correctamente");

      // 🔁 Redirigir al login
      navigation.navigate("Login");

    } catch (error) {

      const err = error;

      if (err.code === "auth/email-already-in-use") {
        Alert.alert("Error", "El correo ya está registrado");
      } else if (err.code === "auth/invalid-email") {
        Alert.alert("Error", "Correo inválido");
      } else if (err.code === "auth/weak-password") {
        Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres");
      } else {
        Alert.alert("Error", err.message);
      }

    }
  };

  return (

    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >

      <ScrollView contentContainerStyle={styles.container}>

        <Text style={styles.title}>Crear Cuenta</Text>

        <TextInput
          placeholder="Nombre completo"
          placeholderTextColor="#666"
          style={styles.input}
          value={nombre}
          onChangeText={setNombre}
        />

        <TextInput
          placeholder="Correo electrónico"
          placeholderTextColor="#666"
          style={styles.input}
          value={correo}
          onChangeText={setCorreo}
        />

        <TextInput
          placeholder="Contraseña"
          placeholderTextColor="#666"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Registrarse</Text>
        </TouchableOpacity>

        <Text style={styles.login}>
          ¿Ya tienes cuenta?{" "}
          <Text
            style={styles.link}
            onPress={() => navigation.navigate("Login")}
          >
            Inicia sesión
          </Text>
        </Text>

      </ScrollView>

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({

  container:{
    flexGrow:1,
    justifyContent:"center",
    alignItems:"center",
    padding:20
  },

  title:{
    fontSize:28,
    fontWeight:"bold",
    marginBottom:30
  },

  input:{
    width:"100%",
    backgroundColor:"#f2f2f2",
    padding:12,
    borderRadius:8,
    marginBottom:15,
    color:"#000"
  },

  button:{
    backgroundColor:"#2563eb",
    padding:15,
    borderRadius:8,
    width:"100%",
    alignItems:"center"
  },

  buttonText:{
    color:"white",
    fontWeight:"bold"
  },

  login:{
    marginTop:20
  },

  link:{
    color:"#2563eb",
    fontWeight:"bold"
  }

});