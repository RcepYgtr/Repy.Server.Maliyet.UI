import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainLayoutComponent } from './main-layout.component';
import { AppRoutingModule } from '../../app-routing.module';
import { SidebarComponent } from '../sidebar/sidebar';
import { MainLayoutRoutingModule } from './main-layout-routing.module';



@NgModule({
  declarations: [
    MainLayoutComponent,
    SidebarComponent
  ],
  imports: [
    CommonModule,
    MainLayoutRoutingModule,
  ]
})
export class MainLayoutModule { }
