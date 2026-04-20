import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TabService } from '../../../../libs/shared/ui/tabs/tab.service';
import { LookupCacheService } from '../../../../libs/shared/ui/lookup/lookup-cache.service';
import { PersonelToolbarStateService } from '../_state/personel-toolbar.state.service';
import { PersonelService } from '../../../../libs/core/api/personel.service';

@Component({
  selector: 'app-personel-create',
  standalone: false,
  templateUrl: './personel-create.component.html',
  styleUrl: './personel-create.component.scss',
})
export class PersonelCreateComponent implements OnInit {
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

      const result = await this.personelService.create(dto);

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






}
