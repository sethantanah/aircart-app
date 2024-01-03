import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShopsDetailsPage } from './shops-details.page';

const routes: Routes = [
  {
    path: '',
    component: ShopsDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShopsDetailsPageRoutingModule {}
