import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaliyetComponent } from './maliyet.component';
import { MaliyetListComponent } from './maliyet-list/maliyet-list.component';
import { AppRoutingModule } from "../../app-routing.module";
import { MaliyetRoutingModule } from './maliyet-router.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../libs/shared/shared.module';
import { AgGridAngular } from 'ag-grid-angular';
import { KabinMaliyetComponent } from './maliyet-list/kabin-maliyet/kabin-maliyet.component';
import { SuspansiyonMaliyetComponent } from './maliyet-list/suspansiyon-maliyet/suspansiyon-maliyet.component';
import { TestComponent } from './maliyet-list/test/test.component';
import { MakineSasesiMaliyetComponent } from './maliyet-list/makine-sasesi-maliyet/makine-sasesi-maliyet.component';
import { AgirlikSasesiMaliyetComponent } from './maliyet-list/agirlik-sasesi-maliyet/agirlik-sasesi-maliyet.component';
import { KapiMaliyetComponent } from './maliyet-list/kapi-maliyet/kapi-maliyet.component';

import { BaseChartDirective } from 'ng2-charts';
import { MaliyetGrafikComponent } from './maliyet-grafik/maliyet-grafik.component';
import { KabinMaliyetGrafikComponent } from './maliyet-grafik/kabin-maliyet-grafik/kabin-maliyet-grafik.component';

@NgModule({
  declarations: [
    MaliyetComponent,
    MaliyetListComponent,
    AgirlikSasesiMaliyetComponent,
    KabinMaliyetComponent,
    SuspansiyonMaliyetComponent,
    MakineSasesiMaliyetComponent,
    KapiMaliyetComponent,
    TestComponent,

    MaliyetGrafikComponent,
    KabinMaliyetGrafikComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AgGridAngular,
    SharedModule,
    FormsModule,
    MaliyetRoutingModule,
    BaseChartDirective

]
})
export class MaliyetModule { }
