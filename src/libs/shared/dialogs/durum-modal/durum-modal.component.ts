import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-durum-modal',
  standalone: false,
  templateUrl: './durum-modal.component.html',
  styleUrl: './durum-modal.component.scss',
})
export class DurumModalComponent {

  /**
   *
   */
  constructor(public activeModal: NgbActiveModal,) {


  }
  selectedDurum: any;
  close() {
    this.activeModal.close(this.selectedDurum)

  }
}
