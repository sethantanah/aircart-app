import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CustomerSupportPageRoutingModule } from './customer-support-routing.module';

import { CustomerSupportPage } from './customer-support.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CustomerSupportPageRoutingModule
  ],
  declarations: [CustomerSupportPage]
})
export class CustomerSupportPageModule {}
