import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private auth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router
  ) {}

  // Método para registrar usuarios y crear su inventario
  registerUser(email: string, password: string, nombre: string) {
    this.auth.createUserWithEmailAndPassword(email, password).then(userCredential => {
      this.router.navigate(['./login']);
      const user = userCredential.user;
      if (user) {

        // Crear un documento para el usuario
        this.firestore.collection('usuarios').doc(user.uid).set({
          nombre: nombre,
          correo_electronico: email,
          fecha_registro: new Date()
        }).then(() => {
          // Crear una subcolección de inventario para el usuario recién registrado
          const inventarioRef = this.firestore.collection('usuarios').doc(user.uid).collection('inventario');
          
          // Inicializar el inventario con algunos productos predeterminados o vacío
          inventarioRef.add({
            nombre_producto: 'Producto Ejemplo',
            cantidad: 0,
            unidad_medida: 'unidades',
            fecha_caducidad: new Date(),
            categoria: 'General'
          });
        });
      }
    }).catch(error => {
      console.error('Error en el registro:', error);
    });
  }

  // Método para iniciar sesión de usuario
  loginUser(email: string, password: string) {
    this.router.navigate(['./home']);
    return this.auth.signInWithEmailAndPassword(email, password);
  }
  

  // Método para cerrar sesión
  logoutUser() {
    return this.auth.signOut().then(() => {
      this.router.navigate(['/login']);
    });
  }

 // Método para obtener el usuario autenticado actual
 getCurrentUser() {
  return this.auth.currentUser;
}

}