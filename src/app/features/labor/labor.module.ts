import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LaborComponent } from './labor.component';
import { LaborListComponent } from './labor-list/labor-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgGridAngular } from 'ag-grid-angular';
import { SharedModule } from '../../../libs/shared/shared.module';
import { LaborRoutingModule } from './labor-routing.module';
import { LaborTypeDetailComponent } from './labor-list/labor-type-detail/labor-type-detail.component';



@NgModule({
  declarations: [
    LaborComponent,
    LaborListComponent,
    LaborTypeDetailComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AgGridAngular,
    SharedModule,
    FormsModule,
    
    LaborRoutingModule
  ]
})
export class LaborModule { }
