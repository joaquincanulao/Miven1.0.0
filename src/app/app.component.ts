import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';  // Importar NavController
import { FirebaseMessaging } from '@capacitor-firebase/messaging';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getMessaging, onMessage } from "firebase/messaging";
import { Platform } from '@ionic/angular';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  userId: string | null = null;
  public appPages: any = [
    { title: 'Inicio', url: '/home', icon: 'Home' },
    { title: 'Inventario', url: '/inventory', icon: 'clipboard' },
    { title: 'Favoritos', url: '/favorites', icon: 'heart' },
    { title: 'Recetas', icon: 'restaurant',
      items: [
        {title: 'Desayuno', url: '/breakfast-recipes', icon: 'restaurant'},
        {title: 'Almuerzo', url: '/lunch-recipes', icon: 'restaurant'},
        {title: 'Cena', url: '/dinner-recipes', icon: 'restaurant'},
        {title: 'Postres', url: '/dessert-recipes', icon: 'restaurant'},
        {title: 'Agregar recetas', url: '/add-recipe', icon: 'add'},
      ]
     },
    { title: 'Cerrar sesión', url: '/login', icon: 'close' },
  ];

  constructor(
    private navCtrl: NavController,
    private auth: AngularFireAuth, 
    private firestore: AngularFirestore,
    private platform: Platform
  ) {
    this.initializeFCM();
    this.listenToMessages();
  }

  navigateToAlmuerzo() {
    this.navCtrl.navigateForward('/almuerzo');
  }

  navigateToCena() {
    this.navCtrl.navigateForward('/cena');
  }

  navigateToDesayunos() {
    this.navCtrl.navigateForward('/desayunos');
  }

  navigateToPostres() {
    this.navCtrl.navigateForward('/postres');
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.requestNotificationPermission();

      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/firebase-messaging-sw.js')
          .then((registration) => {
            console.log('Service Worker registrado:', registration);
          }).catch((error) => {
            console.log('Error al registrar el Service Worker:', error);
          });
      }
 

    });
}


  requestNotificationPermission() {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        console.log('Permiso para notificaciones concedido');
      } else {
        console.error('Permiso para notificaciones denegado');
      }
    });
  }

  listenToMessages() {
    const messaging = getMessaging();
    onMessage(messaging, (payload) => {
      console.log('Mensaje recibido en primer plano: ', payload);
      // Aquí puedes manejar cómo se mostrarán las notificaciones en la interfaz
    });
  }




  async initializeFCM() {
    this.auth.user.subscribe(async (user) => {
      if (user) {
        this.userId = user.uid;

        const permission = await FirebaseMessaging.requestPermissions();
        if (permission.receive === 'granted') {
          const token = await FirebaseMessaging.getToken();
          console.log('FCM Token:', token);

          // Guardar el token FCM en Firestore para el usuario actual
          this.firestore.collection('usuarios').doc(this.userId).set(
            { fcmToken: token }, { merge: true }
          );

          // Escuchar notificaciones recibidas
          FirebaseMessaging.addListener('notificationReceived', (notification: any) => {
            console.log('Notificación recibida:', notification);
            // Aquí puedes implementar lógica para mostrar la notificación
          });

          // Escuchar cuando se realiza una acción en la notificación
          FirebaseMessaging.addListener('notificationActionPerformed', (notification: any) => {
            console.log('Acción de notificación:', notification);
            // Aquí puedes manejar la interacción con la notificación
          });
        } else {
          console.log('Permisos de notificación denegados');
        }
      }
    });
  }
}
