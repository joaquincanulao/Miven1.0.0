export interface Item {
    id: string;           // Un identificador único para cada artículo
    name: string;         // El nombre del artículo
    quantity: number;     // La cantidad de artículos disponibles
    expirationDate: string; // La fecha de caducidad en formato string (puedes utilizar Date si prefieres)
  }