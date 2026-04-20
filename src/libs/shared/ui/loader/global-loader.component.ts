import { Component } from "@angular/core";
import { Observable } from "rxjs";
import { LoaderService } from "../../../core/loader/loader.service";

@Component({
  selector: 'global-loader',
  standalone:false,
  template: `
    <div class="erp-loader" *ngIf="loading$ | async">
      <div class="spinner"></div>
    </div>
  `,styles:[`
  .erp-loader {
  position: fixed;
  inset: 0;
  background: rgba(255,0,0,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 5px solid #ccc;
  border-top-color: #1976d2;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

  `]
})
export class GlobalLoaderComponent {


  loading$!: Observable<boolean>;

  constructor(private loader: LoaderService) {
    this.loading$ = this.loader.loading$;
  }
}
