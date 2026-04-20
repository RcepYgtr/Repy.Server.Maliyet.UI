import { NgModule, Optional, SkipSelf } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import { CommonModule } from '@angular/common';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from "@angular/forms";
import { LookupDialogComponent } from './ui/lookup/lookup-dialog';
import { ConfirmDeleteDialogComponent } from './ui/confirm/confirm-delete.dialog';
import { GlobalLoaderComponent } from './ui/loader/global-loader.component';
import { BaseToolbarComponent } from './ui/toolbar/base-toolbar.component';
import { BaseGridComponent } from './ui/grid/_base-grid.component';
import { BaseInputComponent } from './ui/form-control/base/base-input';
import { BaseDropdownComponent } from './ui/form-control/base/base-dropdown';
import { CheckboxComponent } from './ui/form-control/base/base-checkbox';
import { SiparisDurumDropdownComponent } from './ui/form-control/siparis-durum.dropdown';
import { BaseAutoCompleteDropdownComponent } from './ui/form-control/base/base-auto-complete-dropdown';
import { BasePageTabbarComponent } from './ui/tabs/base/base-page-tabbar';
import { StockSelectDialogComponent } from './dialogs/stock-select-dialog/stock-select-dialog.component';
import { BomMaterialSelectDialogComponent } from './dialogs/bom-material-select-dialog/bom-material-select-dialog.component';
import { PersonelSelectDialogComponent } from './dialogs/personel-select-dialog/personel-select-dialog.component';
import { RadioComponent } from './ui/form-control/base/base-radio';
import { CostMaterialDetailDialogComponent } from './dialogs/cost-material-detail-dialog/cost-material-detail-dialog.component';
@NgModule({

  declarations: [
    LookupDialogComponent,
    ConfirmDeleteDialogComponent,
    GlobalLoaderComponent,
    BaseToolbarComponent,
    BaseGridComponent,
    BaseInputComponent,
    BaseDropdownComponent,
    CheckboxComponent,
    SiparisDurumDropdownComponent,
    BaseAutoCompleteDropdownComponent,
    BasePageTabbarComponent,
    StockSelectDialogComponent,
    PersonelSelectDialogComponent,
    BomMaterialSelectDialogComponent,
    CostMaterialDetailDialogComponent,
    RadioComponent,
    CostMaterialDetailDialogComponent

  ],
  imports: [
    CommonModule,
    HttpClientModule,
    AgGridAngular,
    AgGridModule,
    NgbModalModule,
    ReactiveFormsModule,


  ],
  exports: [
    BaseInputComponent,
    BaseDropdownComponent,
    CheckboxComponent,
    BaseGridComponent,
    BaseToolbarComponent,
    SiparisDurumDropdownComponent,
    BaseAutoCompleteDropdownComponent,
    BasePageTabbarComponent,
    RadioComponent

    
  ],
})
export class SharedModule {

  constructor(@Optional() @SkipSelf() parent: SharedModule) {
    if (parent) {
      // throw new Error(
      //   'SharedModule kullanabilmek için import edilmelidir'
      // );
    }
  }
}

