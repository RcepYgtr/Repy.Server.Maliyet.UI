import { Injectable } from '@angular/core';
import { ToastrService, IndividualConfig } from 'ngx-toastr';
import { SuccessType } from '../../shared/enums/success-type.enum';
@Injectable({ providedIn: 'root' })
export class NotificationService {

  constructor(private toastr: ToastrService) {}

  success(message: string, type: SuccessType) {
    this.toastr.show(
      message,
      '',
      { timeOut: 3000 },
      type as any   // created / updated vs.
    );
  }

  error(message: string) {
    this.toastr.show(
      message,
      '',
      { timeOut: 5000 },
      'error'
    );
  }

  warning(message: string) {
    this.toastr.show(
      message,
      '',
      { timeOut: 3500 },
      'warning'
    );
  }
}


