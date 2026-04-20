import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LaborListComponent } from './labor-list/labor-list.component';
import { LaborTypeDetailComponent } from './labor-list/labor-type-detail/labor-type-detail.component';


const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: LaborListComponent },
      { path: 'labor-detay/:id', component: LaborTypeDetailComponent },
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LaborRoutingModule { }
