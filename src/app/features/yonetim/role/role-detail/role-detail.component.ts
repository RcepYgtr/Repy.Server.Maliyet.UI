import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TabService } from '../../../../../libs/shared/ui/tabs/tab.service';
import { LookupCacheService } from '../../../../../libs/shared/ui/lookup/lookup-cache.service';
import { RoleService } from '../../../../../libs/core/api/role.service';

@Component({
  selector: 'app-role-detail',
  standalone: false,
  templateUrl: './role-detail.component.html',
  styleUrl: './role-detail.component.scss',
})
export class RoleDetailComponent implements OnInit {
  form!: FormGroup;
  /**
   *
   */
  constructor(
    private tabService: TabService,
    private fb: FormBuilder, private roleService: RoleService, private lookupCache: LookupCacheService) { }

  rowData: any;
  ngOnInit(): void {
    this.buildForm();
    const tab = this.tabService.activeTab();
    this.rowData = tab.context?.data;

    if (this.rowData) {
      this.fillFormFromRowData(this.rowData);
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
      const result = await this.roleService.update(dto);

      // 🔥 tab context güncelle
      this.tabService.updateActiveTabContext({
        data: { ...this.rowData, ...dto }
      });

      this.form.markAsPristine();

      this.tabService.updateGridState(this.gridKey, null as any);
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
      name: [null],
     
    });

  }

  private fillFormFromRowData(data: any) {

    if (!data) return;
    this.form.patchValue({
      id: data.id,
      name: data.name,
    });

  }




}
