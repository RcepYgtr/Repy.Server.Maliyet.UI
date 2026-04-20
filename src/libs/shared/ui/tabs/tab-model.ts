

export interface GridCacheState<T = any> {
  rows?: T[]; // 🔥 FULL DATA
  selectedRowId?: string | number | null;
  dirtyRowIds?: (string | number)[];
  filterModel?: any;   // 🔥 düzelt
  sortModel?: any;     // 🔥 düzelt
  columnState?: any;   // 🔥 EKLE
  totalPages?: number;
  totalCount?: number;
}



export interface ListState<T> {
  rowData?: T[];
  selectedRowId?: string | number;
}




export interface TabContext {
  /** 🔥 gridKey → grid state */
  grids?: Record<string, GridCacheState>;
  formState?: any;
  formInitialized?: boolean;
  filterState?: any;
  data?: any;
  pageActiveTab?:any;
  parentTabId?:any;
}

export interface TabItem {
  id: string;
  title: string;
  href: string;
  closable: boolean;
  dirty?: boolean;
  loading?: boolean;
  context?: TabContext;
  canClose?: () => boolean;
}

export interface PersistedTabState {
  version: number;
  activeId: string;
  tabs: TabItem[];
}

