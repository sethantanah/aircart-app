import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BundlesListComponent } from './bundles-list.component';
import { IonicModule } from '@ionic/angular';


@NgModule({
  declarations: [BundlesListComponent],
  imports: [   IonicModule, CommonModule ],
  exports: [ BundlesListComponent]
})
export class BundlesListModule { }
