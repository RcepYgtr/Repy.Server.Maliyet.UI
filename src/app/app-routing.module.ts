import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeaturesComponent } from './features/features.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

// const routes: Routes = [
//   {
//     path: '',
//     component: FeaturesComponent,
//     children: [
//       { path: 'features', loadChildren: () => import('./features/features.module').then(m => m.FeaturesModule) },
//       { path: '', redirectTo: 'features', pathMatch: 'full' }
//     ]
//   },
//   { path: '**', redirectTo: 'features' }
// ];

const routes: Routes = [

  {
    path: 'auth',
    loadChildren: () =>
      import('./layout/auth-layout/auth-layout.module')
        .then(m => m.AuthLayoutModule)
  },

  {
    path: '',
    loadChildren: () =>
      import('./layout/main-layout/main-layout.module')
        .then(m => m.MainLayoutModule)
  },

  { path: '**', redirectTo: '' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabledBlocking'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }