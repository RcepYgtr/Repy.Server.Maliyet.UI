import { Component, computed, OnInit, signal } from '@angular/core';
import { PermissionService } from '../../../../libs/core/api/permission.service';
import { RoleDto, RoleService } from '../../../../libs/core/api/role.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ColDef, GridReadyEvent } from 'ag-grid-community';
import { PermissionCheckboxComponent } from './PermissionCheckboxComponent';
import { TabService } from '../../../../libs/shared/ui/tabs/tab.service';
import { ROLE_LIST_COLUMNS } from '../_factory/role/role-list.column';
import { GridCacheState } from '../../../../libs/shared/ui/tabs/tab-model';
import { YonetimToolbarStateService } from '../_state/yonetim-toolbar.state.service';
export interface PermissionDto {
  module: string;
  actionType: 'Reading' | 'Writing' | 'Updating' | 'Deleting';
  code: string;
  definition: string;
}

export interface PermissionMatrixRow {
  module: string;
  Reading?: PermissionDto;
  Writing?: PermissionDto;
  Updating?: PermissionDto;
  Deleting?: PermissionDto;
}
@Component({
  selector: 'app-permission',
  standalone: false,
  templateUrl: './permission.component.html',
  styleUrl: './permission.component.scss',
})
export class PermissionComponent implements OnInit {


  form: FormGroup;
  selectedItem: any;
  selectedRoles: string[];
  rowData: any;
  constructor(
    private permissionService: PermissionService,
    private roleService: RoleService,
    private fb: FormBuilder,
    private tabService: TabService,
    public _yonetimToolbarStateService: YonetimToolbarStateService,
  ) {
    this.form = this.createForm();
  }

  // =========================
  // STATE
  // =========================
  permissions = signal<PermissionDto[]>([]);
  selectedCodes = signal<string[]>([]);
  roles = [];
  loading = false;

  // gridApi: any;
  rolesGridApi: any;
  matrixGridApi: any;
  // =========================
  // INIT
  // =========================
  ngOnInit() {
    this.loadRoles();
    this.loadMatrix();

    this.form.get('roleId')?.valueChanges.subscribe(roleId => {
      this.loadRole(roleId);
    });
  }

  // =========================
  // GRID
  // =========================
  columnDefs: any = [
    { field: 'module', headerName: 'Module', pinned: 'left', width: 200 },

    { width: 80, field: 'Reading', cellRenderer: PermissionCheckboxComponent },
    { width: 80, field: 'Writing', cellRenderer: PermissionCheckboxComponent },
    { width: 80, field: 'Updating', cellRenderer: PermissionCheckboxComponent },
    { width: 80, field: 'Deleting', cellRenderer: PermissionCheckboxComponent }
  ];

  checkboxRenderer(params: any) {
    if (!params.value) return '';

    // 🔥 DB’de bu permission yoksa hiç gösterme
    if (!this.selectedCodes().length) return '';

    const checked = this.isChecked(params.value);

    return `<input type="checkbox" ${checked ? 'checked' : ''} />`;
  }

  // onCellClicked(event: any) {
  //   const permission = event.value;
  //   if (!permission) return;

  //   this.toggle(permission);

  //   // 🔥 anında refresh
  //   this.matrixGridApi?.refreshCells({ force: true });
  // }
  onCellClicked(event: any) {
  const permission = event.value;
  if (!permission) return;

  this.toggleGroup(permission.module, permission.actionType);

  this.matrixGridApi?.refreshCells({ force: true });
}

  gridOptions = {
    context: {
      componentParent: this
    }
  };
  gridOptions2 = {
    context: {
      componentParent: this
    }
  };
  onGridReady(params: any) {
    this.matrixGridApi = params.api;
  }


