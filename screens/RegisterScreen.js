import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

// 🔥 Firebase
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../src/services/firebase";

export default function RegisterScreen({ navigation }) {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [tipoUsuario, setTipoUsuario] = useState("paciente"); // Estado para el diseño nuevo

  const handleRegister = async () => {
    console.log("CLICK REGISTER 🚀");

    if (nombre === "" || correo === "" || password === "") {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        correo,
        password
      );

      // Guardar nombre del usuario
      await updateProfile(userCredential.user, {
        displayName: nombre
      });

      Alert.alert("Éxito", "Cuenta creada correctamente");
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
      style={{ flex: 1, backgroundColor: '#FFF' }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        
        <Text style={styles.headerTitle}>Tipo de Usuario</Text>
        <Text style={styles.headerSubtitle}>Selecciona cómo usarás la aplicación</Text>

        {/* Tarjetas de Selección de Usuario */}
        <View style={styles.cardContainer}>
          {[
            { id: 'paciente', title: 'Paciente / Adulto Mayor', desc: 'Gestiona tus medicamentos', icon: 'account-outline', color: '#2962FF' },
            { id: 'cuidador', title: 'Cuidador / Familiar', desc: 'Supervisa a tus seres queridos', icon: 'account-group-outline', color: '#00C853' },
            { id: 'institucion', title: 'Institución de Salud', desc: 'EPS, hospital o ancianato', icon: 'office-building-outline', color: '#9C27B0' }
          ].map((item) => (
            <TouchableOpacity 
              key={item.id}
              style={[styles.typeCard, tipoUsuario === item.id && styles.activeCard]} 
              onPress={() => setTipoUsuario(item.id)}
            >
              <View style={styles.radioOuter}>
                {tipoUsuario === item.id && <View style={styles.radioInner} />}
              </View>
              <MaterialCommunityIcons name={item.icon} size={26} color={item.color} style={styles.cardIcon} />
              <View style={styles.cardTextGroup}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardDesc}>{item.desc}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Campos de Texto */}
        <View style={styles.formGroup}>
          <Text style={styles.inputLabel}>Nombre Completo</Text>
          <TextInput
            placeholder="Ej: María González"
            placeholderTextColor="#999"
            style={styles.input}
            value={nombre}
            onChangeText={setNombre}
          />

          <Text style={styles.inputLabel}>Correo Electrónico</Text>
          <TextInput
            placeholder="ejemplo@correo.com"
            placeholderTextColor="#999"
            style={styles.input}
            value={correo}
            onChangeText={setCorreo}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.inputLabel}>Contraseña</Text>
          <TextInput
            placeholder="Mínimo 6 caracteres"
            placeholderTextColor="#999"
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Crear Cuenta</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.loginText}>
            ¿Ya tienes cuenta? <Text style={styles.link}>Inicia sesión</Text>
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 25,
    backgroundColor: '#FFF',
    paddingTop: 60,
    paddingBottom: 40
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 5
  },
  headerSubtitle: {
    fontSize: 15,
    color: "#666",
    marginBottom: 25
  },
  cardContainer: {
    marginBottom: 20
  },
  typeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#EEE',
    borderRadius: 15,
    padding: 15,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  activeCard: {
    borderColor: '#2563eb',
    backgroundColor: '#F8F9FF',
    borderWidth: 2
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CCC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#000'
  },
  cardIcon: {
    marginRight: 12
  },
  cardTextGroup: {
    flex: 1
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000'
  },
  cardDesc: {
    fontSize: 12,
    color: '#777'
  },
  formGroup: {
    marginBottom: 10
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 8,
    marginTop: 10
  },
  input: {
    width: "100%",
    backgroundColor: "#F2F3F5",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    color: "#000",
    fontSize: 14
  },
  button: {
    backgroundColor: "#2563eb",
    padding: 16,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
    marginTop: 20,
    elevation: 3
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16
  },
  loginText: {
    marginTop: 25,
    textAlign: 'center',
    color: '#666'
  },
  link: {
    color: "#2563eb",
    fontWeight: "bold"
  }
});