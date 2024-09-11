export interface Receta {
    id: string;
    title: string;
    imageUrl: string;       // URL o base64 de la imagen
    ingredients: string[];  // Lista de artículos necesarios
    category: 'desayuno' | 'almuerzo' | 'cena' | 'postre';  // Categorías predefinidas
    instructions: string;   // Texto de la receta
  }