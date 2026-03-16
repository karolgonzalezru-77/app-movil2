import { MaterialCommunityIcons } from '@expo/vector-icons'; // Viene incluido en Expo
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header - Título del App */}
        <View style={styles.header}>
          <View style={styles.brandContainer}>
             <MaterialCommunityIcons name="pill" size={28} color="#0061FF" />
             <Text style={styles.brandName}>MediCare+</Text>
          </View>
          <View style={styles.headerIcons}>
            <MaterialCommunityIcons name="account-circle-outline" size={24} color="#333" />
            <MaterialCommunityIcons name="logout" size={24} color="#D32F2F" style={{marginLeft: 15}} />
          </View>
        </View>

        {/* Tab Selector */}
        <View style={styles.tabContainer}>
          <TouchableOpacity style={[styles.tab, styles.activeTab]}>
            <MaterialCommunityIcons name="pill" size={18} color="#000" />
            <Text style={styles.tabTextActive}>Mis Medicamentos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <MaterialCommunityIcons name="account-group-outline" size={18} color="#666" />
            <Text style={styles.tabText}>Cuidador</Text>
          </TouchableOpacity>
        </View>

        {/* Banner de Recordatorios */}
        <View style={styles.alertBanner}>
          <MaterialCommunityIcons name="bell-outline" size={24} color="#0061FF" />
          <View style={styles.alertTextContainer}>
            <Text style={styles.alertTitle}>Recordatorios Activos</Text>
            <Text style={styles.alertSubtitle}>Recibirás alertas cuando sea hora de tomar tus medicamentos</Text>
          </View>
        </View>

        {/* Botón Agregar */}
        <TouchableOpacity style={styles.addButton}>
          <MaterialCommunityIcons name="plus" size={24} color="#FFF" />
          <Text style={styles.addButtonText}>Agregar Medicamento</Text>
        </TouchableOpacity>

        {/* Sección Listado */}
        <Text style={styles.sectionTitle}>Medicamentos de Hoy (2)</Text>

        {/* Card de Medicamento */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.medName}>Losartán</Text>
              <Text style={styles.medDetails}>50mg - 1 tableta</Text>
              <View style={styles.timeRow}>
                <MaterialCommunityIcons name="clock-outline" size={16} color="#666" />
                <Text style={styles.timeText}>08:00  •  Diaria</Text>
              </View>
            </View>
            <MaterialCommunityIcons name="bell" size={28} color="#0061FF" />
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.confirmButton}>
              <Text style={styles.confirmButtonText}>✓ Confirmar Toma</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.skipButton}>
              <Text style={styles.skipButtonText}>Omitir</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F7FF' },
  scrollContent: { padding: 20 },
  
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  brandContainer: { flexDirection: 'row', alignItems: 'center' },
  brandName: { fontSize: 22, fontWeight: 'bold', marginLeft: 8 },
  headerIcons: { flexDirection: 'row' },

  tabContainer: { flexDirection: 'row', backgroundColor: '#E0E0E0', borderRadius: 12, padding: 5, marginBottom: 20 },
  tab: { flex: 1, flexDirection: 'row', paddingVertical: 10, justifyContent: 'center', alignItems: 'center', borderRadius: 10 },
  activeTab: { backgroundColor: '#FFF', elevation: 2 },
  tabTextActive: { fontWeight: 'bold', marginLeft: 5 },
  tabText: { color: '#666', marginLeft: 5 },

  alertBanner: { 
    flexDirection: 'row', backgroundColor: '#E3F2FD', padding: 15, 
    borderRadius: 12, borderWidth: 1, borderColor: '#BBDEFB', marginBottom: 20 
  },
  alertTextContainer: { marginLeft: 10 },
  alertTitle: { fontWeight: 'bold', color: '#000' },
  alertSubtitle: { color: '#555', fontSize: 12 },

  addButton: { 
    backgroundColor: '#1A73E8', flexDirection: 'row', justifyContent: 'center', 
    alignItems: 'center', padding: 15, borderRadius: 12, marginBottom: 25 
  },
  addButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16, marginLeft: 5 },

  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },

  card: { backgroundColor: '#FFF', borderRadius: 15, padding: 20, elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  medName: { fontSize: 20, fontWeight: 'bold' },
  medDetails: { color: '#666', marginVertical: 4 },
  timeRow: { flexDirection: 'row', alignItems: 'center' },
  timeText: { color: '#666', marginLeft: 5 },

  actionButtons: { flexDirection: 'row', gap: 10 },
  confirmButton: { backgroundColor: '#00A859', flex: 3, padding: 15, borderRadius: 10, alignItems: 'center' },
  confirmButtonText: { color: '#FFF', fontWeight: 'bold' },
  skipButton: { flex: 1, padding: 15, borderRadius: 10, borderWidth: 1, borderColor: '#DDD', alignItems: 'center' },
  skipButtonText: { color: '#333' },
});