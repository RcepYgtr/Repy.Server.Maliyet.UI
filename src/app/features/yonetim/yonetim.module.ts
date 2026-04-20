import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { YonetimComponent } from './yonetim.component';
import { PermissionComponent } from './permission/permission.component';
import { UserComponent } from './user/user.component';
import { RoleComponent } from './role/role.component';
import { YonetimRoutingModule } from './yonetim-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgGridAngular } from 'ag-grid-angular';
import { SharedModule } from '../../../libs/shared/shared.module';
import { UserCreateComponent } from './user/user-create/user-create.component';
import { UserDetailComponent } from './user/user-detail/user-detail.component';
import { RoleCreateComponent } from './role/role-create/role-create.component';
import { RoleDetailComponent } from './role/role-detail/role-detail.component';



@NgModule({
  declarations: [
    YonetimComponent,
    PermissionComponent,
    UserComponent,
    RoleComponent,
    UserCreateComponent,
    UserDetailComponent,
    RoleCreateComponent,
    RoleDetailComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AgGridAngular,
    SharedModule,
    FormsModule,
    YonetimRoutingModule
  ]
})
export class YonetimModule { }
