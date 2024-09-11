import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http'; // Para hacer solicitudes HTTP

interface InventoryItem {
  nombre: string;
  cantidad: number;
  fechaVencimiento: string; // Guardaremos la fecha como un string para simplificar
  // Puedes agregar más campos aquí si es necesario
}

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private fcmServerKey = 'BOV3uao1z47YpCi69vF5IMWazjO2ciGDGuLi_7DRcvKi4WinbLI2Hv2hScOCJtfiTpdQ9Yu6bK9n-fRTXN5S5Gc';
  constructor(private firestore: AngularFirestore, private auth: AngularFireAuth, private http: HttpClient) {}

  // Método para obtener el inventario del usuario
  getInventory(userId: string): Observable<any[]> {
    return this.firestore
      .collection('usuarios')
      .doc(userId)
      .collection('inventario')
      .valueChanges({ idField: 'id' });
  }

  // Método para agregar un ítem al inventario del usuario
  addItemToInventory(item: InventoryItem, userId: string) {
    return this.firestore
      .collection('usuarios')
      .doc(userId)
      .collection('inventario')
      .add(item);
  }

  // Método para agregar ítem a la colección global
  addItemToGlobalCollection(item: any) {
    return this.firestore.collection('items').add(item);
  }

  // Método para obtener los ítems globales
  getGlobalItems(): Observable<any[]> {
    return this.firestore.collection('items').valueChanges({ idField: 'id' });
  }

  // Método para eliminar un ítem del inventario del usuario
  deleteItemFromInventory(itemId: string, userId: string) {
    return this.firestore
      .collection('usuarios')
      .doc(userId)
      .collection('inventario')
      .doc(itemId)
      .delete();
  }

    // Método para verificar los ítems que están próximos a vencer
    getExpiringItems(userId: string): Observable<any[]> {
      const currentDate = new Date();
      const warningDate = new Date();
      warningDate.setDate(currentDate.getDate() + 7); // Los ítems que expiran en los próximos 7 días
  
      return this.getInventory(userId).pipe(
        map(items => items.filter(item => {
          const expirationDate = new Date(item.fechaVencimiento);
          return expirationDate <= warningDate && expirationDate >= currentDate;
        }))
      );
    }
  
    // Método para notificar a los usuarios sobre los ítems por vencer
    notifyExpiringItems(userId: string, fcmToken: string) {
      this.getExpiringItems(userId).subscribe(expiringItems => {
        if (expiringItems.length > 0) {
          const body = {
            notification: {
              title: '¡Atención!',
              body: `Tienes ${expiringItems.length} ítems por vencer en tu inventario.`,
              click_action: 'FCM_PLUGIN_ACTIVITY',
              icon: 'fcm_push_icon'
            },
            to: fcmToken // El token de FCM del usuario
          };
  
          // Enviar la notificación al servidor FCM
          this.http.post('https://fcm.googleapis.com/fcm/send', body, {
            headers: {
              Authorization: `key=${this.fcmServerKey}`,
              'Content-Type': 'application/json'
            }
          }).subscribe(
            () => console.log('Notificación enviada con éxito'),
            error => console.error('Error al enviar la notificación:', error)
          );
        }
      });
    }
}
