import { Component } from '@angular/core';
import { Toast, ToastPackage, ToastrService } from 'ngx-toastr';
import { SuccessType } from '../../enums/success-type.enum';
import { ToastUiMap } from './toast-ui.config';

@Component({
  selector: '[custom-toast]',
  standalone: false,
  template: `
    <div class="toast-card">
      <div class="icon" [style.color]="color">
        <i [class]="icon"></i>
      </div>
      <div class="content">
        <div class="title">{{ title }}</div>
        <div class="message">{{ message }}</div>
      </div>
      <div class="progress" [style.background]="color"></div>
    </div>
  `
})
export class CustomToastComponent extends Toast {



  icon = '';
  color = '';

  constructor(
    toastrService: ToastrService,
    toastPackage: ToastPackage
  ) {
    super(toastrService, toastPackage);
  }

  ngOnInit() {
  const type = this.toastPackage.toastType;
  const ui = ToastUiMap[type] ?? ToastUiMap[SuccessType.Completed];

  this.title = ui.title;
  this.icon = ui.icon;
  this.color = ui.color;
  }

close() {
  this.toastPackage.toastRef.close();
}
}