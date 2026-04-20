import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { ToolbarHostService } from '../../../../../libs/shared/ui/toolbar/toolbar-host.service';
import { BomToolbarStateService } from '../../_state/bom-toolbar.state.service';
import { BomToolbarFactory } from '../../_factory/bom-toolbar.factory';
import { TabService } from '../../../../../libs/shared/ui/tabs/tab.service';
import { ProjeType } from '../../../../../libs/domain/siparis-genel/siparis-genel-models';
import { GridApi, GridReadyEvent, ColDef, RowClassRules, GridOptions } from 'ag-grid-community';
import { KABIN_BOM_LIST_COLUMNS } from '../../_factory/kabin/kabin-bom-list.column';
import { GridCacheState } from '../../../../../libs/shared/ui/tabs/tab-model';
import { KabinTypeService } from '../../../../../libs/core/api/kabin/kabin-type.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BomTabKey } from '../bom-list.component';
import { KapiTypeService } from '../../../../../libs/core/api/kapi/kapi-type.service';
import { KAPI_BOM_LIST_COLUMNS } from '../../_factory/kapi/kapi-bom-list.column';

@Component({
  selector: 'app-kapi-bom',
  standalone: false,
  templateUrl: './kapi-bom.component.html',
  styleUrl: './kapi-bom.component.scss',
})
export class KapiBomComponent {
  form!: FormGroup;
  isLoading: any;

  rowData: any[] = [];
  private gridApi!: GridApi<any>;
  selectedItem: any | null = null;

  @Input() activeTab!: BomTabKey;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['activeTab'] && !changes['activeTab'].firstChange) {
      this.onTabChanged(this.activeTab);
    }
  }
  constructor(private fb: FormBuilder,
    public host: ToolbarHostService,
    public _bomToolbarStateService: BomToolbarStateService,
    private tabService: TabService,
    private kapiTypeService: KapiTypeService,) {
    this.form = this.fb.group({
      doorCategory: [1] // default Kat Kapısı
    });
  }



  ngOnInit(): void {

    const active = this.tabService.activeTab();

    if (active.context?.pageActiveTab) {
      this.activeTab = active.context.pageActiveTab;
    }
    const ctx = this._bomToolbarStateService.ctx;
    ctx.onTabActivated = (tabId: string) => {
      this.onTabChanged(tabId as any);
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
    this.host.setHeaderToolbar(BomToolbarFactory.grid(this._bomToolbarStateService.ctx));

    // 🔥 radio değişince liste yenile
    this.form.get('doorCategory')?.valueChanges.subscribe(val => {

      // cache’i temizle (yoksa eski data kalır)
      this.tabService.updateGridState(this.gridKey, null as any);

      this.loadPage(1, true);
    });
  }



  async loadPage(page: number, forceReload = false) {

    const ctx = this._bomToolbarStateService.ctx;
    const p = ctx.pagination!;
    const tab = this.activeTab;

    p.page = page;

    const cache = this.getGridCache();

    // 🔥 CACHE SADECE 1. SAYFA
    if (!forceReload && page === 1 && cache?.rows) {

      this.rowData = cache.rows;
      p.totalPages = cache.totalPages!;
      p.totalCount = cache.totalCount!;
      return;
    }
    const doorCategory = this.form.get('doorCategory')?.value;
    this.isLoading = true;

    try {
      const res = await this.kapiTypeService.getByModel(doorCategory);

      this.rowData = res;



      setTimeout(() => {
        this.selectFirstRow();
      }, 0);

    } finally {
      this.isLoading = false;
    }
  }

  add() {
    const href = `/features/bom/kapi-bom-create`;
    this.tabService.openTab({
      id: href,
      title: `Kapı Ürün Ağacı Oluştur`,
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

    const href = `/features/bom/kapi-bom-detay/${row.id}`;

    this.tabService.openTab({
      id: href,
      title: `Kapı Ürün Ağacı #${row.seriNo ?? row.id}`,
      href,
      closable: true,
      dirty: false,
      context: {
        data: row,
        pageActiveTab: this.activeTab,   // 🔥 SATIR DATASI BURADA
      parentTabId:currentTabId
      }
    });
  }
  async deleteSelected() {
    if (!this.selectedItem) return;

    const confirmed = confirm('Bu kaydı silmek istiyor musunuz?');
    if (!confirmed) return;

    try {
      await this.kapiTypeService.delete(this.selectedItem.id);

      // cache temizle
      this.tabService.updateGridState(this.gridKey, null as any);

      await this.loadPage(1, true);
    }
    catch (err) {
      console.error(err);
    }
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



  async getList(params: GridReadyEvent<any>) {
    this.gridApi = params.api;

    this.gridApi.setGridOption(
      'columnDefs',
      KAPI_BOM_LIST_COLUMNS
    );



    // 🔥 CACHE VAR MI?
    const cache = this.getGridCache();

    if (cache?.rows) {
      this.rowData = cache.rows;
      const ctx = this._bomToolbarStateService.ctx;
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


  onRowDoubleClick(event: any) {
    this.update()
  }
  onRowClicked(event: any) {
    this.selectedItem = event.data;
  }






  private selectFirstRow() {
    if (!this.gridApi) return;

    const firstNode = this.gridApi.getDisplayedRowAtIndex(0);
    if (!firstNode) return;

    firstNode.setSelected(true);
    this.selectedItem = firstNode.data;
  }
  onTabChanged(tab: BomTabKey) {

    if (this.activeTab === tab) return;

    this.activeTab = tab;
    this.tabService.updateActiveTabContext({
      pageActiveTab: tab
    });





    this.loadPage(1);
  }


  private readonly TAB_STATE_KEY = 'bom-active-tab';
  private get gridKey(): string {
    return `bom-grid-${this.activeTab}`;
  }
  private getGridCache() {
    return this.tabService.getGridState(this.gridKey);
  }

  private setGridCache(state: Partial<GridCacheState>) {
    this.tabService.updateGridState(this.gridKey, state);
  }
}
