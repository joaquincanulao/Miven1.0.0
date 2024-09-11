import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';  // Importar NavController
import { FirebaseMessaging } from '@capacitor-firebase/messaging';
import { PushNotifications } from '@capacitor/push-notifications';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages: any = [
    { title: 'Inicio', url: '/home', icon: 'Home' },
    { title: 'Inventario', url: '/inventory', icon: 'clipboard' },
    { title: 'Favorites', url: '/favorites', icon: 'heart' },
    { title: 'Recetas', icon: 'restaurant',
      items: [
        {title: 'Desayuno', url: '/breakfast-recipes', icon: 'restaurant'},
        {title: 'Almuerzo', url: '/lunch-recipes', icon: 'restaurant'},
        {title: 'Cena', url: '/dinner-recipes', icon: 'restaurant'},
        {title: 'Postres', url: '/dessert-recipes', icon: 'restaurant'},
        {title: 'Agregar recetas', url: '/add-recipe', icon: 'add'},
      ]
     },
    { title: 'Cerrar sesion', url: '/login', icon: 'close' },
    ];
  constructor(private navCtrl: NavController) {
    this.initializePushNotifications();
  }  // Inyectar NavController

    navigateToAlmuerzo() {
      this.navCtrl.navigateForward('/almuerzo');  // Navegar a la página de Almuerzo
    }
    navigateToCena() {
      this.navCtrl.navigateForward('/cena');  // Navegar a la página de Cena
    }
    navigateToDesayunos() {
      this.navCtrl.navigateForward('/desayunos');  // Navegar a la página de Desayunos
    }
    navigateToPostres() {
      this.navCtrl.navigateForward('/postres');  // Navegar a la página de Desayunos
    }
    async initializePushNotifications() {
      const permission = await FirebaseMessaging.requestPermissions();
      if (permission.receive === 'granted') {
        // Registrarse para recibir notificaciones push
        const token = await FirebaseMessaging.getToken();
        console.log('Token FCM:', token);
      } else {
        console.error('Permisos para notificaciones no concedidos');
      }
    }

    requestNotificationPermission() {
      PushNotifications.requestPermissions().then(permission => {
        if (permission.receive === 'granted') {
          console.log('Permisos de notificación concedidos');
          // Aquí puedes registrar notificaciones o suscribirte a ellas
        } else {
          console.log('Permisos de notificación denegados');
        }
      });
    }
  
    // Llama a esta función desde un botón o después de login
    onLogin() {
      this.requestNotificationPermission();
    }
  }

 

