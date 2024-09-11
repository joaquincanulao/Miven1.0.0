import { Component } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';
import { RecipeService } from '../../services/recipe.service'; // Servicio de recetas
import { InventoryService } from '../../services/inventory.service'; // Servicio de inventario
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-add-recipe',
  templateUrl: './add-recipe.component.html',
  styleUrls: ['./add-recipe.component.scss']
})
export class AddRecipeComponent {
  titulo: string = '';
  imageUrl: string | null = null;
  descripcion: string = '';
  categoria: string = 'desayuno';
  ingredientes: string[] = [];
  ingrediente: string = '';
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  globalItems: any[] = []; // Aquí se almacenarán los ítems predeterminados

  constructor(
    private recipeService: RecipeService,
    private inventoryService: InventoryService, // Inyectar el servicio de inventario
    private auth: AngularFireAuth,
    private storage: AngularFireStorage
  ) {}

  ngOnInit() {
    this.loadGlobalItems(); // Cargar los ítems predeterminados al iniciar el componente
  }

  // Método para cargar los ítems globales desde el servicio de inventario
  loadGlobalItems() {
    this.inventoryService.getGlobalItems().subscribe(items => {
      this.globalItems = items;
    });
  }

  // Método para agregar un nuevo ingrediente a la lista
  addIngredient() {
    if (this.ingrediente.trim()) {
      this.ingredientes.push(this.ingrediente.trim());
      this.ingrediente = '';
    }
  }

  // Método para agregar la receta a Firestore, incluyendo la subida de imagen
  addRecipe() {
    if (this.selectedFile) {
      const filePath = `recipes/${new Date().getTime()}_${this.selectedFile.name}`;
      const fileRef = this.storage.ref(filePath);
      const uploadTask = this.storage.upload(filePath, this.selectedFile);

      uploadTask.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(url => {
            this.imageUrl = url; // Asignar la URL de la imagen
            this.saveRecipe(); // Guardar la receta en la base de datos
          });
        })
      ).subscribe(
        () => {},
        (error) => console.error('Error al subir la imagen:', error)
      );
    } else {
      this.saveRecipe(); // Guardar la receta sin imagen si no se seleccionó ninguna
    }
  }

  // Método para guardar la receta en Firestore
  saveRecipe() {
    this.auth.user.subscribe(user => {
      if (user) {
        const recipe = {
          titulo: this.titulo,
          imageUrl: this.imageUrl,
          descripcion: this.descripcion,
          categoria: this.categoria,
          ingredientes: this.ingredientes,
          creadorId: user.uid
        };
        this.recipeService.addRecipe(recipe).then(() => {
          this.resetForm();
        }).catch(error => {
          console.error('Error al agregar la receta:', error);
        });
      }
    });
  }

  // Método para reiniciar el formulario
  resetForm() {
    this.titulo = '';
    this.descripcion = '';
    this.categoria = 'desayuno';
    this.ingredientes = [];
    this.imageUrl = null;
    this.imagePreview = null;
    this.selectedFile = null;
  }

  // Manejar la selección de archivos para subir
  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFile = file;

      // Mostrar vista previa de la imagen seleccionada
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }
}

