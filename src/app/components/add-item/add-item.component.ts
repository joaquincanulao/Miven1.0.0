import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../services/inventory.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.scss']
})
export class AddItemComponent implements OnInit {
  predefinedItems: string[] = ['Arroz', 'Leche', 'Huevos', 'Pan', 'Queso'];  // Ítems predeterminados
  availableItems: string[] = [];  // Lista de ítems que estará disponible para todos
  selectedItem: string | null = null;
  isNewItem: boolean = false;  // Para mostrar el campo de nuevo ítem si es necesario
  newItem: any = {
    nombre: '',
    cantidad: 0,
    fechaVencimiento: ''
  };
  userId: string | null = null;

  constructor(private inventoryService: InventoryService, private auth: AngularFireAuth, private firestore: AngularFirestore) {
    this.auth.user.subscribe(user => {
      if (user) {
        this.userId = user.uid;
      }
    });
  }

  ngOnInit() {
    this.loadAvailableItems();
  }

  // Cargar los ítems disponibles desde Firestore
  loadAvailableItems() {
    this.firestore.collection('items').valueChanges({ idField: 'id' }).subscribe((items: any[]) => {
      this.availableItems = [...this.predefinedItems, ...items.map(item => item.nombre)];
    });
  }

  // Función para formatear la fecha en DD-MM-YYYY
  formatFechaVencimiento(fecha: string): string {
    const date = new Date(fecha);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  }

  // Método para manejar la selección de ítems
  onItemSelected(event: any) {
    const selectedItem = event.detail.value;
    if (selectedItem === 'Otro') {
      this.isNewItem = true;
      this.newItem.nombre = '';  // Limpiar el campo si el usuario elige agregar un nuevo ítem
    } else {
      this.isNewItem = false;
      this.newItem.nombre = selectedItem;  // Asignar el ítem seleccionado
    }
  }

  // Método para agregar un ítem al inventario
  addItem() {
    if (!this.isNewItem && this.selectedItem) {
      this.newItem.nombre = this.selectedItem;  // Usar el ítem seleccionado
    }

    if (this.userId && this.newItem.nombre && this.newItem.cantidad > 0 && this.newItem.fechaVencimiento) {
      const formattedFecha = this.formatFechaVencimiento(this.newItem.fechaVencimiento); // Formatear la fecha
      
      const itemToSave = {
        nombre: this.newItem.nombre,
        cantidad: this.newItem.cantidad,
        fechaVencimiento: formattedFecha
      };

      this.inventoryService.addItemToInventory(itemToSave, this.userId).then(() => {
        // Si es un ítem nuevo, guardarlo en Firestore para que esté disponible para otros usuarios
        if (this.isNewItem) {
          this.addItemToFirestore(this.newItem.nombre);
        }
        console.log('Ítem agregado con éxito');
        this.resetForm();
      }).catch(error => {
        console.error('Error al agregar el ítem:', error);
      });
    } else {
      console.error('Todos los campos son obligatorios');
    }
  }

  // Guardar un ítem nuevo en Firestore
  addItemToFirestore(nombre: string) {
    this.firestore.collection('items').add({ nombre });
  }

  // Método para resetear el formulario
  resetForm() {
    this.newItem = { nombre: '', cantidad: 0, fechaVencimiento: '' };
    this.selectedItem = null;
    this.isNewItem = false;
  }
}