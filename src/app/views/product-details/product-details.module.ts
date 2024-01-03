import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductDetailsPageRoutingModule } from './product-details-routing.module';

import { ProductDetailsPage } from './product-details.page';
import { SwiperModule } from 'swiper/angular';
import { BundlesListModule } from 'src/app/componenets/bundles-list/bundles-list.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductDetailsPageRoutingModule,
    SwiperModule,
    HttpClientModule,
    BundlesListModule
  ],
  declarations: [ProductDetailsPage]
})
export class ProductDetailsPageModule {}
