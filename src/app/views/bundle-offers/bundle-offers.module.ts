import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BundleOffersPageRoutingModule } from './bundle-offers-routing.module';

import { BundleOffersPage } from './bundle-offers.page';


import { BundlesListModule } from 'src/app/componenets/bundles-list/bundles-list.module';
import { ProuductListModule } from 'src/app/componenets/products-list/prouduct-list.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BundleOffersPageRoutingModule,
    BundlesListModule,
    ProuductListModule
  ],
  declarations: [BundleOffersPage]
})
export class BundleOffersPageModule {}
