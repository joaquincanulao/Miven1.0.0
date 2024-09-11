import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = '';
  password: string = '';
  errorMessage: string = '';  // Variable para almacenar el mensaje de error

  constructor(private authService: AuthService) {}

  async onLogin() {
    try {
      await this.authService.loginUser(this.email, this.password);
      console.log('Inicio de sesión exitoso');
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
}

