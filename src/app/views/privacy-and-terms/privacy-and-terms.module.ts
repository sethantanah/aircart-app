import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PrivacyAndTermsPageRoutingModule } from './privacy-and-terms-routing.module';

import { PrivacyAndTermsPage } from './privacy-and-terms.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PrivacyAndTermsPageRoutingModule
  ],
  declarations: [PrivacyAndTermsPage]
})
export class PrivacyAndTermsPageModule {}
