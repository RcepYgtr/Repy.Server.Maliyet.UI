import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TabService } from '../../../../libs/shared/ui/tabs/tab.service';
import { LookupCacheService } from '../../../../libs/shared/ui/lookup/lookup-cache.service';
import { PersonelToolbarStateService } from '../_state/personel-toolbar.state.service';
import { PersonelService } from '../../../../libs/core/api/personel.service';

@Component({
  selector: 'app-personel-detail',
  standalone: false,
  templateUrl: './personel-detail.component.html',
  styleUrl: './personel-detail.component.scss',
})
export class PersonelDetailComponent implements OnInit {
  form!: FormGroup;
  /**
   *
   */
  constructor(
    private tabService: TabService,
    private fb: FormBuilder,
    private toolbarState: PersonelToolbarStateService, private personelService: PersonelService, private lookupCache: LookupCacheService) { }

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
      id:this.rowData.id
    };

    try {

     const result = await this.personelService.update(dto);



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
    return `Personel-grid`;
  }

  Kapat() {
    this.tabService.closeActiveTab()
  }

  buildForm() {
    this.form = this.fb.group({
      name: [null],
      lastName: [null],
      departman: [null],
      totalMonthlyCost: [0],
    });

  }

  private fillFormFromRowData(data: any) {

    if (!data) return;
    this.form.patchValue({
      name: data.name,
      lastName: data.lastName,
      departman: data.departman,
      totalMonthlyCost: data.totalMonthlyCost,

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


}
