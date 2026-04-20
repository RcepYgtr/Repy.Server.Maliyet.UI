import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TabService } from '../../../../../libs/shared/ui/tabs/tab.service';
import { UserService } from '../../../../../libs/core/api/user.service';
import { LookupCacheService } from '../../../../../libs/shared/ui/lookup/lookup-cache.service';

@Component({
  selector: 'app-user-create',
  standalone: false,
  templateUrl: './user-create.component.html',
  styleUrl: './user-create.component.scss',
})
export class UserCreateComponent implements OnInit {
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

       const result = await this.userService.create(dto, () => {     });

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
      passwordConfirm: [null],
    });



  }







}
