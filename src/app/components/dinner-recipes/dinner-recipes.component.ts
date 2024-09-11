import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../../services/recipe.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-dinner-recipes',
  templateUrl: './dinner-recipes.component.html',
  styleUrls: ['./dinner-recipes.component.scss']
})
export class DinnerRecipesComponent implements OnInit {
  dinnerRecipes: any[] = [];
  isModalOpen = false;
  selectedRecipe: any | null = null;
  userId: string | null = null;


  constructor(private recipeService: RecipeService, private auth: AngularFireAuth) {}

  ngOnInit(): void {
    this.auth.user.subscribe(user => {
      if (user) {
        this.userId = user.uid; // Obtener el UID del usuario actual
      }
    });
    this.loadDinnerRecipes();
  }

  // Método para cargar recetas de almuerzo
  loadDinnerRecipes() {
    this.recipeService.getRecipesByCategory('cena').subscribe(recipes => {
      this.dinnerRecipes = recipes;
    });
  }
  openRecipeModal(recipe: any) {
    this.selectedRecipe = recipe;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedRecipe = null;
  }
  // Método para eliminar una receta
  deleteRecipe(recipeId: string) {
    if (confirm('¿Estás seguro de que deseas eliminar esta receta?')) {
      this.recipeService.deleteRecipe(recipeId).then(() => {
        console.log('Receta eliminada con éxito');
        this.loadDinnerRecipes(); // Recargar la lista de recetas
      }).catch(error => {
        console.error('Error al eliminar la receta:', error);
      });
    }
  }
}

