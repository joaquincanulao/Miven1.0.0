import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { environment } from '../environments/environment';
import { InventoryComponent } from './inventory/inventory.component';
import { FormsModule } from '@angular/forms'; // Importar FormsModule
import { AddRecipeComponent } from './components/add-recipe/add-recipe.component';
import { RecipeService } from './services/recipe.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BreakfastRecipesComponent } from './components/breakfast-recipes/breakfast-recipes.component';
import { LunchRecipesComponent } from './components/lunch-recipes/lunch-recipes.component';
import { DinnerRecipesComponent } from './components/dinner-recipes/dinner-recipes.component';
import { DessertRecipesComponent } from './components/dessert-recipes/dessert-recipes.component';
import { AddItemComponent } from './components/add-item/add-item.component'; // Importa el componente
import { HttpClientModule } from '@angular/common/http';
import { FavoritesComponent } from './components/favorites/favorites.component';


@NgModule({
  declarations: [AppComponent, 
    InventoryComponent, 
    AddRecipeComponent,     
    BreakfastRecipesComponent,
    LunchRecipesComponent,
    DinnerRecipesComponent,
    DessertRecipesComponent,
    AddItemComponent,
    FavoritesComponent, ], // Añadir AddItemPage a las declaraciones
  imports: [BrowserModule, 
            IonicModule.forRoot(),
            AppRoutingModule,
            AngularFireModule.initializeApp(environment.firebaseConfig),
            FormsModule,
            AngularFireAuthModule,
            AngularFirestoreModule,
            HttpClientModule,],

  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, 
              provideFirebaseApp(() => initializeApp({"projectId":"miven-c5f93","appId":"1:46504601832:web:ecc2f1c0f13346da7c415d","storageBucket":"miven-c5f93.appspot.com","apiKey":"AIzaSyC7SViDJ3MAfnpzls1znWTVYTvO6S5K1ys","authDomain":"miven-c5f93.firebaseapp.com","messagingSenderId":"46504601832"})),
              provideAuth(() => getAuth()),
              ],
              
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})


export class AppModule {}
