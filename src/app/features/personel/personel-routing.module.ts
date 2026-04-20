import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PersonelListComponent } from './personel-list/personel-list.component';
import { PersonelCreateComponent } from './personel-create/personel-create.component';
import { PersonelDetailComponent } from './personel-detail/personel-detail.component';


const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: PersonelListComponent },
      { path: 'create', component: PersonelCreateComponent },
      { path: 'detay/:id', component: PersonelDetailComponent },
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PersonelRoutingModule { }
