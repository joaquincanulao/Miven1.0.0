import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  email: string = ''; // Asignar un valor inicial
  password: string = ''; // Asignar un valor inicial
  nombre: string = ''; // Definir la propiedad 'nombre'

  constructor(private authService: AuthService) {}

  onRegister() {
    this.authService.registerUser(this.email, this.password, this.nombre); // Añadir el nombre como tercer argumento
  }
}
