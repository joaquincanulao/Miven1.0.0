import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss'],
})
export class FavoritesComponent implements OnInit {
  userId: string | null = null;
  favorites: any[] = []; // Aquí se almacenan todas las recetas favoritas
  filteredFavorites: any[] = []; // Recetas filtradas por categoría
  isModalOpen = false;
  selectedRecipe: any | null = null;
  selectedCategory = 'desayuno'; // Categoría seleccionada por defecto

  constructor(
    private auth: AngularFireAuth,
    private firestore: AngularFirestore
  ) {}

  ngOnInit() {
    this.auth.authState.subscribe(user => {
      if (user && user.uid) {
        this.userId = user.uid;
        this.loadFavorites(); // Cargar favoritos existentes
      }
    });
  }

  // Método para cargar los favoritos del usuario
  loadFavorites() {
    if (!this.userId) {
      console.error('El ID del usuario no está disponible');
      return;
    }

    this.firestore
      .collection('usuarios')
      .doc(this.userId)
      .collection('favoritos')
      .valueChanges({ idField: 'id' }) // Obtener el ID de cada receta favorita
      .subscribe((favorites: any[]) => {
        this.favorites = favorites;
        this.filterFavorites(); // Aplicar el filtro según la categoría seleccionada
      }, error => {
        console.error('Error al cargar favoritos:', error);
      });
  }

  // Método para filtrar las recetas según la categoría seleccionada
  filterFavorites() {
    this.filteredFavorites = this.favorites.filter(recipe => recipe.categoria === this.selectedCategory);
  }

  // Método para abrir el modal de detalles de la receta
  openRecipeModal(recipe: any) {
    this.selectedRecipe = recipe;
    this.isModalOpen = true;
  }

  // Método para cerrar el modal
  closeModal() {
    this.isModalOpen = false;
    this.selectedRecipe = null;
  }

  // Método para eliminar una receta de favoritos
  removeFromFavorites(recipeId: string) {
    if (!this.userId) {
      console.error('El ID del usuario no está disponible');
      return;
    }

    this.firestore
      .collection('usuarios')
      .doc(this.userId)
      .collection('favoritos')
      .doc(recipeId)
      .delete()
      .then(() => {
        console.log('Receta eliminada de favoritos');
        this.loadFavorites(); // Recargar los favoritos tras la eliminación
      })
      .catch(error => {
        console.error('Error al eliminar receta de favoritos:', error);
      });
  }
}