import { Injectable } from '@angular/core';
import { Receta } from '../receta.model';

@Injectable({
  providedIn: 'root'
})
export class RecetasService {
  private recetas: Receta[] = [];

  constructor() { }

  addReceta(receta: Receta) {
    this.recetas.push(receta);
  }

  getRecetas(): Receta[] {
    return [...this.recetas];
  }
}
