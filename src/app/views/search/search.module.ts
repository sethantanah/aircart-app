
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SearchPageRoutingModule } from './search-routing.module';

import { SearchPage } from './search.page';
import { ProuductListModule } from 'src/app/componenets/products-list/prouduct-list.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SearchPageRoutingModule,
    ProuductListModule
  ],
  declarations: [SearchPage]
})
export class SearchPageModule {}
