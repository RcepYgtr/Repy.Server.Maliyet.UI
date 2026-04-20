import { Directive } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Directive()
// 👆 template yok ama Angular DI var
export abstract class BaseModalComponent<TResult = any> {

  constructor(public activeModal: NgbActiveModal) {}

  close(result?: TResult) {
    this.activeModal.close(result);
  }

  dismiss(reason?: any) {
    this.activeModal.dismiss(reason);
  }
}
