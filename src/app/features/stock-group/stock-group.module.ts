import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgGridAngular } from 'ag-grid-angular';
import { SharedModule } from '../../../libs/shared/shared.module';
import { StockGroupComponent } from './stock-group.component';
import { StockGroupListComponent } from './stock-group-list/stock-group-list.component';
import { StockGroupDetailComponent } from './stock-group-list/stock-group-detail/stock-group-detail.component';
import { StockGroupRoutingModule } from './stock-group-routing.module';



@NgModule({
  declarations: [
    StockGroupComponent,
    StockGroupListComponent,
    StockGroupDetailComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AgGridAngular,
    SharedModule,
    FormsModule,

    StockGroupRoutingModule
  ]
})
export class StockGroupModule { }
