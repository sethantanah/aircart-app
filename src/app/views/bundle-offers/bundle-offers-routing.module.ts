import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BundleOffersPage } from './bundle-offers.page';

const routes: Routes = [
  {
    path: '',
    component: BundleOffersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BundleOffersPageRoutingModule {}
