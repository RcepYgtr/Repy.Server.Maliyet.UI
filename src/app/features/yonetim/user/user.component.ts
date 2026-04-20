import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { GridApi, GridReadyEvent, ColDef, RowClassRules, GridOptions } from 'ag-grid-community';
import { ProjeType } from '../../../../libs/domain/siparis-genel/siparis-genel-models';
import { ToolbarHostService } from '../../../../libs/shared/ui/toolbar/toolbar-host.service';
import { YonetimToolbarStateService } from '../_state/yonetim-toolbar.state.service';
import { TabService } from '../../../../libs/shared/ui/tabs/tab.service';
import { RoleService } from '../../../../libs/core/api/role.service';
import { YonetimToolbarFactory } from '../_factory/yonetim-toolbar.factory';
import { YONETIM_COLUMNS } from '../_factory/yonetim.column';
import { GridCacheState } from '../../../../libs/shared/ui/tabs/tab-model';
import { UserService } from '../../../../libs/core/api/user.service';
import { USER_LIST_COLUMNS } from '../_factory/user/user-list.column';
import { PermissionService } from '../../../../libs/core/api/permission.service';


@Component({
  selector: 'app-user',
  standalone: false,
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent implements OnInit {
  isLoading: any;

  rowData: any[] = [];
  private gridApi!: GridApi<any>;
  selectedItem: any | null = null;
  roles: any = [];
  @Input() activeTab!: any;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['activeTab'] && !changes['activeTab'].firstChange) {
      this.onTabChanged(this.activeTab);
    }
  }

  constructor(
    public host: ToolbarHostService,
    public _yonetimToolbarStateService: YonetimToolbarStateService,
    private tabService: TabService,
    private userService: UserService,
    private permissionService: PermissionService,
    private roleService: RoleService
  ) { }



  ngOnInit(): void {

    this.loadRoles()

    const active = this.tabService.activeTab();

    if (active.context?.pageActiveTab) {
      this.activeTab = active.context.pageActiveTab;
    }
    const ctx = this._yonetimToolbarStateService.ctx;
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
    this.host.setHeaderToolbar(YonetimToolbarFactory.grid(this._yonetimToolbarStateService.ctx));
  }



  async loadPage(page: number, forceReload = false) {

    const ctx = this._yonetimToolbarStateService.ctx;
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

    this.isLoading = true;

    try {
      const res = await this.userService.getAll();
      this.rowData = res;
      setTimeout(() => {
        this.selectFirstRow();
      }, 0);

    } finally {
      this.isLoading = false;
    }
  }

  add() {
    const href = `/features/yonetim/user/create`;
    this.tabService.openTab({
      id: href,
      title: `Kullanıcı Oluştur`,
      href,
      closable: true,
      dirty: false
    });
  }
  update() {
    this.selectedItem

    const row = this.selectedItem;
    if (!row) return;

    const href = `/features/yonetim/user/detay/${row.id}`;

    this.tabService.openTab({
      id: href,
      title: `Kullanıcı #${row.seriNo ?? row.userName}`,
      href,
      closable: true,
      dirty: false,
      context: {
        data: row,
        pageActiveTab: this.activeTab   // 🔥 SATIR DATASI BURADA
      }
    });
  }
  async deleteSelected() {
    if (!this.selectedItem) return;

    const confirmed = confirm('Bu kaydı silmek istiyor musunuz?');
    if (!confirmed) return;

    try {
      // await this.roleService.delete(this.selectedItem.id);

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
      USER_LIST_COLUMNS
    );



    // 🔥 CACHE VAR MI?
    const cache = this.getGridCache();

    if (cache?.rows) {
      this.rowData = cache.rows;
      const ctx = this._yonetimToolbarStateService.ctx;
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
    const row = event.data;
    if (!row) return;


    const href = `/features/yonetim/user/detay/${row.id}`;
    this.tabService.openTab({
      id: href,
      title: `Kullanıcı #${row.seriNo ?? row.userName}`,
      href,
      closable: true,
      dirty: false,
      context: {
        data: row,
        pageActiveTab: this.activeTab   // 🔥 SATIR DATASI BURADA
      }
    });
  }

  selectedRoles: string[] = [];
  async onRowClicked(event: any) {
    const user = event.data;
    if (!user) return;

    this.selectedItem = user;

    try {
      const roles: any = await this.permissionService.getRolesToUser(user.userName);

      this.selectedRoles = Array.isArray(roles)
        ? roles
        : roles?.userRoles ?? [];


    } catch (err) {
      console.error("Rol çekme hatası", err);
    }
  }


  async loadRoles() {


    await this.roleService.getAll(
      (data: any) => {
        this.roles = data;
      },
      (error) => {
        console.error("Roller yüklenemedi", error);
      }
    );

  }
  isChecked(roleName: string): boolean {
    return this.selectedRoles
      .map(r => r.toLowerCase())
      .includes(roleName.toLowerCase());
  }
  toggleRole(roleName: string) {

    const exists = this.selectedRoles
      .map(r => r.toLowerCase())
      .includes(roleName.toLowerCase());

    if (exists) {
      this.selectedRoles = this.selectedRoles
        .filter(r => r.toLowerCase() !== roleName.toLowerCase());
    } else {
      this.selectedRoles = [...this.selectedRoles, roleName];
    }
  }



  private async selectFirstRow() {
    if (!this.gridApi) return;

    const firstNode = this.gridApi.getDisplayedRowAtIndex(0);
    if (!firstNode) return;

    firstNode.setSelected(true);
    this.selectedItem = firstNode.data;



    try {
      const roles: any = await this.permissionService.getRolesToUser(firstNode.data.userName);

      this.selectedRoles = Array.isArray(roles)
        ? roles
        : roles?.userRoles ?? [];


    } catch (err) {
      console.error("Rol çekme hatası", err);
    }



  }
  onTabChanged(tab: any) {

    if (this.activeTab === tab) return;

    this.activeTab = tab;
    this.tabService.updateActiveTabContext({
      pageActiveTab: tab
    });





    this.loadPage(1);
  }


  private readonly TAB_STATE_KEY = 'Yonetim-active-tab';
  private get gridKey(): string {
    return `Yonetim-grid-${this.activeTab}`;
  }
  private getGridCache() {
    return this.tabService.getGridState(this.gridKey);
  }

  private setGridCache(state: Partial<GridCacheState>) {
    this.tabService.updateGridState(this.gridKey, state);
  }




async Kaydet() {

  if (!this.selectedItem) return;

  try {

    await this.permissionService.assignRole(
      {
        userId: this.selectedItem.id,
        roles: this.selectedRoles
      },
      () => {
        console.log("Rol atama başarılı");
      },
      (error) => {
        console.error("Rol atama hatası", error);
      }
    );

  } catch (err) {
    console.error(err);
  }
}








}
