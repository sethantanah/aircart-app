import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsListComponent } from './products-list.component';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [ProductsListComponent],
  imports: [
    IonicModule,
    CommonModule
  ],
  exports: [ProductsListComponent]
})
export class ProuductListModule { }
