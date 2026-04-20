import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BOMComponent } from '../bom/bom.component';
import { BomListComponent } from './bom-list/bom-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgGridAngular } from 'ag-grid-angular';
import { SharedModule } from '../../../libs/shared/shared.module';
import { BomRoutingModule } from './bom-routing.module';
import { KabinBomComponent } from './bom-list/kabin-bom/kabin-bom.component';
import { SuspansiyonBomComponent } from './bom-list/suspansiyon-bom/suspansiyon-bom.component';
import { SuspansiyonBomCreateComponent } from './bom-list/suspansiyon-bom/suspansiyon-bom-create/suspansiyon-bom-create.component';
import { SuspansiyonBomDetailComponent } from './bom-list/suspansiyon-bom/suspansiyon-bom-detail/suspansiyon-bom-detail.component';
import { MakineSasesiBomComponent } from './bom-list/makine-sasesi-bom/makine-sasesi-bom.component';
import { MakineSasesiBomDetailComponent } from './bom-list/makine-sasesi-bom/makine-sasesi-bom-detail/makine-sasesi-bom-detail.component';
import { KabinBomDetailComponent } from './bom-list/kabin-bom/kabin-bom-detail/kabin-bom-detail.component';
import { AgirlikSasesiBomComponent } from './bom-list/agirlik-sasesi-bom/agirlik-sasesi-bom.component';
import { AgirlikSasesiBomDetailComponent } from './bom-list/agirlik-sasesi-bom/agirlik-sasesi-bom-detail/agirlik-sasesi-bom-detail.component';
import { KapiBomComponent } from './bom-list/kapi-bom/kapi-bom.component';
import { KapiBomDetailComponent } from './bom-list/kapi-bom/kapi-bom-detail/kapi-bom-detail.component';


@NgModule({
  declarations: [
    BOMComponent,
    BomListComponent,
    
    KabinBomComponent,

    SuspansiyonBomComponent,
    SuspansiyonBomCreateComponent,
    SuspansiyonBomDetailComponent,

    MakineSasesiBomComponent,
    MakineSasesiBomDetailComponent,
    KabinBomDetailComponent,
    AgirlikSasesiBomComponent,
    AgirlikSasesiBomDetailComponent,
    KapiBomComponent,
    KapiBomDetailComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AgGridAngular,
    SharedModule,
    FormsModule,
    BomRoutingModule,
    
]
})
export class BOMModule { }
