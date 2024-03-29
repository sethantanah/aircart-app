import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth.guard';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'tab1',
        loadChildren: () => import('../tab1/tab1.module').then(m => m.Tab1PageModule)
      },
      {
        path: 'tab2',
        loadChildren: () => import('../tab2/tab2.module').then(m => m.Tab2PageModule)
      },
      {
        path: 'tab3', canLoad: [AuthGuard],
        loadChildren: () => import('../tab3/tab3.module').then(m => m.Tab3PageModule)
      },
       {
    path: 'search',
    loadChildren: () => import('./../views/search/search.module').then( m => m.SearchPageModule)
  },
      {
        path: 'invoice',
        loadChildren: () => import('../views/invoice/invoice.module').then(m => m.InvoicePageModule)
      },
      {
        path: 'dashboard',
        loadChildren: () => import('../admin/dashboard/dashboard.module').then(m => m.DashboardPageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/tab1',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/tab1',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
