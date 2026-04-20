import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TabService } from '../../../../libs/shared/ui/tabs/tab.service';
import { StockToolbarStateService } from '../_state/stock-toolbar.state.service';
import { StockService } from '../../../../libs/core/api/stock.service';
import { LookupCacheService } from '../../../../libs/shared/ui/lookup/lookup-cache.service';

@Component({
  selector: 'app-stock-detail',
  standalone: false,
  templateUrl: './stock-detail.component.html',
  styleUrl: './stock-detail.component.scss',
})
export class StockDetailComponent implements OnInit {
  form!: FormGroup;
  /**
   *
   */
  constructor(
    private tabService: TabService,
    private fb: FormBuilder,
    private toolbarState: StockToolbarStateService, private stockService: StockService, private lookupCache: LookupCacheService) { }

  rowData: any;
  ngOnInit(): void {
    this.buildForm();
    const tab = this.tabService.activeTab();
    this.rowData = tab.context?.data;

    if (this.rowData) {
      this.fillFormFromRowData(this.rowData);
      this.BirimListesi()
    }



  }



  async Kaydet() {

    if (!this.rowData?.id) {
      console.error("ID yok, güncelleme yapılamaz");
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const dto = {
      ...this.form.value,
      id: this.rowData.id
    };

    try {

      const result = await this.stockService.update(dto);



      // 🔥 tab context güncelle
      this.tabService.updateActiveTabContext({
        data: { ...this.rowData, ...dto }
      });

      this.form.markAsPristine();



      this.tabService.updateGridState(this.gridKey, null as any);
      this.toolbarState.triggerRefresh();
    } catch (err) {
      console.error("Update hata:", err);
    }
  }


  private get gridKey(): string {
    return `stock-grid`;
  }

  Kapat() {
    this.tabService.closeActiveTab()
  }

  buildForm() {
    this.form = this.fb.group({
      code: [null],
      name: [null],
      unitId: [null],
      unitCode: [null],
      unitCost: [0],
      currencyType: [1],
    });

  }

  private fillFormFromRowData(data: any) {

    if (!data) return;
    const currencyMap: any = {
      TL: 1,
      USD: 2,
      EUR: 3
    };
    this.form.patchValue({
      code: data.code,
      name: data.name,
      unitId: data.unitId,
      unitCode: data.unitCode,
      unitCost: data.unitCost,
      currencyType: currencyMap[data.currencyType] ?? 1
    });

  }


  units: any;
  BirimListesi() {
    this.units = [
      { id: 1, name: "AD" },
      { id: 2, name: "KG" },
      { id: 3, name: "MM" },
      { id: 4, name: "M" },

    ]



    this.lookupCache.set("units", this.units);
  }
  currencyTypes: any = [
    { id: 1, name: "TL" },
    { id: 2, name: "USD" },
    { id: 3, name: "EUR" },
  ]

}
