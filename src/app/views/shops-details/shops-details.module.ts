import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShopsDetailsPageRoutingModule } from './shops-details-routing.module';

import { ShopsDetailsPage } from './shops-details.page';

import { CatalogueItemComponent } from 'src/app/catalogue-item/catalogue-item.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShopsDetailsPageRoutingModule
  ],
  declarations: [ShopsDetailsPage, CatalogueItemComponent]
})
export class ShopsDetailsPageModule {}
