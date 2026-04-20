import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionComponent } from './permission/permission.component';
import { AuthGuard } from '../../../libs/core/auth/auth.guard';
import { YonetimComponent } from './yonetim.component';
import { UserCreateComponent } from './user/user-create/user-create.component';
import { UserDetailComponent } from './user/user-detail/user-detail.component';
import { RoleCreateComponent } from './role/role-create/role-create.component';
import { RoleDetailComponent } from './role/role-detail/role-detail.component';



const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: YonetimComponent, canActivate: [AuthGuard], },
      { path: 'permission', component: PermissionComponent, canActivate: [AuthGuard], },



      { path: 'user/create', component: UserCreateComponent },
      { path: 'user/detay/:id', component: UserDetailComponent },

      { path: 'role/create', component: RoleCreateComponent },
      { path: 'role/detay/:id', component: RoleDetailComponent },
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class YonetimRoutingModule { }
