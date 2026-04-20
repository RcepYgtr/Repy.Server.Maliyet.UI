import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-cost-material-detail-dialog',
  standalone: false,
  templateUrl: './cost-material-detail-dialog.component.html',
  styleUrl: './cost-material-detail-dialog.component.scss',
})
export class CostMaterialDetailDialogComponent {
  @Input() items: any[] = [];
  @Input() title = '';

  close() { }
}
