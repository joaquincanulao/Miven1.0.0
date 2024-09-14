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
  editItemCantidad: number | null = null;  // Nueva cantidad a editar
  editItemId: string | null = null;  // ID del ítem que se está editando
  isEditModalOpen = false;


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

 // Función para abrir el modal de edición y establecer el ítem que se va a editar
 startEditItem(item: any) {
  this.editItemCantidad = item.cantidad;  // Establecer la cantidad actual en el campo de edición
  this.editItemId = item.id;  // Guardar el ID del ítem
  this.isEditModalOpen = true;  // Abrir el modal
}

// Función para cerrar el modal de edición
closeEditModal() {
  this.isEditModalOpen = false;
  this.editItemCantidad = null;
  this.editItemId = null;
}

// Función para actualizar la cantidad del ítem
updateItemQuantity() {
  if (this.userId && this.editItemId && this.editItemCantidad != null) {
    this.inventoryService.updateItemQuantity(this.userId, this.editItemId, this.editItemCantidad).then(() => {
      console.log('Cantidad actualizada con éxito');
      this.closeEditModal();  // Cerrar el modal después de la actualización
    }).catch(error => {
      console.error('Error al actualizar la cantidad:', error);
    });
  }
}
}
