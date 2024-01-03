import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes, CanLoad } from '@angular/router';
import { AuthGuard } from './auth.guard';


const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
    {
    path: 'bundle-offers/:category',
    loadChildren: () => import('./views/bundle-offers/bundle-offers.module').then( m => m.BundleOffersPageModule)
  },
  {
    path: 'products',
    loadChildren: () => import('./views/products/products.module').then( m => m.ProductsPageModule)
  },
  {
    path: 'products/:al',
    loadChildren: () => import('./views/products/products.module').then( m => m.ProductsPageModule)
  },
  {
    path: 'checkout', canLoad: [AuthGuard],
    loadChildren: () => import('./views/checkout/checkout.module').then( m => m.CheckoutPageModule)
  },
  {
    path: 'product-details/:img',
    loadChildren: () => import('./views/product-details/product-details.module').then( m => m.ProductDetailsPageModule)
  },
  {
    path: 'invoice', canLoad:[AuthGuard],
    loadChildren: () => import('./views/invoice/invoice.module').then( m => m.InvoicePageModule)
  },
  {
    path: 'registration',
    loadChildren: () => import('./views/registration/registration.module').then( m => m.RegistrationPageModule)
  },
  {
    path: 'registration/:id',
    loadChildren: () => import('./views/registration/registration.module').then( m => m.RegistrationPageModule)
  },
  {
    path: 'customer-support',
    loadChildren: () => import('./views/customer-support/customer-support.module').then( m => m.CustomerSupportPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./views/profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'upload-product/:action/:product',
    loadChildren: () => import('./admin/upload-product/upload-product.module').then( m => m.UploadProductPageModule)
  },
  {
    path: 'create-offer',
    loadChildren: () => import('./views/create-offer/create-offer.module').then( m => m.CreateOfferPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./views/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'login/:id',
    loadChildren: () => import('./views/login/login.module').then( m => m.LoginPageModule)
  },

  {
    path: 'dashboard', canLoad: [AuthGuard],
    loadChildren: () => import('./admin/dashboard/dashboard.module').then( m => m.DashboardPageModule)
  },
  {
    path: 'dashboard/:action/:id', canLoad: [AuthGuard],
    loadChildren: () => import('./admin/dashboard/dashboard.module').then( m => m.DashboardPageModule)
  },
  {
    path: 'categories',
    loadChildren: () => import('./admin/categories/categories.module').then( m => m.CategoriesPageModule)
  },
  {
    path: 'shops',
    loadChildren: () => import('./views/shops/shops.module').then( m => m.ShopsPageModule)
  },
  {
    path: 'shops-details/:shop-id',
    loadChildren: () => import('./views/shops-details/shops-details.module').then( m => m.ShopsDetailsPageModule)
  },
  {
    path: 'reset-password',
    loadChildren: () => import('./views/reset-password/reset-password.module').then( m => m.ResetPasswordPageModule)
  },
  {
    path: 'privacy-and-terms-of-use',
    loadChildren: () => import('./views/privacy-and-terms/privacy-and-terms.module').then( m => m.PrivacyAndTermsPageModule)
  }


];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, initialNavigation: 'enabledBlocking' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
