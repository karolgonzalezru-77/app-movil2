import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function LoginScreen({navigation}) {

  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {

    if(correo === "" || password === ""){
      Alert.alert("Error", "Completa todos los campos");
      return;
    }

    navigation.navigate("Home");
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>MediCare+</Text>
      <Text style={styles.subtitle}>Adherencia a Tratamientos</Text>

      <View style={styles.card}>

        <Text style={styles.loginTitle}>Iniciar Sesión</Text>

        <Text style={styles.label}>Correo Electrónico</Text>
        <TextInput
          placeholder="ejemplo@correo.com"
          style={styles.input}
          value={correo}
          onChangeText={setCorreo}
        />

        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          placeholder="********"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Ingresar</Text>
        </TouchableOpacity>

        <Text style={styles.register}>
          ¿No tienes cuenta?{" "}
          <Text 
          style={styles.link}
          onPress={() => navigation.navigate("Register")}
          >
            Regístrate aquí
          </Text>
        </Text>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:"#eef2f6",
    justifyContent:"center",
    alignItems:"center"
  },

  title:{
    fontSize:32,
    fontWeight:"bold"
  },

  subtitle:{
    marginBottom:30,
    color:"#666"
  },

  card:{
    width:"85%",
    backgroundColor:"white",
    borderRadius:12,
    padding:20,
    elevation:4
  },

  loginTitle:{
    fontSize:22,
    fontWeight:"bold",
    textAlign:"center",
    marginBottom:20
  },

  label:{
    marginTop:10,
    marginBottom:5
  },

  input:{
    backgroundColor:"#f2f2f2",
    padding:12,
    borderRadius:8
  },

  button:{
    backgroundColor:"#2563eb",
    marginTop:20,
    padding:15,
    borderRadius:8,
    alignItems:"center"
  },

  buttonText:{
    color:"white",
    fontWeight:"bold"
  },

  register:{
    marginTop:20,
    textAlign:"center"
  },

  link:{
    color:"#2563eb",
    fontWeight:"bold"
  }
});