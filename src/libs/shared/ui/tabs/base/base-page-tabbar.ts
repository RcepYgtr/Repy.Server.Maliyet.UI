import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface IwbTabItem {
    key: string;
    label: string;
}

@Component({
    selector: 'base-page-tabbar',
    standalone:false,
    template: `
  <ul class="nav iwb-tabs">
  <li class="nav-item" *ngFor="let tab of tabs">
    <button
      class="nav-link"
      [class.active]="active === tab.key"
      (click)="select(tab.key)">
      {{ tab.label }}
    </button>
  </li>
</ul>
  `,
  styles:[`
     @use "tab";
    `]

})
export class BasePageTabbarComponent {

    @Input() tabs: IwbTabItem[] = [];
    @Input() active!: string;

    @Output() activeChange = new EventEmitter<string>();

    select(key: string) {
        this.activeChange.emit(key);
    }
}
