import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeaturesComponent } from './features.component';
import { FeaturesRoutingModule } from './features-routing.module';
import { LoginComponent } from '../layout/auth-layout/login/login.component';
import { RegisterComponent } from '../layout/auth-layout/register/register.component';
import { RoleComponent } from '../layout/auth-layout/role/role.component';



@NgModule({
  declarations: [
    FeaturesComponent,

  ],
  imports: [
    CommonModule,
    FeaturesRoutingModule
  ]
})
export class FeaturesModule { }
