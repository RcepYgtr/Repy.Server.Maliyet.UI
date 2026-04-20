import { Component, HostListener, Injector, Input, OnInit, Type, ViewChild } from '@angular/core';
import { BaseModalComponent } from './base-modal';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LOOKUP_FILTER_TOKEN } from '../../../../LOOKUP_FILTER_TOKEN';

@Component({
  selector: 'app-lookup-modal',
  standalone: false,
  template: `


<div class="modal-header py-2 px-3 border-bottom d-flex justify-content-between" >
  <div class="d-flex flex-column">
    <h5 class="mb-0 fw-semibold">
      <i class="fa-solid fa-building me-2 text-primary"></i>
      {{ title }}
    </h5>
    <small *ngIf="smallTitle">{{ smallTitle }}</small>
  </div>
  <button type="button"
          class="btn btn-sm btn-light"
          (click)="activeModal.close()">
    <i class="fa-solid fa-xmark"></i>
  </button>
</div>



<!-- 📊 GRID -->
<div class="modal-body p-0">
    <div class="iwb-layout">
  
 
  <ng-container *ngIf="filterComponent">
       <ng-container *ngComponentOutlet="filterComponent;
         injector: filterInjector">
       </ng-container>
  </ng-container>
  

   <div class="iwb-middle">



   TABLO VE TOOLBAR GELECEK

   </div>
   
  
  
  
  </div>
</div>

<!-- 🧾 FOOTER -->
<div class="modal-footer d-flex justify-content-between align-items-center px-3 py-2 ">

        <!-- Seçim bilgisi -->
        <div class="text-muted small d-flex align-items-center gap-2">
       
          <!-- 🔹 MULTI SELECT BİLGİ ALANI -->
          <ng-container *ngIf="multiSelect; else singleSelectInfo">
  <div class="d-flex flex-column small text-muted gap-1">

    <!-- her zaman görünen açıklama -->
    <div class="d-flex align-items-center gap-2">
      <i class="fa-solid fa-circle-info"></i>
      <span>Ctrl veya Shift tuşlarını kullanarak birden fazla seçim yapabilirsiniz</span>
    </div>

    <!-- seçim varsa -->
    <div
      *ngIf="selectedRows.length > 0"
      class="d-flex align-items-center gap-2 text-dark"
    >
      <i class="fa-solid fa-check-circle text-success"></i>
      <span>
        <strong>{{ selectedRows.length }}</strong> kayıt seçildi
      </span>
    </div>

  </div>
          </ng-container>
          
          
            <!-- 🔹 SINGLE SELECT -->
          <ng-template #singleSelectInfo>
    <span *ngIf="!selected">
      Henüz seçim yapılmadı
    </span>

    <span *ngIf="selected">
      <i class="fa-solid fa-check-circle text-success me-1"></i>
      Seçim yapıldı
    </span>
          </ng-template>

        </div>
    
    
      <!-- Aksiyonlar -->
<div class="d-flex justify-content-end gap-2 lookup-actions">

  <button
    type="button"
    class="btn btn-sm btn-outline-neutral"
    (click)="activeModal.dismiss()">
    Vazgeç
    <span class="kbd-hint">Esc</span>
  </button>

  <button
    type="button"
    class="btn btn-sm btn-action"
    [class.disabled]="multiSelect ? selectedRows.length === 0 : !selected"
    [disabled]="multiSelect ? selectedRows.length === 0 : !selected"
    (click)="confirm()">
    <i class="fa-solid fa-check me-1"></i>
    Seç
    <span class="kbd-hint">Enter</span>
  </button>

</div>


</div>





`,
  styles: [`

@use "form";
@use "action-toolbar";
@use "tab";
/* 🌍 ANA LAYOUT */
.iwb-layout {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 285px);
  min-height:500px
}

/* 🔼 ÜST & 🔽 ALT SABİT */
.iwb-top,
.iwb-bottom {
  flex-shrink: 0;
}

/* 🔥 ORTA HER ZAMAN KALANI ALIR */
.iwb-middle {
  flex: 1;
  min-height: 0;          /* AG-GRID kuralı */
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* GRID TAM DOLDURSUN */
.iwb-middle base-table,
.iwb-middle ag-grid-angular {
  flex: 1;
  min-height: 0;
}

/* FORM SCROLL */
.iwb-form-container {
  max-height: 250px;
  overflow-y: auto;
}

/* ALT TAB CONTENT */
.iwb-tab-content {
  height: 200px;
}





.iwb-page-header {

    padding: 0;
    border-bottom: 0px solid #e0e0e0;
}

.accordion-body{
  padding:0;
}











  .lookup-body {
  height: 60vh;        // 🔥 KRİTİK
  min-height: 400px;
  padding: 0;
}


.lookup-modal {
  display: flex;
  flex-direction: column;
  height: 70vh;
}

.lookup-header {
  padding: 0.75rem;
  border-bottom: 1px solid #ddd;
  display: flex;
  gap: 0.5rem;
  align-items: center;

  .title {
    font-weight: 600;
    flex: 1;
  }
}

.lookup-body {
  flex: 1;
  min-height: 0; // 🔥 AG-GRID İÇİN KRİTİK
}

.lookup-footer {
  padding: 0.75rem;
  border-top: 1px solid #ddd;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}





.lookup-actions {
  .btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-weight: 500;
  }
}

/* Vazgeç */
.btn-outline-neutral {
  color: #475569;              // slate-600
  border: 1px solid #cbd5e1;   // slate-300
  background: #ffffff;

  &:hover {
    background: #f8fafc;
    border-color: #94a3b8;
    color: #334155;
  }
}

/* Seç */
.btn-action {
  background: #0f7ba5;   // 🔥 SENİN RENGİN
  border: 1px solid #2563eb;
  color: #ffffff;

  &:hover {
    background: #1e40af;
    border-color: #1e40af;
  }

  &:disabled,
  &.disabled {
    background: #e2e8f0;
    border-color: #e2e8f0;
    color: #94a3b8;
    cursor: not-allowed;
  }
}

/* Klavye ipucu */
.kbd-hint {
  font-size: 11px;
  padding: 1px 6px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  line-height: 1.2;
}

/* Vazgeç için daha sade */
.btn-outline-neutral .kbd-hint {
  background: #f1f5f9;
  border-color: #e2e8f0;
  color: #64748b;
}





  `]

})
export class LookupDialogComponent extends BaseModalComponent<any> implements OnInit {

