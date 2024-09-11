import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RecetasService } from '../../page/services/receta.service';
import { Receta } from '../receta.model';



@Component({
  selector: 'app-add-recetas',
  templateUrl: './add-recetas.page.html', 
  styleUrls: ['./add-recetas.page.scss'],
})
export class AddRecetasPage {
  title: string = '';
  imageUrl: string = '';
  ingredients: string[] = [];
  category: 'desayuno' | 'almuerzo' | 'cena' | 'postre' = 'desayuno';
  instructions: string = '';

  constructor(private recetasService: RecetasService, private router: Router) {}

  onAddIngredient(ingredient: string) {
    this.ingredients.push(ingredient);
  }

  onAddReceta() {
    const newReceta: Receta = {
      id: Math.random().toString(),
      title: this.title,
      imageUrl: this.imageUrl,
      ingredients: this.ingredients,
      category: this.category,
      instructions: this.instructions
    };
    this.recetasService.addReceta(newReceta);
    this.router.navigate(['/recetas']);
  }
}