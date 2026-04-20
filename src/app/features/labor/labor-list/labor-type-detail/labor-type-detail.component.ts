import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TabService } from '../../../../../libs/shared/ui/tabs/tab.service';
import { ModalService } from '../../../../../libs/core/modal/modal.service';
import { ToolbarHostService } from '../../../../../libs/shared/ui/toolbar/toolbar-host.service';
import { LaborToolbarStateService } from '../../_state/labor-toolbar.state.service';
import { LaborDetailCreateToolbarFactory } from '../../_factory/labor-detail-create-toolbar.factory';
import { PersonelLaborTypeService } from '../../../../../libs/core/api/personel-labor-type.service';
import { PersonelSelectDialogComponent } from '../../../../../libs/shared/dialogs/personel-select-dialog/personel-select-dialog.component';
type TabType = 'materials' | 'rules';
@Component({
  selector: 'app-labor-type-detail',
  standalone: false,
  templateUrl: './labor-type-detail.component.html',
  styleUrl: './labor-type-detail.component.scss',
})
export class LaborTypeDetailComponent implements OnInit {
  form!: FormGroup;

  // 🔥 STATE
  activeTab: TabType = 'materials';
  rowData: any[] = [];
  selectedRow: any = null;

  // 🔥 GRID
  gridApi: any;

  columnDefs = [
    { width: 120, field: 'name', headerName: 'Ad', },
    { width: 120, field: 'lastName', headerName: 'Soyad', },
    { width: 100, field: 'departman', headerName: 'Departman', },
    { width: 70, field: 'ratio', headerName: 'Etki Oranı', editable: true },
    {
      headerName: '',
      width: 60,
      cellRenderer: () => '🗑️',
      onCellClicked: (params: any) => {
        this.removeRow(params.data);
      }
    }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private tabService: TabService,
    private personelLaborTypeService: PersonelLaborTypeService,
    private modalService: ModalService,
    public host: ToolbarHostService,
    public _LaborToolbarStateService: LaborToolbarStateService
  ) { }


  ngOnInit(): void {
    this.buildForm();
    this.initToolbar();
    this.loadFromRoute();
  }
  private buildForm() {
    this.form = this.fb.group({
      laborTypeId: [null]
    });
  }
  selectedItem: any
  private initToolbar() {
    const ctx = this._LaborToolbarStateService.ctx;
    const active = this.tabService.activeTab();
    this.selectedItem = active.context.data;

    ctx.headerActions = {
      new: () => this.openPersonelModal(),
      delete: () => this.deleteSelected()
    };

    this.host.setHeaderToolbar(
      LaborDetailCreateToolbarFactory.grid(ctx)
    );
  }

  private loadFromRoute() {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) return;

    const laborTypeId = +id;

    setTimeout(() => {
      this.form.patchValue({ laborTypeId: laborTypeId });
    });

    this.loadLabor(laborTypeId);
  }

  async loadLabor(id: number) {

    const res: any = await this.personelLaborTypeService.getByLaborType(id);
    this.rowData = (res.items || []).map((x: any) => ({
      personelId: x.personelId,
      name: x.name,
      lastName: x.lastName,
      departman: x.departman,
      totalMonthlyCost: x.totalMonthlyCost,
      ratio: x.ratio,
    }));


    if (this.rowData.length) {
      this.selectedRow = this.rowData[0];
    }
  }

  getList(params: any) {
    this.gridApi = params.api;
  }

  onRowClicked(event: any) {
    this.selectedRow = event.data;
  }

  removeRow(row: any) {
    this.rowData = this.rowData.filter(x => x !== row);
  }

  openPersonelModal() {
    const ref = this.modalService.open(PersonelSelectDialogComponent, {
      size: 'lg'
    });

    ref.result.then((items: any[]) => {
      if (!items?.length) return;
      this.addRows(items);
    });
  }

  addRows(items: any[]) {
    const newRows = items
      .map(x => ({
        personelId: x.id,
        name: x.name,
        lastName: x.lastName,
        departman: x.departman,
        totalMonthlyCost: x.totalMonthlyCost,
        ratio: 100,
      }));
    this.rowData = [...this.rowData, ...newRows];
  }



  deleteSelected() {
    if (!this.selectedRow) return;
    this.removeRow(this.selectedRow);
  }















  async Kaydet() {

    if (!this.form.value.laborTypeId) {
      alert('Labor model seç');
      return;
    }

    if (!this.rowData.length) {
      alert('Malzeme eklemeden kaydedemezsin');
      return;
    }


    const payload = {
      laborTypeId: this.form.value.laborTypeId,
      items: this.rowData.map(x => ({
        personelId: x.personelId,
        name: x.name,
        lastName: x.lastName,
        departman: x.departman,
        totalMonthlyCost: x.totalMonthlyCost,
        ratio: x.ratio
      })),

    };

    try {

      await this.personelLaborTypeService.update(payload);
      this.tabService.updateActiveTabContext({
        data: payload
      });

    } catch (err) {
      console.error(err);
      alert('Hata oluştu');
    }
  }

  Kapat() {
    this.tabService.closeActiveTab();
  }

}
