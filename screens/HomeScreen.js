import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Notifications from "expo-notifications";
import { useEffect, useRef, useState } from "react";
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

// 🔥 FIREBASE
import { addDoc, collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { auth, db } from "../src/services/firebase";

// Configuración de comportamiento de notificaciones
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
  const [medicamentos, setMedicamentos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Mis Medicamentos");

  const isLoadingRef = useRef(false);

  useEffect(() => {
    pedirPermisos();
    cargarMedicamentos();
  }, []);

  const pedirPermisos = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permisos", "Habilita las notificaciones para poder probar el sistema.");
    }
  };

  // 🔥 NUEVA LÓGICA: NOTIFICAR AL CARGAR SI YA PASÓ LA HORA
  const verificarYNotificarPendiente = async (nombreMed, horaStr) => {
    try {
      const [h, m] = horaStr.split(":").map(Number);
      const ahora = new Date();
      const fechaMedicamento = new Date();
      fechaMedicamento.setHours(h, m, 0);

      // Si la hora del medicamento ya pasó hoy (y es de hoy)
      if (fechaMedicamento < ahora) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: `⚠️ Medicamento pendiente: ${nombreMed}`,
            body: `La hora de la toma era a las ${horaStr}. ¿Ya lo tomaste?`,
            sound: true,
            priority: 'high',
          },
          trigger: null, // Envío inmediato
        });
      }
    } catch (e) {
      console.log("Error verificando pendientes:", e);
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
        const data = doc.data();
        lista.push({ id: doc.id, ...data });
        
        // Revisar si este medicamento que acabamos de traer ya debería haber sonado
        verificarYNotificarPendiente(data.nombre, data.hora);
      });
      
      setMedicamentos(lista);
    } catch (error) {
      console.error("Error al cargar:", error);
    } finally {
      setIsInitialLoading(false);
    }
  };

  const programarAlertasPrueba = async (nombreMed) => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `⏰ Hora de tu medicamento`,
          body: `Es momento de tomar ${nombreMed}.`,
          sound: true,
        },
        trigger: { 
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: 2, 
        },
      });

      await Notifications.scheduleNotificationAsync({
        content: {
          title: `⚠️ ¡Alerta de incumplimiento!`,
          body: `No has confirmado la toma de ${nombreMed}. Por favor, regístrala ahora.`,
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: { 
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: 12, 
        }, 
      });
    } catch (e) {
      console.log("Error al programar:", e);
    }
  };

  const confirmarToma = async (id) => {
    await Notifications.cancelAllScheduledNotificationsAsync();
    Alert.alert("¡Excelente!", "Toma registrada. Alerta de incumplimiento cancelada.");
  };

  const eliminarMedicamento = (id) => {
    Alert.alert(
      "Omitir toma",
      "¿Deseas eliminar este recordatorio?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Omitir",
          style: "destructive",
          onPress: async () => {
            try {
              const user = auth.currentUser;
              if (!user) return;
              setMedicamentos(prev => prev.filter(item => item.id !== id));
              await deleteDoc(doc(db, "usuarios", user.uid, "medicamentos", id));
              await Notifications.cancelAllScheduledNotificationsAsync();
            } catch (error) {
              console.error("Error al eliminar:", error);
            }
          }
        }
      ]
    );
  };

  const agregarMedicamento = async () => {
    if (!nombre.trim() || !hora.trim()) {
      Alert.alert("Error", "Llena los campos");
      return;
    }

    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No user");

      const nuevoMed = {
        nombre: nombre.trim(),
        hora: hora.trim(),
        createdAt: new Date().getTime()
      };

      const idTemporal = Date.now().toString();
      setMedicamentos(prev => [{ id: idTemporal, ...nuevoMed }, ...prev]);

      programarAlertasPrueba(nuevoMed.nombre);

      setNombre("");
      setHora("");
      setLoading(false);

      addDoc(collection(db, "usuarios", user.uid, "medicamentos"), nuevoMed)
        .then((docRef) => console.log("Sincronizado:", docRef.id))
        .catch(err => console.log("Error sincronización:", err));

    } catch (error) {
      setLoading(false);
      Alert.alert("Error", "No se pudo procesar");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navBar}>
        <View style={styles.brandGroup}>
          <View style={styles.logoCircle}>
            <MaterialCommunityIcons name="pill" size={22} color="#FFF" />
          </View>
          <View>
            <Text style={styles.navBrandName}>MediCare+</Text>
            <Text style={styles.navSubName}>Mis Medicamentos</Text>
          </View>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconCircle}>
            <MaterialCommunityIcons name="account-outline" size={22} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconCircle} onPress={() => navigation.replace("Login")}>
            <MaterialCommunityIcons name="logout" size={20} color="#D32F2F" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.tabContainer}>
          {["Mis Medicamentos", "Cuidador", "Institución"].map((tab) => (
            <TouchableOpacity 
              key={tab} 
              style={[styles.tabItem, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.infoBanner}>
          <MaterialCommunityIcons name="sync" size={24} color="#2962FF" />
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={styles.bannerTitle}>Sincronización Inteligente</Text>
            <Text style={styles.bannerSubtitle}>Revisamos tus pendientes automáticamente al iniciar sesión.</Text>
          </View>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Nuevo Registro</Text>
          <TextInput
            placeholder="Medicamento (ej. Losartán)"
            value={nombre}
            onChangeText={setNombre}
            style={styles.input}
          />
          <TextInput
            placeholder="Hora (ej. 08:30)"
            value={hora}
            onChangeText={setHora}
            style={styles.input}
          />
          <TouchableOpacity 
            style={[styles.addButton, loading && { opacity: 0.7 }]} 
            onPress={agregarMedicamento}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#FFF" /> : (
              <View style={styles.row}>
                <MaterialCommunityIcons name="rocket-launch" size={20} color="#FFF" />
                <Text style={styles.addButtonText}>Agregar y Probar Ya</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <Text style={styles.listHeader}>Medicamentos de Hoy ({medicamentos.length})</Text>

        {isInitialLoading ? (
          <ActivityIndicator size="large" color="#0061FF" style={{ marginTop: 20 }} />
        ) : (
          medicamentos.map((med) => (
            <View key={med.id} style={styles.medCard}>
              <View style={styles.medCardTop}>
                <View>
                  <Text style={styles.medName}>{med.nombre}</Text>
                  <Text style={styles.medDose}>50mg - 1 tableta</Text>
                  <View style={styles.timeRow}>
                    <MaterialCommunityIcons name="clock-outline" size={14} color="#666" />
                    <Text style={styles.timeText}>{med.hora}  •  Diaria</Text>
                  </View>
                </View>
                <MaterialCommunityIcons name="bell-ring-outline" size={26} color="#2962FF" />
              </View>
              
              <View style={styles.cardActions}>
                <TouchableOpacity style={styles.confirmBtn} onPress={() => confirmarToma(med.id)}>
                  <Text style={styles.confirmBtnText}>✓ Confirmar Toma</Text>
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
  navBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10, backgroundColor: '#FFF', paddingBottom: 10 },
  brandGroup: { flexDirection: 'row', alignItems: 'center' },
  logoCircle: { width: 38, height: 38, borderRadius: 10, backgroundColor: '#2962FF', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  navBrandName: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1A' },
  navSubName: { fontSize: 12, color: '#666' },
  headerIcons: { flexDirection: 'row' },
  iconCircle: { marginLeft: 10, padding: 5 },
  scrollContent: { padding: 20 },
  tabContainer: { flexDirection: 'row', backgroundColor: '#F0F2F5', borderRadius: 12, padding: 5, marginBottom: 20 },
  tabItem: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
  tabActive: { backgroundColor: '#FFF', elevation: 2 },
  tabText: { fontSize: 13, color: '#666', fontWeight: '500' },
  tabTextActive: { color: '#000', fontWeight: 'bold' },
  infoBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E3F2FD', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#BBDEFB', marginBottom: 20 },
  bannerTitle: { fontWeight: 'bold', color: '#0D47A1', fontSize: 14 },
  bannerSubtitle: { fontSize: 11, color: '#1976D2', marginTop: 2 },
  formCard: { backgroundColor: '#FFF', padding: 18, borderRadius: 15, marginBottom: 25, elevation: 4 },
  formTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 15, color: '#333' },
  input: { backgroundColor: '#F5F7FA', padding: 12, borderRadius: 10, marginBottom: 10, borderWidth: 1, borderColor: '#EEE' },
  addButton: { backgroundColor: '#2962FF', padding: 14, borderRadius: 10, alignItems: 'center' },
  addButtonText: { color: '#FFF', fontWeight: 'bold', marginLeft: 5 },
  row: { flexDirection: 'row', alignItems: 'center' },
  listHeader: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#1A1A1A' },
  medCard: { backgroundColor: '#FFF', borderRadius: 15, padding: 20, marginBottom: 15, elevation: 3 },
  medCardTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  medName: { fontSize: 20, fontWeight: 'bold', color: '#1A1A1A' },
  medDose: { fontSize: 14, color: '#666', marginVertical: 3 },
  timeRow: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  timeText: { fontSize: 13, color: '#666', marginLeft: 5 },
  cardActions: { flexDirection: 'row', gap: 10 },
  confirmBtn: { flex: 3, backgroundColor: '#00C853', padding: 12, borderRadius: 10, alignItems: 'center' },
  confirmBtnText: { color: '#FFF', fontWeight: 'bold' },
  skipBtn: { flex: 1, borderWidth: 1, borderColor: '#DDD', padding: 12, borderRadius: 10, alignItems: 'center' },
  skipBtnText: { color: '#666', fontWeight: '500' }
});