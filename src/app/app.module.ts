import { environment, serviceAccount } from './../environments/environment.prod';
import { ProductService } from './services/product.service';
import { AllCategoriesComponent } from './componenets/all-categories/all-categories.component';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';


import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { provideAnalytics,getAnalytics,ScreenTrackingService,UserTrackingService } from '@angular/fire/analytics';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideDatabase,getDatabase } from '@angular/fire/database';
import { provideFunctions,getFunctions } from '@angular/fire/functions';
import { provideMessaging,getMessaging } from '@angular/fire/messaging';
import { providePerformance,getPerformance } from '@angular/fire/performance';
import { provideRemoteConfig,getRemoteConfig } from '@angular/fire/remote-config';
import { provideStorage,getStorage } from '@angular/fire/storage';
import { ServiceWorkerModule } from '@angular/service-worker';











//import { NgWebPushModule } from 'ng-webpush'

//import { File } from '@awesome-cordova-plugins/file/ngx';



@NgModule({
  declarations: [AppComponent, AllCategoriesComponent],
  entryComponents: [],
  imports: [BrowserModule.withServerTransition({ appId: 'serverApp' }), IonicModule.forRoot(), AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    HttpClientModule,
    // eslint-disable-next-line max-len
    provideFirebaseApp(() => initializeApp(environment.firebase)), provideFirestore(() => getFirestore()), provideAnalytics(() => getAnalytics()), provideAuth(() => getAuth()), provideDatabase(() => getDatabase()), provideFunctions(() => getFunctions()), provideMessaging(() => getMessaging()), providePerformance(() => getPerformance()), provideRemoteConfig(() => getRemoteConfig()), provideStorage(() => getStorage()), ServiceWorkerModule.register('ngsw-worker.js', {
  enabled: environment.production,
  // Register the ServiceWorker as soon as the application is stable
  // or after 30 seconds (whichever comes first).
  registrationStrategy: 'registerWhenStable:30000'
}),
  ],
  // eslint-disable-next-line max-len
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    ProductService, ScreenTrackingService,UserTrackingService],
  bootstrap: [AppComponent],
})
export class AppModule {}
