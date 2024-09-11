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
  isAuthenticated: boolean = false;

  constructor(
    private auth: AngularFireAuth,
    private firestore: AngularFirestore
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
      const favoritos = this.firestore.collection('usuarios').doc(this.userId).collection('favoritos'
        , ref => ref.where('category', '==', this.selectedCategory)
      );
      favoritos.get().forEach((querySnapshot) => {
        const tempDoc: any= []
        querySnapshot.forEach((doc) => {
          tempDoc.push({ id: doc.id, ...doc.data() })
        })
        console.log(tempDoc)
      })
       
    /*
    this.firestore.collection('usuarios').doc(this.userId).collection('favoritos'
      // , ref => ref.where('category', '==', this.selectedCategory)
    ).snapshotChanges().subscribe(actions => {
      console.log(' map == ', 
        actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          // return { id, ...data };
        })

      );
      
      //this.filteredFavorites = actions.map(a => {
      //  const data = a.payload.doc.data();
      //  const id = a.payload.doc.id;
      //  return { id, ...data };
      //});
      
    });
  /* */
  }
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
        
      })
      .catch(error => {
        console.error('Error al eliminar receta de favoritos:', error);
      });
  }
}