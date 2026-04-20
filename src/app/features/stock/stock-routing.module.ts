import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StockDetailComponent } from './stock-detail/stock-detail.component';
import { StockCreateComponent } from './stock-create/stock-create.component';
import { StockListComponent } from './stock-list/stock-list.component';



const routes: Routes = [
  {
    path: '',
    children: [
       { path: '', component: StockListComponent },
       { path: 'create', component: StockCreateComponent },
       { path: 'detay/:id', component: StockDetailComponent },
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StockRoutingModule { }
