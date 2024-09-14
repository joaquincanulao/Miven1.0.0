importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js');

// Inicializar Firebase en el Service Worker
firebase.initializeApp({
    vapidKey: 'BOV3uao1z47YpCi69vF5IMWazjO2ciGDGuLi_7DRcvKi4WinbLI2Hv2hScOCJtfiTpdQ9Yu6bK9n-fRTXN5S5Gc',
    firebaseConfig : {
        apiKey: "AIzaSyC7SViDJ3MAfnpzls1znWTVYTvO6S5K1ys",
        authDomain: "miven-c5f93.firebaseapp.com",
        projectId: "miven-c5f93",
        storageBucket: "miven-c5f93.appspot.com",
        messagingSenderId: "46504601832",
        appId: "1:46504601832:web:ecc2f1c0f13346da7c415d",
      } 
});

// Obtener instancia de Firebase Messaging
const messaging = firebase.messaging();

// Manejar notificaciones en segundo plano
messaging.onBackgroundMessage(function(payload) {
  console.log('Mensaje en segundo plano recibido ', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/firebase-logo.png', // Puedes usar el icono que prefieras
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});