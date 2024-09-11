import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  constructor(private firestore: AngularFirestore) {}

  // Método para agregar un ítem al inventario de un usuario específico
  addItemToInventory(userId: string, item: any) {
    return this.firestore.collection('usuarios').doc(userId).collection('inventario').add(item);
  }

  // Método para obtener todos los ítems del inventario de un usuario
  getUserInventory(userId: string) {
    return this.firestore.collection('usuarios').doc(userId).collection('inventario').valueChanges();
  }
}
