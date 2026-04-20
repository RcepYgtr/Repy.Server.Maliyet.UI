import { APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { RouteReuseStrategy } from '@angular/router';
import { CustomRouteReuseStrategy } from './route-reuse.strategy';
import { SidebarComponent } from './layout/sidebar/sidebar';
import { ToastrModule } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from '../libs/core/core.module';
import { CustomToastComponent } from '../libs/shared/ui/toast/custom-toast.component';
import { ToolbarHostService } from '../libs/shared/ui/toolbar/toolbar-host.service';
import { AuthService } from '../libs/core/auth/auth.service';
import { LookupCacheService } from '../libs/shared/ui/lookup/lookup-cache.service';
import { AuthInterceptor } from '../libs/core/auth/auth.interceptor';
import { CoreInitializerService } from '../libs/core/api/core-initializer.service';

export function coreInitializerFactory(core: CoreInitializerService) {
  return async () => {
    await core.init();
  };
}
@NgModule({
  declarations: [
    AppComponent,

  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CoreModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      toastComponent: CustomToastComponent,
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      closeButton: true,
    })


  ],
  providers: [
    ToolbarHostService,
    // { provide: "baseUrl", useValue: "http://192.168.4.111:7030/api", multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: APP_INITIALIZER, useFactory: coreInitializerFactory, deps: [CoreInitializerService], multi: true },


  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
