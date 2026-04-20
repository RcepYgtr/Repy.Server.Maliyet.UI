import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonelComponent } from './personel.component';
import { PersonelListComponent } from './personel-list/personel-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgGridAngular } from 'ag-grid-angular';
import { SharedModule } from '../../../libs/shared/shared.module';
import { PersonelRoutingModule } from './personel-routing.module';
import { PersonelCreateComponent } from './personel-create/personel-create.component';
import { PersonelDetailComponent } from './personel-detail/personel-detail.component';



@NgModule({
  declarations: [
    PersonelComponent,
    PersonelListComponent,
    PersonelCreateComponent,
    PersonelDetailComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AgGridAngular,
    SharedModule,
    FormsModule,
    
    PersonelRoutingModule
  ]
})
export class PersonelModule { }
