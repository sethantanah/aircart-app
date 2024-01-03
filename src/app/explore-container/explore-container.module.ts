

import { CategoriesComponent } from './../componenets/categories/categories.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExploreContainerComponent } from './explore-container.component';
import { SwiperModule } from 'swiper/angular';
import { ShopsComponent } from '../components/shops/shops.component';
import { ShopsListComponent } from '../components/shops-list/shops-list.component';
//import { BundlesListModule } from '../componenets/bundles-list/bundles-list.module';
import { ProuductListModule } from '../componenets/products-list/prouduct-list.module';
import { BundlesListModule } from '../componenets/bundles-list/bundles-list.module';
import { BundlesListComponent } from '../componenets/bundles-list/bundles-list.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, SwiperModule,  BundlesListModule, ProuductListModule],
  declarations: [ExploreContainerComponent, CategoriesComponent, ShopsComponent, ShopsListComponent],
  exports: [ExploreContainerComponent, ]
})
export class ExploreContainerComponentModule {}
