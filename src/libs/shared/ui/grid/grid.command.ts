
import { TabService } from "../tabs/tab.service";
import { DefaultRowFactory } from "./default-row.factory";
import { GridState } from "./grid.state";

export class GridCommands<T extends { id: any }> {

  constructor(
    private gridKey: string,
    private state: GridState<T>,
    private loadFn: (filters?: any) => Promise<T[]>,
    private tabService: TabService,
    private createDefaultRow?: DefaultRowFactory<T>,
    private onRowAdded?: (row: T) => void
  ) { }


  selectFirstRow() {
    // const row = this.state.api.getDisplayedRowAtIndex(0);
    // if (row) {
    //   row.setSelected(true);
    // }

    

    const api = this.state.api;
    if (!api || api.isDestroyed()) return;

    let id = this.state.selectedRowId();

    // 🔥 ID yoksa → ilk satırı seç
    if (!id) {
      const firstNode = api.getDisplayedRowAtIndex(0);
      if (!firstNode) return;

      id = firstNode.data.id;

      // 🔥 STATE + TAB SERVICE SENKRON
      this.state.selectedRowId.set(id);
      this.tabService.updateGridState(this.gridKey, {
        selectedRowId: id
      });
    }

    api.getRowNode(String(id))?.setSelected(true);
  }
  async refreshFromApi(filters?: any) {
    this.state.loading.set(true);

    try {
      const data = await this.withMinDelay(this.loadFn(filters), 500);
      const api = this.state.api;
      if (!api || api.isDestroyed()) return; // 🔥 KRİTİK
      // 1️⃣ RAM
      this.state.rows.set(data);

      // 2️⃣ CACHE (FULL DATA)
      this.tabService.updateGridState(this.gridKey, {
        rows: data,
        selectedRowId: data[0]?.id ?? null
      });

      // 3️⃣ LOCAL SELECTION
      this.state.selectedRowId.set(data[0]?.id ?? null);
    }
    finally {
      this.state.loading.set(false);
    }
  }

  loadFromCache(): boolean {
    const cache = this.tabService.getGridState<any>(this.gridKey);

    if (!cache?.rows?.length) return false;

    // 🔥 RAM'e bas
    this.state.rows.set(cache.rows);
    this.state.selectedRowId.set(cache.selectedRowId ?? null);

    return true;
  }

  async removeRow(id: string | number) {
    this.state.loading.set(true);
    // 1️⃣ RAM (GridState)

    try {
      await this.delay(500);
      const current = this.state.rows();
      const index = current.findIndex(x => x.id === id);
      if (index === -1) return;

      const newRows = [
        ...current.slice(0, index),
        ...current.slice(index + 1)
      ];

      this.state.rows.set(newRows);

      // 2️⃣ Selection düzelt
      let nextSelectedId: string | number | null = null;

      if (newRows.length) {
        const next = newRows[Math.min(index, newRows.length - 1)];
        nextSelectedId = next.id;
      }

      this.state.selectedRowId.set(nextSelectedId);

      // 3️⃣ Tab cache güncelle
      this.tabService.updateGridState(this.gridKey, {
        rows: newRows,
        selectedRowId: nextSelectedId
      });

    } finally {
      this.state.loading.set(false);

    }

  }

  addDefaultRowIfEmpty() {
    if (this.state.rows().length > 0) return;
    if (!this.createDefaultRow) return;

    const row = this.createDefaultRow();

    this.state.rows.set([row]);
    this.state.selectedRowId.set(row.id);

    this.tabService.updateGridState(this.gridKey, {
      rows: [row],
      selectedRowId: row.id
    });
    // 🔥 3️⃣ HOOK: SATIR EKLENDİ
    this.onRowAdded?.(row);

  }







  private async withMinDelay<T>(promise: Promise<T>, ms = 1000): Promise<T> {
    const delay = new Promise(res => setTimeout(res, ms));
    const [result] = await Promise.all([promise, delay]);
    return result;
  }

  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
