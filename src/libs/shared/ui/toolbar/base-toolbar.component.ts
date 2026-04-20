import { Component, Input } from "@angular/core";
import { TableToolbar } from "./toolbar.models";

@Component({
  selector: 'base-toolbar',
  standalone: false,
  template: `
  <div class="iwb-toolbar" *ngIf="toolbar">

  <!-- LEFT -->
<!-- LEFT -->
<div class="iwb-toolbar-left">
  <ng-container *ngFor="let item of toolbar.left">

    <ng-container [ngSwitch]="item.type">

      <!-- BUTTON -->
      <button
        *ngSwitchCase="'button'"
        class="iwb-tbtn"
        [title]="$any(item).title"
        [disabled]="$any(item).disabled?.()"
        (click)="$any(item).action()">

        <img [src]="$any(item).icon">

        <span *ngIf="$any(item).label" class="iwb-tbtn-label" style="display: flex;width: 100%;">
          {{ $any(item).label }}
        </span>
      </button>

      <!-- DROPDOWN 👇 EKLENDİ -->
      <div *ngSwitchCase="'dropdown'" class="dropdown">
        <button
          class="iwb-tbtn dropdown-toggle dropdown-btn"
          type="button"
          data-bs-toggle="dropdown"
          [title]="$any(item).title">

          <img [src]="$any(item).icon">

          <span *ngIf="$any(item).label" class="iwb-tbtn-label">
            {{ $any(item).label }}
          </span>
        </button>

        <ul class="dropdown-menu iwb-settings-menu">
          <li *ngFor="let d of $any(item).items" style="cursor: pointer;    ">
            <a class="dropdown-item" style=" padding-left: 0; "
            [class.text-danger]="d.danger"
            (click)="d.action()">
            <img [src]="$any(d).icon" style="height: 26px;">   
          {{ d.label }}
            </a>
          </li>
        </ul>
      </div>

      <!-- PAGE -->
      <div *ngSwitchCase="'page'">
        <span class="iwb-page">
          Sayfa
          <input
            type="number"
            [value]="toolbarState.pagination?.page"
            (keydown.enter)="goToPage($event)">
          /
          {{ toolbarState.pagination?.totalPages }}
        </span>
      </div>

      <!-- SEPARATOR -->
      <div *ngSwitchCase="'separator'" class="iwb-sep"></div>
    </ng-container>

  </ng-container>
</div>










  <!-- RIGHT -->
  <div class="iwb-toolbar-right d-flex gap-1">
    <ng-container *ngFor="let item of toolbar.right">

      <ng-container [ngSwitch]="item.type">
        <!-- BUTTON -->
       <button
         *ngSwitchCase="'button'"
         class="iwb-tbtn"
         [title]="$any(item).title"
         (click)="$any(item).action()">
         <img [src]="$any(item).icon">
           <span *ngIf="$any(item).label" class="iwb-tbtn-label">
           {{ $any(item).label }}
         </span>
       </button>

        <!-- DROPDOWN -->
       <div *ngSwitchCase="'dropdown'" class="dropdown">
  <button
    class="iwb-tbtn dropdown-toggle dropdown-btn"
    type="button"
    data-bs-toggle="dropdown"
    [title]="$any(item).title">
    <img [src]="$any(item).icon">
      <span *ngIf="$any(item).label" class="iwb-tbtn-label">
    {{ $any(item).label }}
  </span>
    <!-- <span class="down-icon">▾</span> -->
  </button>

  <ul class="dropdown-menu dropdown-menu-end iwb-settings-menu">
    <li *ngFor="let d of $any(item).items" style="    cursor: pointer;">
      <a class="dropdown-item"
         [class.text-danger]="d.danger"
         (click)="d.action()">
        {{ d.label }}
      </a>
    </li>
  </ul>
       </div>


      </ng-container>

    </ng-container>
  </div>

</div>

  `,
  styles: [`@use "action-toolbar";
.iwb-toolbar-left > * {
  display: inline-flex;
  align-items: center;
}


.iwb-tbtn {
border: 1px solid #cdcdcd !important;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: none;
  background: transparent;
  padding: 6px 8px;
  border-radius: 6px;
  transition: 0.2s ease;
  cursor: pointer;
}

.iwb-tbtn:hover:not(.iwb-disabled) {
  background: #f2f2f2;
}

/* 🔥 Disabled görünüm */
.iwb-tbtn.iwb-disabled,
.iwb-tbtn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  pointer-events: none; // tamamen tıklamayı keser
  filter: grayscale(70%);
}  `]
})
export class BaseToolbarComponent {
  @Input() toolbar!: TableToolbar;
  @Input() toolbarState!: any;

  goToPage(e: any) {
    const page = Number(e.target.value);
    this.toolbarState.headerActions?.goToPage?.(page);
  }
}
