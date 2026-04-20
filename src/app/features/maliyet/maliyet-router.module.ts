import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaliyetListComponent } from './maliyet-list/maliyet-list.component';
import { MaliyetGrafikComponent } from './maliyet-grafik/maliyet-grafik.component';



const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: MaliyetListComponent },
      { path: 'grafik', component: MaliyetGrafikComponent },
      //    { path: 'create', component: MaliyetCreateComponent },
      //    { path: 'detay/:id', component: MaliyetDetailComponent },
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaliyetRoutingModule { }
