import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AddRecetasPage } from './add-recetas.page';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,  // Asegúrate de que esto esté importado
    RouterModule.forChild([{ path: '', component: AddRecetasPage }])
  ],
  declarations: [AddRecetasPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AddRecetaPageModule {}