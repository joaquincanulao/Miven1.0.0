import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getMessaging, getToken } from "firebase/messaging";
import { environment } from '../../environments/environment'; // Asegúrate de tener la clave VAPID en el archivo de entorno.

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = '';
  password: string = '';
  errorMessage: string = '';  // Variable para almacenar el mensaje de error

  constructor(
    private authService: AuthService,
    private afAuth: AngularFireAuth, // Servicio para autenticación
    private firestore: AngularFirestore // Servicio para interactuar con Firestore
  ) {}

  async onLogin() {
    try {
      // Iniciar sesión con las credenciales
      await this.authService.loginUser(this.email, this.password);
      console.log('Inicio de sesión exitoso');
      
      // Obtener el usuario autenticado
      const user = await this.afAuth.currentUser;

      if (user) {
        // Llamar a la función para obtener y almacenar el token FCM
        this.saveFcmToken(user.uid);
      }
    } catch (error) {
      console.error('Error al iniciar sesión: ', error);
      this.errorMessage = this.getErrorMessage(error);  // Manejo del mensaje de error
    }
  }

  getErrorMessage(error: any): string {
    switch (error.code) {
      case 'auth/invalid-credential':
        return 'Las credenciales proporcionadas no son válidas. Por favor, verifica tu correo electrónico y contraseña.';
      case 'auth/user-not-found':
        return 'Usuario no encontrado. Por favor, registra una nueva cuenta.';
      case 'auth/wrong-password':
        return 'Contraseña incorrecta. Por favor, intenta de nuevo.';
      default:
        return 'Ha ocurrido un error desconocido. Por favor, intenta de nuevo más tarde.';
    }
  }

  // Función para obtener el token FCM y guardarlo en Firestore
  async saveFcmToken(userId: string) {
    try {
      const messaging = getMessaging();
      const currentToken = await getToken(messaging, { vapidKey: environment.vapidKey });

      if (currentToken) {
        // Guardar el token FCM en Firestore bajo el documento del usuario
        const userRef = this.firestore.collection('usuarios').doc(userId);
        await userRef.update({ fcmToken: currentToken });
        console.log('Token FCM guardado en Firestore');
      } else {
        console.log('No token available');
      }
    } catch (err) {
      console.error('Error obteniendo el token FCM: ', err);
    }
  }
}





