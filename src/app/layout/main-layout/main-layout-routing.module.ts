import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './main-layout.component';
import { AuthGuard } from '../../../libs/core/auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,  canActivate: [AuthGuard],
    children: [
      {
        path: 'features',
        loadChildren: () =>
          import('../../features/features.module').then(m => m.FeaturesModule)
      },
      { path: '', redirectTo: 'features', pathMatch: 'full' }
    ]
  },
];

@NgModule({
    imports: [RouterModule.forChild(routes)], // ✅ DOĞRU
    exports: [RouterModule]
})
export class MainLayoutRoutingModule { }
