import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';

import { IonicModule } from '@ionic/angular';

import { ProductsPageRoutingModule } from './products-routing.module';

import { ProductsPage } from './products.page';

import { BundlesListModule } from 'src/app/componenets/bundles-list/bundles-list.module';
import { ProuductListModule } from 'src/app/componenets/products-list/prouduct-list.module';
import { ProductItemComponent } from 'src/app/componenets/product-item/product-item.component';




@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductsPageRoutingModule,
    BundlesListModule,
    ProuductListModule,
  ],
  declarations: [ProductsPage, ProductItemComponent]
})
export class ProductsPageModule {}
