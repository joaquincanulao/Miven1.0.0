import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../services/inventory.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {
  inventoryItems: any[] = [];
  expiringItems: any[] = []; // Lista de ítems por vencer
  userId: string | null = null;

  constructor(private inventoryService: InventoryService, private auth: AngularFireAuth) {}

  ngOnInit(): void {
    this.auth.user.subscribe(user => {
      if (user) {
        this.userId = user.uid;
        this.loadInventory();
        }
    });

    this.requestNotificationPermission(); // Solicitar permiso para notificaciones
  }

  // Método para cargar el inventario del usuario
  loadInventory() {
    if (this.userId) {
      this.inventoryService.getInventory(this.userId).subscribe(items => {
        this.inventoryItems = items;
      });
    }
  }

  // Solicitar permiso de notificación al usuario
  requestNotificationPermission() {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          console.log('Permiso para notificaciones otorgado');
        } else {
          console.log('Notificaciones bloqueadas');
        }
      });
    }
  }

  // Enviar notificación para ítems próximos a vencer
  sendNotification(itemName: string, expirationDate: string) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Producto por vencer', {
        body: `El ítem ${itemName} vence el ${expirationDate}.`,
        icon: 'assets/icon/alert.png' // Cambia por el ícono que prefieras
      });
    }
  }

  // Método para eliminar un ítem del inventario
  deleteItem(itemId: string) {
    if (this.userId && confirm('¿Estás seguro de que deseas eliminar este ítem del inventario?')) {
      this.inventoryService.deleteItemFromInventory(itemId, this.userId).then(() => {
        console.log('Ítem eliminado con éxito');
        this.loadInventory(); // Recargar el inventario después de eliminar un ítem
      }).catch(error => {
        console.error('Error al eliminar el ítem:', error);
      });
    }
  }
}

