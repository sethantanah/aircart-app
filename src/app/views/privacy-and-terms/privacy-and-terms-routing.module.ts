import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PrivacyAndTermsPage } from './privacy-and-terms.page';

const routes: Routes = [
  {
    path: '',
    component: PrivacyAndTermsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrivacyAndTermsPageRoutingModule {}
