import { Component, Input } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
export type ConfirmType = 'danger' | 'warning' | 'info';
@Component({
  selector: 'app-confirm-delete',
  standalone: false,
  template: `

<!-- DELETE INFO MODAL -->
<div class="erp-modal">

  <div class="erp-modal-header">
    <span class="erp-modal-icon" [class.danger]="danger">⚠</span>
    <div class="erp-modal-title">{{ title }}</div>
  </div>

  <div class="erp-modal-body">
   <div class="p-2">
     <div class="erp-modal-message">{{ message }}</div>
    <div class="erp-modal-detail" *ngIf="detail">
      {{ detail }}
    </div>
   </div>
  </div>

  <div class="erp-modal-footer">
    <button class="erp-btn erp-btn-secondary"
            (click)="activeModal.dismiss()">
      {{ cancelText }}
    </button>

    <button class="erp-btn"
            [class.erp-btn-danger]="danger"
            (click)="activeModal.close(true)">
      {{ confirmText }}
    </button>
  </div>

</div>



  `,
  styles: [` @use "confirm-modal";`]

})
export class ConfirmDeleteDialogComponent {
  @Input() title = 'Onay';
  @Input() message = '';
  @Input() detail?: string;
  @Input() confirmText = 'Onayla';
  @Input() cancelText = 'Vazgeç';
  @Input() danger = false;

  constructor(public activeModal: NgbActiveModal) { }
}