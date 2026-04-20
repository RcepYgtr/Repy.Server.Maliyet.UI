import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StockComponent } from './stock.component';
import { StockCreateComponent } from './stock-create/stock-create.component';
import { StockDetailComponent } from './stock-detail/stock-detail.component';
import { AppRoutingModule } from "../../app-routing.module";
import { StockRoutingModule } from './stock-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgGridAngular } from 'ag-grid-angular';
import { SharedModule } from '../../../libs/shared/shared.module';
import { StockListComponent } from './stock-list/stock-list.component';

@NgModule({
  declarations: [
    StockComponent,
    StockCreateComponent,
    StockDetailComponent,
    StockListComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AgGridAngular,
    SharedModule,
    FormsModule,

    StockRoutingModule
  ]
})
export class StockModule { }
