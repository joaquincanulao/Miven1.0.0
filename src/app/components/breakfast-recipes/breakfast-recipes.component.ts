import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../../services/recipe.service';
import { InventoryService } from '../../services/inventory.service'; // Servicio del inventario
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
@Component({
  selector: 'app-breakfast-recipes',
  templateUrl: './breakfast-recipes.component.html',
  styleUrls: ['./breakfast-recipes.component.scss']
})
export class BreakfastRecipesComponent implements OnInit {
  breakfastRecipes: any[] = [];
  isModalOpen = false;
  selectedRecipe: any | null = null;
  userId: string | null = null;
  availableIngredients: any[] = []; // Para almacenar los ingredientes con su disponibilidad
  newComment = '';
  newRating = 1;
  favorites: any[] = []; // Almacenar las recetas favoritas del usuario

  constructor(
    private recipeService: RecipeService, 
    private inventoryService: InventoryService,
    private auth: AngularFireAuth,
    private firestore: AngularFirestore // Servicio de Firestore
  ) {}

  ngOnInit(): void {
    this.auth.user.subscribe(user => {
      if (user) {
        this.userId = user.uid;
        this.loadFavorites(); // Cargar favoritos existentes
      }
    });
    this.loadBreakfastRecipes();
  }

  // Método para cargar recetas de desayuno
  loadBreakfastRecipes() {
    this.recipeService.getRecipesByCategory('desayuno').subscribe(recipes => {
      this.breakfastRecipes = recipes;
    });
  }

  // Abrir modal y cargar los ingredientes y su disponibilidad en el inventario
  openRecipeModal(recipe: any) {
    this.selectedRecipe = recipe;
    this.checkIngredientsAvailability(recipe.ingredientes);
    this.recipeService.getRecipeCommentsWithUser(recipe.id).subscribe((comments: any[]) => {
    this.selectedRecipe.comentarios = comments;
    this.isModalOpen = true;});
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedRecipe = null;
  }

  // Función para verificar los ingredientes disponibles en el inventario
  checkIngredientsAvailability(recipeIngredients: string[]) {
    if (this.userId) {
      this.inventoryService.getInventory(this.userId).subscribe(inventory => {
        this.availableIngredients = recipeIngredients.map(ingredient => {
          return {
            name: ingredient,
            inInventory: inventory.some(item => item.nombre.toLowerCase() === ingredient.toLowerCase())
          };
        });
      });
    }
  }

  // Función para enviar comentario y calificación
  submitComment() {
    if (this.selectedRecipe && this.userId && this.newComment.trim()) {
      this.recipeService.addCommentWithRating(
        this.selectedRecipe.id, 
        this.userId, 
        this.newRating, 
        this.newComment
      ).then(() => {
        console.log('Comentario y calificación enviados');
        this.newComment = '';
        this.newRating = 1;
        this.closeModal();
      }).catch(error => {
        console.error('Error al enviar el comentario:', error);
      });
    } else {
      console.error('Faltan datos para enviar el comentario o el usuario no está autenticado');
    }
  }

  // Método para eliminar una receta
  deleteRecipe(recipeId: string) {
    if (confirm('¿Estás seguro de que deseas eliminar esta receta?')) {
      this.recipeService.deleteRecipe(recipeId).then(() => {
        console.log('Receta eliminada con éxito');
        this.loadBreakfastRecipes();
      }).catch(error => {
        console.error('Error al eliminar la receta:', error);
      });
    }
  }
// Método para cargar las recetas que ya están en favoritos
loadFavorites() {
  if (!this.userId) return;

  this.firestore
    .collection('usuarios')
    .doc(this.userId)
    .collection('favoritos')
    .valueChanges()
    .subscribe(favorites => {
      this.favorites = favorites;
    });
}

   // Método para agregar una receta a favoritos
   addToFavorites(recipeId: string) {
    if (!this.userId) {
      console.error('El ID del usuario no está disponible');
      return;
    }

    // Encontrar la receta seleccionada
    const favoriteRecipe = this.breakfastRecipes.find(recipe => recipe.id === recipeId);
    if (!favoriteRecipe) {
      console.error('No se encontró la receta seleccionada');
      return;
    }

    // Verificar si la receta ya está en favoritos
    const alreadyFavorited = this.favorites.some(fav => fav.id === recipeId);
    if (alreadyFavorited) {
      console.log('Esta receta ya está en favoritos');
      return;
    }

    // Guardar la receta favorita en Firestore
    this.firestore
      .collection('usuarios')
      .doc(this.userId)
      .collection('favoritos')
      .doc(recipeId)
      .set(favoriteRecipe)
      .then(() => {
        console.log('Receta agregada a favoritos');
      })
      .catch(error => {
        console.error('Error al agregar receta a favoritos:', error);
      });
  }

  // Método para eliminar una receta de los favoritos
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
      })
      .catch(error => {
        console.error('Error al eliminar receta de favoritos:', error);
      });
  }
}


