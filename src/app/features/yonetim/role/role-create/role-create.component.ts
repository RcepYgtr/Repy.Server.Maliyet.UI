import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TabService } from '../../../../../libs/shared/ui/tabs/tab.service';
import { LookupCacheService } from '../../../../../libs/shared/ui/lookup/lookup-cache.service';
import { RoleService } from '../../../../../libs/core/api/role.service';

@Component({
  selector: 'app-role-create',
  standalone: false,
  templateUrl: './role-create.component.html',
  styleUrl: './role-create.component.scss',
})
export class RoleCreateComponent implements OnInit {
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
       const result = await this.roleService.create(dto, () => {     });

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







}
