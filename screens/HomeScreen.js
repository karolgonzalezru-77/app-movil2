import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Notifications from "expo-notifications";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

// 🔥 FIREBASE Y API
import { addDoc, collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { validarFrecuenciaMedica } from '../src/services/apiService';
import { auth, db } from "../src/services/firebase";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function HomeScreen({ navigation }) {
  const [nombre, setNombre] = useState("");
  const [hora, setHora] = useState("");
  const [frecuencia, setFrecuencia] = useState(""); 
  const [medicamentos, setMedicamentos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Mis Medicamentos");

  useEffect(() => {
    pedirPermisos();
    cargarMedicamentos();
  }, []);

  const pedirPermisos = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permisos", "Habilita las notificaciones.");
    }
  };

  const cargarMedicamentos = async () => {
    try {
      setIsInitialLoading(true);
      const user = auth.currentUser;
      if (!user) return;
      const querySnapshot = await getDocs(collection(db, "usuarios", user.uid, "medicamentos"));
      const lista = [];
      querySnapshot.forEach((doc) => {
        lista.push({ id: doc.id, ...doc.data() });
      });
      setMedicamentos(lista);
    } catch (error) { console.error(error); } 
    finally { setIsInitialLoading(false); }
  };

  const agregarMedicamento = async () => {
    if (!nombre.trim() || !hora.trim() || !frecuencia.trim()) {
      Alert.alert("Error", "Llena todos los campos (Nombre, Hora y Frecuencia)");
      return;
    }

    setLoading(true);

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Usuario no autenticado");

      const validacion = await validarFrecuenciaMedica(nombre, frecuencia);
      Alert.alert("Recomendación Médica", validacion.mensaje);

      if (validacion.esSeguro) {
        const nuevoMed = {
          nombre: nombre.trim(),
          hora: hora.trim(),
          frecuencia: frecuencia.trim(),
          createdAt: Date.now()
        };

        // 🔥 PROGRAMAR RECORDATORIO REAL
        // Esto hará que el celular suene a la hora exacta
        await programarRecordatorio(nuevoMed.nombre, nuevoMed.hora);

        const idTemporal = Date.now().toString();
        setMedicamentos(prev => [{ id: idTemporal, ...nuevoMed }, ...prev]);

        setNombre("");
        setHora("");
        setFrecuencia("");
        setLoading(false);

        // Sincronización con medicare-db
        addDoc(collection(db, "usuarios", user.uid, "medicamentos"), nuevoMed)
          .then((docRef) => console.log("✅ Sincronizado en medicare-db:", docRef.id))
          .catch(err => console.log("❌ Error de red en Firebase:", err));

      } else {
        setLoading(false);
      }

    } catch (error) {
      setLoading(false);
      console.log("DETALLE DEL ERROR:", error.message);
      Alert.alert("Error", "No se pudo procesar: " + error.message);
    }
  };

  const eliminarMedicamento = (id) => {
    Alert.alert("Omitir toma", "¿Deseas eliminar este recordatorio?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Omitir", style: "destructive", onPress: async () => {
        const user = auth.currentUser;
        setMedicamentos(prev => prev.filter(item => item.id !== id));
        await deleteDoc(doc(db, "usuarios", user.uid, "medicamentos", id));
      }}
    ]);
  };

  const programarRecordatorio = async (nombreMed, horaMed) => {
    try {
      const [horas, minutos] = horaMed.split(':').map(Number);
      const ahora = new Date();
      const fechaObjetivo = new Date();
      
      fechaObjetivo.setHours(horas, minutos, 0, 0);

      // 🔥 CASO A: La hora ya pasó hoy
      if (fechaObjetivo < ahora) {
        console.log("⚠️ La hora ya pasó. Enviando alerta de retraso.");
        
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "⚠️ Dosis Atrasada",
            body: `La hora para tomar ${nombreMed} (${horaMed}) ya pasó. ¡Tómalo lo antes posible!`,
            sound: true,
            priority: Notifications.AndroidNotificationPriority.HIGH,
          },
          trigger: null, // Se dispara inmediatamente
        });
      } 
      // ⏰ CASO B: Es una hora futura
      else {
        const segundosHastaLaDosis = (fechaObjetivo.getTime() - ahora.getTime()) / 1000;
        
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "⏰ Recordatorio MediCare+",
            body: `Es momento de tu dosis de ${nombreMed}`,
            sound: true,
            priority: Notifications.AndroidNotificationPriority.HIGH,
          },
          trigger: { seconds: Math.floor(segundosHastaLaDosis) },
        });
        
        console.log(`Alerta futura programada en ${Math.floor(segundosHastaLaDosis)} segundos.`);
      }
    } catch (e) {
      console.log("Error en notificaciones:", e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* NavBar Original */}
      <View style={styles.navBar}>
        <View style={styles.brandGroup}>
          <View style={styles.logoCircle}><MaterialCommunityIcons name="pill" size={22} color="#FFF" /></View>
          <View>
            <Text style={styles.navBrandName}>MediCare+</Text>
            <Text style={styles.navSubName}>Mis Medicamentos</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => navigation.replace("Login")}>
          <MaterialCommunityIcons name="logout" size={24} color="#D32F2F" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Tabs Originales */}
        <View style={styles.tabContainer}>
          {["Mis Medicamentos", "Cuidador", "Institución"].map((tab) => (
            <TouchableOpacity key={tab} style={[styles.tabItem, activeTab === tab && styles.tabActive]} onPress={() => setActiveTab(tab)}>
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Banner Azul */}
        <View style={styles.infoBanner}>
          <MaterialCommunityIcons name="sync" size={24} color="#2962FF" />
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={styles.bannerTitle}>Sincronización Inteligente</Text>
            <Text style={styles.bannerSubtitle}>Revisamos tus dosis con inteligencia médica.</Text>
          </View>
        </View>

        {/* Formulario con todos los campos */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Nuevo Registro</Text>
          <TextInput placeholder="Medicamento (ej. Losartán)" placeholderTextColor="#999" value={nombre} onChangeText={setNombre} style={styles.input} />
          <TextInput placeholder="Hora (ej. 08:30)" placeholderTextColor="#999" value={hora} onChangeText={setHora} style={styles.input} />
          <TextInput placeholder="Frecuencia horas (ej. 8)" placeholderTextColor="#999" value={frecuencia} onChangeText={setFrecuencia} keyboardType="numeric" style={styles.input} />
          <TouchableOpacity style={[styles.addButton, loading && { opacity: 0.7 }]} onPress={agregarMedicamento} disabled={loading}>
            {loading ? <ActivityIndicator color="#FFF" /> : (
              <View style={styles.row}>
                <MaterialCommunityIcons name="rocket-launch" size={20} color="#FFF" />
                <Text style={styles.addButtonText}>Validar y Agregar</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <Text style={styles.listHeader}>Medicamentos de Hoy ({medicamentos.length})</Text>

        {isInitialLoading ? <ActivityIndicator size="large" color="#0061FF" /> : (
          medicamentos.map((med) => (
            <View key={med.id} style={styles.medCard}>
              <View style={styles.medCardTop}>
                <View>
                  <Text style={styles.medName}>{med.nombre}</Text>
                  <Text style={styles.timeText}>{med.hora} • Cada {med.frecuencia}h</Text>
                </View>
                <MaterialCommunityIcons name="bell-ring-outline" size={26} color="#2962FF" />
              </View>
              <View style={styles.cardActions}>
                <TouchableOpacity style={styles.confirmBtn} onPress={() => Alert.alert("¡Excelente!", "Toma confirmada.")}>
                  <Text style={styles.confirmBtnText}>✓ Confirmar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.skipBtn} onPress={() => eliminarMedicamento(med.id)}>
                  <Text style={styles.skipBtnText}>Omitir</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFF' },
  navBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: '#FFF' },
  brandGroup: { flexDirection: 'row', alignItems: 'center' },
  logoCircle: { width: 38, height: 38, borderRadius: 10, backgroundColor: '#2962FF', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  navBrandName: { fontSize: 18, fontWeight: 'bold' },
  navSubName: { fontSize: 12, color: '#666' },
  scrollContent: { padding: 20 },
  tabContainer: { flexDirection: 'row', backgroundColor: '#F0F2F5', borderRadius: 12, padding: 5, marginBottom: 20 },
  tabItem: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
  tabActive: { backgroundColor: '#FFF', elevation: 2 },
  tabText: { fontSize: 13, color: '#666', fontWeight: '500' },
  tabTextActive: { color: '#000', fontWeight: 'bold' },
  infoBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E3F2FD', padding: 15, borderRadius: 12, marginBottom: 20, borderWidth: 1, borderColor: '#BBDEFB' },
  bannerTitle: { fontWeight: 'bold', color: '#0D47A1' },
  bannerSubtitle: { fontSize: 11, color: '#1976D2' },
  formCard: { backgroundColor: '#FFF', padding: 18, borderRadius: 15, marginBottom: 25, elevation: 4 },
  formTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 15 },
  input: { backgroundColor: '#F5F7FA', padding: 12, borderRadius: 10, marginBottom: 10, borderWidth: 1, borderColor: '#EEE' },
  addButton: { backgroundColor: '#2962FF', padding: 14, borderRadius: 10, alignItems: 'center' },
  addButtonText: { color: '#FFF', fontWeight: 'bold', marginLeft: 5 },
  row: { flexDirection: 'row', alignItems: 'center' },
  listHeader: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  medCard: { backgroundColor: '#FFF', borderRadius: 15, padding: 20, marginBottom: 15, elevation: 3 },
  medCardTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  medName: { fontSize: 20, fontWeight: 'bold' },
  timeText: { fontSize: 14, color: '#666' },
  cardActions: { flexDirection: 'row', gap: 10 },
  confirmBtn: { flex: 3, backgroundColor: '#00C853', padding: 12, borderRadius: 10, alignItems: 'center' },
  confirmBtnText: { color: '#FFF', fontWeight: 'bold' },
  skipBtn: { flex: 1, borderWidth: 1, borderColor: '#DDD', padding: 12, borderRadius: 10, alignItems: 'center' },
  skipBtnText: { color: '#666' }
});