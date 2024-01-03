import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShopsPageRoutingModule } from './shops-routing.module';

import { ShopsPage } from './shops.page';
import { ShopListComponent } from 'src/app/components/shop-list/shop-list.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShopsPageRoutingModule
  ],
  declarations: [ShopsPage, ShopListComponent]
})
export class ShopsPageModule {}
