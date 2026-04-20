// ← open / close / stack

import { Injectable } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

@Injectable({ providedIn: 'root' })
export class ModalService {

    constructor(private ngb: NgbModal) { }

    open<T>(
        component: any,
        options?: NgbModalOptions,
        inputs?: Partial<T>
    ) {
        const ref = this.ngb.open(component, {
            backdrop: 'static',
            keyboard: false,
            ...options
        });

        if (inputs) {
            Object.assign(ref.componentInstance, inputs);
        }

        return ref;
    }
}
