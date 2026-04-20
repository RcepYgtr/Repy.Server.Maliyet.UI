import { Component, effect, OnInit, Type } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GridApi, GridReadyEvent, ColDef, RowClassRules, GridOptions } from 'ag-grid-community';
import { ToolbarHostService } from '../../../../libs/shared/ui/toolbar/toolbar-host.service';
import { TabService } from '../../../../libs/shared/ui/tabs/tab.service';
import { GridCacheState } from '../../../../libs/shared/ui/tabs/tab-model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LayoutService } from '../../../layout/layout.service';
import { PersonelService } from '../../../../libs/core/api/personel.service';
import { PersonelToolbarStateService } from '../_state/personel-toolbar.state.service';
import { PersonelToolbarFactory } from '../_factory/personel-toolbar.factory';
import { PERSONEL_COLUMNS } from '../_factory/personel.column';
@Component({
  selector: 'app-personel-list',
  standalone: false,
  templateUrl: './personel-list.component.html',
  styleUrl: './personel-list.component.scss',
})
export class PersonelListComponent implements OnInit {
  isBrowser: boolean = false;
  rowData: any[] = [];
  allData: any[] = [];
  visibleRows: any[] = [];
  selectedItem: any | null = null;
  dynamicKeys: string[] = [];
  private gridApi!: GridApi<any>;
  public frm: FormGroup; // sadece tanımla


  /**
   *
   */
  constructor(private repoService: PersonelService, private modalService: NgbModal,
    private fb: FormBuilder,
    public host: ToolbarHostService,
    public _PersonelToolbarStateService: PersonelToolbarStateService,
    private tabService: TabService, private layoutService: LayoutService, private siparisService: PersonelService) {
    effect(() => {
      const sidebarOpen = this.layoutService.sidebarOpen();

      if (this.gridApi) {
        // sidebar animasyonu bitsin
        setTimeout(() => {
          this.gridApi.sizeColumnsToFit();
        }, 300);
      }
    });
  }


  ngOnInit(): void {

    this._PersonelToolbarStateService.refresh$
      .subscribe(() => {
        this.loadPage(1, true);   // 🔥 BURASI TETİKLENİR
      });



    const ctx = this._PersonelToolbarStateService.ctx;
    ctx.onTabActivated = (tabId: string) => {

    };
    ctx.headerActions = {
      // refresh: () => this.loadPage(ctx.pagination!.page),
      refresh: async () => {
        this.tabService.updateGridState(this.gridKey, null as any);
        this.loadPage(1, true);
      },
      firstPage: () => this.loadPage(1),
      prevPage: () => this.loadPage(ctx.pagination!.page - 1),
      nextPage: () => this.loadPage(ctx.pagination!.page + 1),
      lastPage: () => this.loadPage(ctx.pagination!.totalPages),
      goToPage: (p: number) => this.loadPage(p),
      new: () => this.add(),
      edit: () => this.update(),
      delete: () => this.deleteSelected(),
    };
    this.host.setHeaderToolbar(PersonelToolbarFactory.grid(this._PersonelToolbarStateService.ctx));


  }


  gridOptions: GridOptions = {
    suppressNoRowsOverlay: true,
    suppressLoadingOverlay: true
  };
  defaultColDef: ColDef = {
    wrapHeaderText: true,
    autoHeaderHeight: true,
    filter: 'agTextColumnFilter',
    floatingFilter: true
  };
  onRowDoubleClick(event: any) {
    const row = event.data;
    if (!row) return;

    const href = `/features/personel/detay/${row.id}`;

    this.tabService.openTab({
      id: href,
      title: `#${row.seri ?? row.name + ' ' + row.lastName}`,
      href,
      closable: true,
      dirty: false,
      context: {
        data: row,

      }
    });
  }
  onRowClicked(event: any) {
    this.selectedItem = event.data;
  }



  /** 🌳 Grid hazır olunca */
  isLoading: any;


  async getList(params: GridReadyEvent<any>) {
    this.gridApi = params.api;
    this.gridApi.setGridOption('columnDefs', PERSONEL_COLUMNS);



    // // 🔥 CACHE VAR MI?
    const cache = this.getGridCache();

    if (cache?.rows) {
      this.rowData = cache.rows;
      const ctx = this._PersonelToolbarStateService.ctx;
      ctx.pagination!.page = 1;
      ctx.pagination!.totalCount = cache.totalCount ?? 0;
      ctx.pagination!.totalPages = cache.totalPages ?? 1;
      setTimeout(() => {
        this.selectFirstRow();
      }, 0);
      return;
    }

    this.loadPage(1);

  }



  async loadPage(page: number, forceReload = false) {

    const ctx = this._PersonelToolbarStateService.ctx;
    const p = ctx.pagination!;


    p.page = page;



    this.isLoading = true;

    try {
      const res = await this.repoService.getAll({
        page,
        pageSize: p.pageSize,
      });



      this.rowData = res.items;
      p.totalPages = res.pages;
      p.totalCount = res.count;

      //🔥 CACHE’E YAZ (SADECE 1. SAYFA)


      setTimeout(() => {
        this.selectFirstRow();
      }, 0);

    } finally {
      this.isLoading = false;
    }
  }

  add() {
    const href = `/features/personel/create`;
    this.tabService.openTab({
      id: href,
      title: `Personel Oluştur`,
      href,
      closable: true,
      dirty: false
    });
  }
  update() {
    this.selectedItem
    const currentTabId = this.tabService.activeTabId(); // 🔥 aktif tab
    const row = this.selectedItem;
    if (!row) return;

    const href = `/features/personel/detay/${row.id}`;

    this.tabService.openTab({
      id: href,
      title: `#${row.seri ?? row.name + ' ' + row.lastName}`,
      href,
      closable: true,
      dirty: false,
      context: {
        data: row,
        parentTabId: currentTabId
      }
    });
  }

  async deleteSelected() {
    if (!this.selectedItem) return;

    const confirmed = confirm('Bu kaydı silmek istiyor musunuz?');
    if (!confirmed) return;

    try {
      await this.repoService.delete(this.selectedItem.id);

      // cache temizle
      this.tabService.updateGridState(this.gridKey, null as any);

      await this.loadPage(1, true);
    }
    catch (err) {
      console.error(err);
    }
  }








  private selectFirstRow() {
    if (!this.gridApi) return;

    const firstNode = this.gridApi.getDisplayedRowAtIndex(0);
    if (!firstNode) return;

    firstNode.setSelected(true);
    this.selectedItem = firstNode.data;
  }







  private get gridKey(): string {
    return `Personel-grid`;
  }
  private getGridCache() {
    return this.tabService.getGridState(this.gridKey);
  }



}
