import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmDeleteDialogComponent } from '../../shared/ui/confirm/confirm-delete.dialog';

@Injectable({ providedIn: 'root' })
export class ConfirmService {

  constructor(private modal: NgbModal) {}

  ask(options: {
    title?: string;
    message: string;
    detail?: string;
    danger?: boolean;
    size?:string;
    confirmText?: string;
    cancelText?: string;
  }): Promise<boolean> {

    const ref = this.modal.open(ConfirmDeleteDialogComponent, {
      centered: true,
      size: 'sm',
      backdrop: 'static',
      keyboard: false
    });

    Object.assign(ref.componentInstance, {
      title: options.title ?? 'Onay',
      message: options.message,
      detail: options.detail,
      danger: options.danger ?? false,
      confirmText: options.confirmText ?? 'Onayla',
      cancelText: options.cancelText ?? 'Vazgeç'
    });

    return ref.result.then(
      () => true,
      () => false
    );
  }
}
