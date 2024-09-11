import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, combineLatest } from 'rxjs';
import firebase from 'firebase/compat/app';
import { switchMap, map } from 'rxjs/operators';

interface Recipe {
  titulo: string;
  descripcion: string;
  categoria: string;
  ingredientes: string[];
  creadorId: string;
  favorita?: boolean;
}

interface Comment {
  userId: string;
  rating: number;
  comment: string;
  timestamp: firebase.firestore.Timestamp;
}

interface UserData {
  nombre: string;
  [key: string]: any;  // Si hay más propiedades en el documento del usuario
}

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  constructor(private firestore: AngularFirestore, private auth: AngularFireAuth) {}

  // Método para agregar una receta a Firestore
  addRecipe(recipe: Recipe) {
    return this.firestore.collection('recetas').add(recipe);
  }

  // Método para obtener todas las recetas
  getAllRecipes(): Observable<any[]> {
    return this.firestore.collection('recetas').valueChanges({ idField: 'id' });
  }

  // Método para obtener recetas por categoría
  getRecipesByCategory(category: string): Observable<any[]> {
    return this.firestore.collection('recetas', ref => ref.where('categoria', '==', category)).valueChanges({ idField: 'id' });
  }

  // Método para eliminar una receta
  deleteRecipe(recipeId: string) {
    return this.firestore.collection('recetas').doc(recipeId).delete();
  }

  // Método para obtener comentarios con detalles de usuarios
  getRecipeCommentsWithUser(recipeId: string): Observable<any[]> {
    return this.firestore.collection('recetas').doc(recipeId).collection('comentarios', ref => ref.orderBy('timestamp', 'desc')).snapshotChanges().pipe(
      switchMap(actions => {
        const userObservables = actions.map(a => {
          const data = a.payload.doc.data() as Comment;
          const id = a.payload.doc.id;
  
          // Obtener detalles adicionales del usuario
          return this.firestore.collection('usuarios').doc(data.userId).get().pipe(
            map((userDoc: any) => {
              const userData = userDoc.data() || {};
              return {
                ...data,
                id,
                userName: userData.nombre || 'Usuario Anónimo',
                timestamp: data.timestamp.toDate()
              };
            })
          );
        });
  
        return combineLatest(userObservables);
      })
    );
  }

  // Método para agregar un comentario con calificación a una receta
  addCommentWithRating(recipeId: string, userId: string, rating: number, comment: string) {
    return this.firestore.firestore.runTransaction(async (transaction: firebase.firestore.Transaction) => {
      const recipeRef = this.firestore.collection('recetas').doc(recipeId).ref;
      const recipeDoc = await transaction.get(recipeRef);

      if (!recipeDoc.exists) {
        throw new Error("Receta no encontrada");
      }

      // Obtener los datos existentes de la receta
      const data: { ratingCount?: number; ratingTotal?: number} = recipeDoc.data() || {};

      const ratingCount = data.ratingCount ?? 0;
      const ratingTotal = data.ratingTotal ?? 0;

      const newRatingCount = ratingCount + 1;
      const newRatingTotal = ratingTotal + rating;
      const newAverageRating = newRatingTotal / newRatingCount;

      // Actualizar la receta con el nuevo promedio y conteo de calificaciones
      transaction.update(recipeRef, {
        ratingCount: newRatingCount,
        ratingTotal: newRatingTotal,
        rating: newAverageRating // Promedio de las calificaciones
      });

      // Añadir el comentario a la subcolección de comentarios
      const commentRef = this.firestore.collection('recetas').doc(recipeId).collection('comentarios').doc();
      transaction.set(commentRef.ref, {
        userId,
        rating, // Calificación proporcionada
        comment, // Comentario del usuario
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });
    });
  }

  markAsFavorite(recipeId: string, userId: string, isFavorite: boolean) {
    return this.firestore.collection('usuarios')
      .doc(userId)
      .collection('favoritos')
      .doc(recipeId)
      .set({ favorita: isFavorite });
  }

  getFavoriteRecipes(userId: string) {
    return this.firestore.collection('usuarios').doc(userId).collection('favoritos').valueChanges();
  }
}