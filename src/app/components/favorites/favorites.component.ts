import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { RecipeService } from '../../services/recipe.service';
import { InventoryService } from '../../services/inventory.service';

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
  isAuthenticated: boolean = false;
  availableIngredients: any[] = [];

  constructor(
    private auth: AngularFireAuth,
    private firestore: AngularFirestore,
    private recipeService: RecipeService, 
    private inventoryService: InventoryService,
  ) {
    console.log(' en cosntruct')

  }

     ngOnInit(): void {
       this.auth.authState.subscribe(user => {
         this.isAuthenticated = !!user;
         console.log(' isAuthenticated subscribe :: ', this.isAuthenticated);
          if (this.isAuthenticated ) {
            if (user && user.uid) {
              this.userId = user.uid;
              this.filterFavorites()
            }
          }
       });
       // console.log(' isAuthenticated :: ', this.isAuthenticated);

     }
     /*
  ngOnInit() {
    this.auth.authState.subscribe(user => {
      console.log(' en subscribe');
      if (user && user.uid) {
        this.userId = user.uid;
          
      }
    });
    this.filterFavorites();
  }
  /* */

  // Método para filtrar las recetas según la categoría seleccionada
  filterFavorites() {
    console.log(' this === ', this.userId)

    if (this.userId) {   
      this.filteredFavorites = [];
      const favoritos = this.firestore.collection('usuarios').doc(this.userId).collection('favoritos'
        , ref => ref.where('category', '==', this.selectedCategory)
      );
      favoritos.get().forEach((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const datos = doc.data();
          console.log('datos  ID :: ', doc.id)
          this.firestore.collection('recetas').doc(datos['recipeId']).get().forEach(
            (rec) => {
              const d : any = rec.data();
              d.id = doc.id
              this.filteredFavorites.push(d);
              // console.log('receta :: ', d)
            }
          );
        })
        // console.log('Favoritos filtrados:', this.filteredFavorites);
        })

  }
}

  // Método para abrir el modal de detalles de la receta
  openRecipeModal(recipe: any) {
    this.selectedRecipe = recipe;
    this.checkIngredientsAvailability(recipe.ingredientes);
    this.isModalOpen = true;
  }

  // Método para cerrar el modal
  closeModal() {
    this.isModalOpen = false;
    this.selectedRecipe = null;
  }

  removeFromFavorites(recipeId: string) {
    console.log( 'recipeId :: ', recipeId)
    if (this.userId) {  
      //console.error('El ID del usuario no está disponible');
      //return;
      const favoritos = this.firestore.collection('usuarios').doc(this.userId).collection('favoritos').doc(recipeId).delete()
      this.filterFavorites()
    }
 
    /*
    this.firestore
      .collection('usuarios')
      .doc(this.userId)  
      .collection('favoritos', ref => ref.where('category', '==', this.selectedCategory))
      .get()
      .subscribe(snapshot => {
        
        if (!snapshot.empty) {
          snapshot.forEach(doc => {
            console.log('Documento encontrado en favoritos:', doc.id);
            if (!this.userId) return;
            this.firestore
              .collection('usuarios')
              .doc(this.userId)
              .collection('favoritos')
              .doc(doc.id)
              .delete()
              .then(() => {
                console.log('Receta eliminada de favoritos');
                this.filterFavorites();
              })
              .catch(error => {
                console.error('Error al eliminar receta de favoritos:', error);
              });
          });
        } else {
          console.error('No se encontró la receta en favoritos');
        }
      });
      /* */
  }

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

  

}