import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from '../../../../../libs/core/api/user.service';
import { TabService } from '../../../../../libs/shared/ui/tabs/tab.service';
import { LookupCacheService } from '../../../../../libs/shared/ui/lookup/lookup-cache.service';

@Component({
  selector: 'app-user-detail',
  standalone: false,
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.scss',
})
export class UserDetailComponent implements OnInit {
  form!: FormGroup;
  /**
   *
   */
  constructor(
    private tabService: TabService,
    private fb: FormBuilder, private userService: UserService, private lookupCache: LookupCacheService) { }

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
      id:this.rowData.id
    };

    try {
      const result = await this.userService.update(dto);



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
      fullName: [null],
      userName: [null],
      email: [null],
      password: [null],
    });

  }

  private fillFormFromRowData(data: any) {

    if (!data) return;
    this.form.patchValue({
      id: data.id,
      userName: data.userName,
      email: data.email,
      fullName: data.fullName,
      password: data.password || undefined
    });

  }




}
