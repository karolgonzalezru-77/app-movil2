
![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)&nbsp;
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)&nbsp;
![Firebase](https://img.shields.io/badge/Firebase-ffca28?style=for-the-badge&logo=firebase&logoColor=black)&nbsp;
![Firestore](https://img.shields.io/badge/Firestore-ffca28?style=for-the-badge&logo=firebase&logoColor=black)&nbsp;
![React Navigation](https://img.shields.io/badge/React_Navigation-6C47FF?style=for-the-badge&logo=react&logoColor=white)&nbsp;
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)&nbsp;

MediCare+

Planteamiento del problema:
Muchas personas, especialmente adultos mayores y pacientes crónicos, olvidan tomar sus
medicamentos a tiempo, lo que afecta negativamente su salud y calidad de vida. Esta situación
también representa un reto para instituciones como EPS y ancianatos, que carecen de
herramientas tecnológicas para hacer seguimiento al cumplimiento de los tratamientos.
Aunque existen algunas aplicaciones de recordatorio, muchas no están adaptadas a las
necesidades locales ni a usuarios con poca experiencia tecnológica. Por ello, se hace necesario
desarrollar una aplicación accesible, intuitiva y enfocada en mejorar la adherencia a los
tratamientos médicos tanto a nivel personal como institucional.

## 🚀 Características y Stack Tecnológico

**MediCare+** es una aplicación móvil enfocada en la adherencia a tratamientos médicos, complementada con un panel web para monitoreo y gestión.

### 🧠 Funcionalidades Clave

* **Panel de Adherencia:** seguimiento de dosis (completadas, pendientes y próximas).
* **Gestión de Medicamentos:** registro con nombre, hora y frecuencia.
* **Acciones Rápidas:** confirmar, posponer u omitir dosis fácilmente.
* **Notificaciones Inteligentes:** recordatorios automáticos y alertas de retraso.
* **Estadísticas:** porcentaje de cumplimiento del tratamiento.
* **Interfaz Moderna:** diseño accesible tipo glassmorphism, claro y responsivo.

---

### 🛠️ Stack Tecnológico

**Aplicación móvil:**

* React Native (Expo)
* Firebase Authentication
* Firebase Firestore
* Expo Notifications

**Panel web (complementario):**

* Vue 3 (Composition API) + TypeScript
* Tailwind CSS + Vite
* Pinia (estado global)
* Axios (HTTP)
* Chart.js / vue-chartjs (gráficas)
* xlsx (exportación de datos)

**Backend (evolutivo):**

* Node.js + Express
* PostgreSQL

**Despliegue:**

* Frontend web: Vercel
* Backend: Render / Railway