  @Input() title!: string;
  @Input() smallTitle!: string;
  @Input() columnDefs!: any[];
  @Input() loadFn!: (filters?: any) => Promise<any[]>;
  @Input() cacheKey?: string;
  @Input() enableSearch = true;
  @Input() filterComponent?: Type<any>;
  filterValue: any = {};
  filterInjector: any;
  @Input() multiSelect = false;
  selected: any;
  selectedRows: any[] = [];




  constructor(
    injector: Injector,
    activeModal: NgbActiveModal   // ✅ sadece burada
  ) {
    super(activeModal);           // ✅ base'e ver

    this.filterInjector = Injector.create({
      parent: injector,           // 🔥 ÇOK KRİTİK
      providers: [{
        provide: LOOKUP_FILTER_TOKEN,
        useValue: {
          apply: (value: any) => {
            this.filterValue = value;
          }
        }
      }]
    });
  }
  ngOnInit(): void {
   
  }



  // 🔥 filtreyi loadFn'e bağlayan proxy
  loadFnProxy = (filters?: any) => {
    return this.loadFn({ ...this.filterValue });
  };

  confirm() {
    if (this.multiSelect) {
      this.close(this.selectedRows);
    } else {
      this.close(this.selected);
    }
  }




  onSelect(row: any) {


  }

  onDoubleClick(row: any) {
    this.close(row); // double click
  }

  onSelectionChange(rows: any[]) {

    if (this.multiSelect) {
      this.selectedRows = rows;
    } else {
      this.selected = rows[0];
    }
  }

  onRefresh() {

  }









  @HostListener('document:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent) {

    // ESC → HER ZAMAN KAPAT
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      this.dismiss();
      return;
    }

    // ENTER
    if (event.key === 'Enter') {
      // debugger;
      // input içindeyken Enter çalışmasın
      const target = event.target as HTMLElement;

      // SADECE gerçek for<m inputlarında Enter'ı engelle
      if (target?.tagName === 'INPUT' && (target as HTMLInputElement).type !== 'checkbox') {
        return;
      }

      if (target?.tagName === 'TEXTAREA') {
        return;
      }

      if (this.multiSelect) {

        if (this.selectedRows.length === 0) return;
        event.preventDefault();
        this.close(this.selectedRows);
        return;
      }

      if (!this.selected) return;

      event.preventDefault();
      this.close(this.selected);
    }
  }















  /////////////////////
  // MODAL AÇILMASI İÇİN ÖRNEK
  /////////////////////

  // async test_MODAL() {
  //   const unit = await this.lookup.select({
  //     title: 'Birim Seçimi',
  //     smallTitle: 'Listeden bir veya birden fazla birim seçiniz',
  //     size: 'xl',
  //     cacheKey: 'unitLookup',
  //     columnDefs: [
  //       { field: 'warehouseCode', headerName: 'Kod' },
  //       { field: 'warehouseName', headerName: 'Ad' }
  //     ],
  //     loadFn: (filters) => this.repoService.getAll(filters),
  //     filterComponent: StockLookupFilterComponent,
  //     multiSelect: true
  //   });
  //}


  }








