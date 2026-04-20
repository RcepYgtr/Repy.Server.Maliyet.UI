import { Type } from "@angular/core";

export interface LookupOptions<T> {
  title: string;
  smallTitle: string;
  size?: 'sm'|'md' | 'lg' | 'xl';
  cacheKey?: string;
  columnDefs: any[];
  loadFn: (filters?: any) => Promise<T[]>;
  filterComponent?: Type<any>;
  multiSelect?: boolean; // 🔥 YENİ
}
