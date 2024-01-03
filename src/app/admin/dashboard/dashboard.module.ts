import { PostProductComponent } from './../post-product/post-product.component';
import { OrdersComponent } from './../orders/orders.component';
import { SwiperModule } from 'swiper/angular';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DashboardPageRoutingModule } from './dashboard-routing.module';

import { DashboardPage } from './dashboard.page';
import { ProuductListComponent } from '../prouduct-list/prouduct-list.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule, ReactiveFormsModule,
    IonicModule,
    DashboardPageRoutingModule, 
    SwiperModule
  
  ],
  declarations: [DashboardPage, ProuductListComponent, OrdersComponent, PostProductComponent]
})
export class DashboardPageModule {}
