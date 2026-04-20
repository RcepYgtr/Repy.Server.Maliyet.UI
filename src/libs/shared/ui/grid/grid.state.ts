import { computed, signal, WritableSignal } from '@angular/core';
import { GridApi } from 'ag-grid-community';
import { GridRuleResult } from './rules/grid-rule.result';

export class GridState<T extends { id: string | number }> {

  // api!: GridApi;

  // rows: WritableSignal<T[]> = signal([]);
  // selectedRowId: WritableSignal<string | number | null> = signal(null);
  // // 🔥 TAM SEÇİLİ SATIR
  // selectedRow = computed<T | null>(() => {
  //   const id = this.selectedRowId();
  //   if (id == null) return null;
  //   return this.rows().find(r => r.id === id) ?? null;
  // });
  // loading = signal(false);

  // dirtyRows = signal<Set<string | number>>(new Set());

  // markDirty(id: string | number) {
  //   this.dirtyRows.update(s => new Set(s).add(id));
  // }

  // clearDirty() {
  //   this.dirtyRows.set(new Set());
  // }

  // isDirty(id: string | number) {
  //   return this.dirtyRows().has(id);
  // }











  // errors = signal<Record<
  //   string | number,
  //   Record<string, string>
  // >>({});

  // setErrors(rowId: string | number, errors: Record<string, string>) {
  //   this.errors.update(e => ({
  //     ...e,
  //     [rowId]: errors
  //   }));
  // }

  // clearErrors(rowId: string | number) {
  //   this.errors.update(e => {
  //     const copy = { ...e };
  //     delete copy[rowId];
  //     return copy;
  //   });
  // }

  // hasError(rowId: string | number, field: string): boolean {
  //   return !!this.errors()[rowId]?.[field];
  // }







  rows = signal<T[]>([]);
  loading = signal(false);
  selectedRowId = signal<string | number | null>(null);
  selectedRow = computed<T | null>(() => {
    const id = this.selectedRowId();
    if (id == null) return null;
    return this.rows().find(r => r.id === id) ?? null;
  });

  // 🔥 rowId -> field -> message
  private errorMap = new Map<string | number, Record<string, string>>();

  // 🔥 dirty rows
  private dirtyRows = new Set<string | number>();

  api!: GridApi<T>;

  /* ================= ERRORS ================= */


  private errors = new Map<string | number, Record<string, GridRuleResult>>();

  setErrors(rowId: string | number, results: GridRuleResult[]) {
    const map: Record<string, GridRuleResult> = {};
    results.forEach(r => map[r.field] = r);
    this.errors.set(rowId, map);
  }

  clearErrors(rowId: string | number) {
    this.errors.delete(rowId);
  }

  hasError(rowId: any, field: string): boolean {
    return this.errors.get(rowId)?.[field]?.severity === 'error';
  }

  hasWarning(rowId: any, field: string): boolean {
    return this.errors.get(rowId)?.[field]?.severity === 'warning';
  }
  hasInfo(rowId: any, field: string): boolean {
    return this.errors.get(rowId)?.[field]?.severity === 'info';
  }

  getRuleResult(rowId: any, field: string): GridRuleResult | null {
    return this.errors.get(rowId)?.[field] ?? null;
  }

  hasAnyError(): boolean {
    for (const row of this.errors.values()) {
      for (const r of Object.values(row)) {
        if (r.severity === 'error') return true;
      }
    }
    return false;
  }



  /* ================= DIRTY ================= */

  markDirty(rowId: string | number) {
    this.dirtyRows.add(rowId);
  }

  isDirty(rowId: string | number): boolean {
    return this.dirtyRows.has(rowId);
  }

  clearDirty() {
    this.dirtyRows.clear();
  }












}
