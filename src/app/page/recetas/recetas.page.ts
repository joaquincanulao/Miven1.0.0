import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recetas',
  templateUrl: './recetas.page.html',
  styleUrls: ['./recetas.page.scss'],
})
export class RecetasPage {

  constructor(private router: Router) {}

  openRecipe(type: string) {
    // Navegar a una página específica según el tipo de receta
    // Aquí puedes implementar la lógica para abrir la página correspondiente
    console.log('Navegar a la receta:', type);
  }

}
