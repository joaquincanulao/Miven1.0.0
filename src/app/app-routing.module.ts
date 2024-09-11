import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { InventoryComponent } from './inventory/inventory.component'; // Importar componente de inventario
import { AddRecipeComponent } from './components/add-recipe/add-recipe.component';
import { BreakfastRecipesComponent } from './components/breakfast-recipes/breakfast-recipes.component';
import { LunchRecipesComponent } from './components/lunch-recipes/lunch-recipes.component';
import { DinnerRecipesComponent } from './components/dinner-recipes/dinner-recipes.component';
import { DessertRecipesComponent } from './components/dessert-recipes/dessert-recipes.component';
import { AddItemComponent } from './components/add-item/add-item.component';
import { FavoritesComponent } from './components/favorites/favorites.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'folder/:id',
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then( m => m.RegisterPageModule)
  },

  { path: 'inventory', component: InventoryComponent }, // Ruta para el inventario
  { path: '', redirectTo: '/inventory', pathMatch: 'full' }, // Ruta predeterminada
  { path: 'add-recipe', component: AddRecipeComponent }, // Ruta para agregar recetas
  { path: '', redirectTo: '/add-recipe', pathMatch: 'full' }, // Ruta predeterminada
  { path: 'breakfast-recipes', component: BreakfastRecipesComponent },
  { path: '', redirectTo: '/breakfast-recipes', pathMatch: 'full' },
  { path: 'lunch-recipes', component: LunchRecipesComponent },
  { path: '', redirectTo: '/lunch-recipes', pathMatch: 'full' },
  { path: 'dinner-recipes', component: DinnerRecipesComponent },
  { path: '', redirectTo: '/dinner-recipes', pathMatch: 'full' },
  { path: 'dessert-recipes', component: DessertRecipesComponent },
  { path: '', redirectTo: '/dessert-recipes', pathMatch: 'full' },
  { path: 'inventory', component: InventoryComponent },
  { path: '', redirectTo: '/inventory', pathMatch: 'full' },
  { path: 'add-item', component: AddItemComponent },
  { path: '', redirectTo: '/add-item', pathMatch: 'full' },
  { path: 'favorites', component: FavoritesComponent },
  { path: '', redirectTo: '/favorites', pathMatch: 'full' },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  
]
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
