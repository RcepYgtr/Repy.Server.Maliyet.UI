import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TabService } from '../../../../libs/shared/ui/tabs/tab.service';
import { StockToolbarStateService } from '../_state/stock-toolbar.state.service';
import { StockService } from '../../../../libs/core/api/stock.service';
import { LookupCacheService } from '../../../../libs/shared/ui/lookup/lookup-cache.service';

@Component({
  selector: 'app-stock-create',
  standalone: false,
  templateUrl: './stock-create.component.html',
  styleUrl: './stock-create.component.scss',
})
export class StockCreateComponent implements OnInit {
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




  }



  async Kaydet() {


    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const dto = {
      ...this.form.value,
    };

    try {

      const result = await this.stockService.create(dto, () => {
        this.stockService.getNextStockCode(
          (nextCode: any) => {
            this.form.patchValue({
              code: nextCode.code
            });
          },
          (err) => {
            console.error(err);
          }
        );
      });

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
      unitId: [1],
      unitCost: [0],
      currencyType: [1],
    });

    this.stockService.getNextStockCode(
      (nextCode: any) => {
        this.form.patchValue({
          code: nextCode.code
        });
      },
      (err) => {
        console.error(err);
      }
    );

  }


  currencyTypes: any = [
    { id: 1, name: "TL" },
    { id: 2, name: "USD" },
    { id: 3, name: "EUR" },
  ]




}
