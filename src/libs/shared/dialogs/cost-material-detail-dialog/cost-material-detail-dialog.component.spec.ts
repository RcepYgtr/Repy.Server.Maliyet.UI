import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostMaterialDetailDialogComponent } from './cost-material-detail-dialog.component';

describe('CostMaterialDetailDialogComponent', () => {
  let component: CostMaterialDetailDialogComponent;
  let fixture: ComponentFixture<CostMaterialDetailDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CostMaterialDetailDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CostMaterialDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