  async getList(params: GridReadyEvent<any>) {
    this.rolesGridApi = params.api;

    this.rolesGridApi.setGridOption(
      'columnDefs',
      ROLE_LIST_COLUMNS
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


    try {
      const res = await this.roleService.getAll();
      this.rowData = res;
      setTimeout(() => {
        this.selectFirstRow();
      }, 0);

    } finally {
    }
  }
  private async selectFirstRow() {
    if (!this.rolesGridApi) return;

    const firstNode = this.rolesGridApi.getDisplayedRowAtIndex(0);
    if (!firstNode) return;
    firstNode.setSelected(true);

    const role = firstNode.data;
    this.selectedItem = role;

    try {
      const roles: any = await this.permissionService.getRolePermissions(role.id);
      this.selectedRoles = Array.isArray(roles)
        ? roles
        : roles?.userRoles ?? [];

      this.permissionService.getRolePermissions(
        this.selectedItem.id,
        (codes) => {
          this.selectedCodes.set(codes);

          // 🔥 checkboxları güncelle
          this.matrixGridApi?.refreshCells({ force: true });

          this.loading = false;
        },
        (error) => {
          console.error('Role permission yüklenemedi', error);
          this.loading = false;
        }
      );

    } catch (err) {
      console.error("Hata:", err);
    }
  }

  // =========================
  // FORM
  // =========================
  private createForm(): FormGroup {
    return this.fb.group({
      roleId: [null],
    });
  }

  // =========================
  // LOAD ROLES
  // =========================
  loadRoles() {
    this.roleService.getAll(
      (data: any) => {
        this.roles = data;
      },
      (error) => {
        console.error("Roller yüklenemedi", error);
      }
    );
  }



  async onRowClicked(event: any) {
    const user = event.data;
    if (!user) return;

    this.selectedItem = user;
    try {
      const roles: any = await this.permissionService.getRolePermissions(user.id);
      this.selectedRoles = Array.isArray(roles)
        ? roles
        : roles?.userRoles ?? [];

      this.permissionService.getRolePermissions(
        this.selectedItem.id,
        (codes) => {
          this.selectedCodes.set(codes);

          // 🔥 checkboxları güncelle
          this.matrixGridApi?.refreshCells({ force: true });

          this.loading = false;
        },
        (error) => {
          console.error('Role permission yüklenemedi', error);
          this.loading = false;
        }
      );

    } catch (err) {
      console.error("Hata:", err);
    }
  }
  // =========================
  // LOAD MATRIX
  // =========================
  loadMatrix() {
    this.loading = true;

    this.permissionService.getAll(
      (data) => {
        this.permissions.set(data);
        this.loading = false;
      },
      (error) => {
        console.error('Permission yüklenemedi', error);
        this.loading = false;
      }
    );
  }

  // =========================
  // ROLE CHANGE
  // =========================
  loadRole(roleId: string) {

    if (!roleId) {
      this.selectedCodes.set([]);
      return;
    }

    this.loading = true;

    this.permissionService.getRolePermissions(
      roleId,
      (codes) => {
        this.selectedCodes.set(codes);

        // 🔥 checkboxları güncelle
        this.rolesGridApi?.refreshCells({ force: true });

        this.loading = false;
      },
      (error) => {
        console.error('Role permission yüklenemedi', error);
        this.loading = false;
      }
    );
  }


  // =========================
  // MATRIX
  // =========================
  // matrix = computed<PermissionMatrixRow[]>(() => {
  //   const grouped = new Map<string, PermissionMatrixRow>();

  //   for (const p of this.permissions()) {
  //     if (!grouped.has(p.module)) {
  //       grouped.set(p.module, { module: p.module });
  //     }

  //     const row = grouped.get(p.module)!;
  //     row[p.actionType] = p;
  //   }

  //   return Array.from(grouped.values())
  //     .sort((a, b) => a.module.localeCompare(b.module));
  // });

  matrix = computed<PermissionMatrixRow[]>(() => {

    const modules = new Map<string, PermissionMatrixRow>();

    const actions = ['Reading', 'Writing', 'Updating', 'Deleting'];

    // 🔹 önce tüm modülleri oluştur
    for (const p of this.permissions()) {
      if (!modules.has(p.module)) {
        modules.set(p.module, {
          module: p.module,
          Reading: undefined,
          Writing: undefined,
          Updating: undefined,
          Deleting: undefined
        });
      }
    }

    // 🔹 sonra DB’den gelenleri yerleştir
    for (const p of this.permissions()) {
      const row = modules.get(p.module)!;
      row[p.actionType] = p;
    }

    return Array.from(modules.values());
  });

  // =========================
  // TOGGLE
  // =========================
  toggle(permission?: PermissionDto) {
    if (!permission) return;

    const current = this.selectedCodes();

    if (current.includes(permission.code)) {
      this.selectedCodes.set(current.filter(x => x !== permission.code));
    } else {
      this.selectedCodes.set([...current, permission.code]);
    }
  }

  // =========================
  // CHECK
  // =========================
  isChecked(permission?: PermissionDto): boolean {
    if (!permission) return false;
    return this.selectedCodes().includes(permission.code);
  }

  // =========================
  // SAVE
  // =========================
  Kaydet() {

    if (!this.selectedItem) return;
    const roleId = this.selectedItem.id;
    this.permissionService.assign(
      {
        roleId,
        permissionCodes: this.selectedCodes()
      },
      () => console.log("Kaydedildi"),
      (err) => console.error(err)
    );
  }
  activeTab: any;
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












toggleGroup(module: string, actionType: string) {

  // 🔥 o modüle ait tüm permissionlar
  const groupPermissions = this.permissions()
    .filter(p => p.module === module && p.actionType === actionType);

  const current = this.selectedCodes();

  const allSelected = groupPermissions.every(p => current.includes(p.code));

  if (allSelected) {
    // 🔴 hepsi seçili → kaldır
    const codesToRemove = groupPermissions.map(p => p.code);

    this.selectedCodes.set(
      current.filter(c => !codesToRemove.includes(c))
    );
  } else {
    // 🟢 hepsi seçili değil → hepsini ekle
    const codesToAdd = groupPermissions.map(p => p.code);

    this.selectedCodes.set([
      ...current,
      ...codesToAdd.filter(c => !current.includes(c))
    ]);
  }

  this.matrixGridApi?.refreshCells({ force: true });
}






isGroupChecked(module: string, actionType: string): boolean {

  const groupPermissions = this.permissions()
    .filter(p => p.module === module && p.actionType === actionType);

  if (!groupPermissions.length) return false;

  return groupPermissions.every(p =>
    this.selectedCodes().includes(p.code)
  );
}


}