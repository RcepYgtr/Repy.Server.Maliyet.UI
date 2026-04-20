import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StockGroupDetailComponent } from './stock-group-list/stock-group-detail/stock-group-detail.component';
import { StockGroupListComponent } from './stock-group-list/stock-group-list.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: StockGroupListComponent },
      { path: 'stock-group-detay/:id', component: StockGroupDetailComponent },
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StockGroupRoutingModule { }
