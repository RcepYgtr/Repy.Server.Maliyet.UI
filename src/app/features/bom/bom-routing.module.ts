import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BomListComponent } from './bom-list/bom-list.component';
import { SuspansiyonBomCreateComponent } from './bom-list/suspansiyon-bom/suspansiyon-bom-create/suspansiyon-bom-create.component';
import { SuspansiyonBomDetailComponent } from './bom-list/suspansiyon-bom/suspansiyon-bom-detail/suspansiyon-bom-detail.component';
import { MakineSasesiBomDetailComponent } from './bom-list/makine-sasesi-bom/makine-sasesi-bom-detail/makine-sasesi-bom-detail.component';
import { KabinBomDetailComponent } from './bom-list/kabin-bom/kabin-bom-detail/kabin-bom-detail.component';
import { AgirlikSasesiBomDetailComponent } from './bom-list/agirlik-sasesi-bom/agirlik-sasesi-bom-detail/agirlik-sasesi-bom-detail.component';
import { KapiBomDetailComponent } from './bom-list/kapi-bom/kapi-bom-detail/kapi-bom-detail.component';


const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: BomListComponent },

      //  { path: 'cabin-bom-create', component: CabinBomCreateComponent },
      //  { path: 'cabin-bom-detay/:id', component: CabinBomDetailComponent },



      { path: 'kabin-bom-detay/:id', component: KabinBomDetailComponent },

      { path: 'suspansiyon-bom-detay/:id', component: SuspansiyonBomDetailComponent },

      { path: 'makine-sasesi-bom-detay/:id', component: MakineSasesiBomDetailComponent },

      { path: 'agirlik-sasesi-bom-detay/:id', component: AgirlikSasesiBomDetailComponent },

      { path: 'kapi-bom-detay/:id', component: KapiBomDetailComponent },
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BomRoutingModule { }
