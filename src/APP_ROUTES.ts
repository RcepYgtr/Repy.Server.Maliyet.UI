export const APP_ROUTES = {

  STOCK: {
    CREATE: { id: '/features/stocks/create', href: '/features/stocks/create', title: 'Yeni Malzeme' },
    UPDATE: { id: '/features/stocks/edit', href: '/features/stocks/edit', title: 'Stok Güncelle' },
    LIST: { id: '/features/stocks', href: '/features/stocks', title: 'Malzemeler' }
  },
  WAREHOUSE: {
    CREATE: { id: '/features/warehouses/create', href: '/features/warehouses/create', title: 'Yeni Depo' },
    UPDATE: { id: '/features/warehouses/edit', href: '/features/warehouses/edit', title: 'Depo Güncelle' },
    LIST: { id: '/features/warehouses', href: '/features/warehouses', title: 'Depolar' }
  },
  WAREHOUSE_TRANSFER: {
    CREATE: { id: '/features/warehouse-transfers/create', href: '/features/warehouse-transfers/create', title: 'Yeni Depo Transferi' },
    UPDATE: { id: '/features/warehouse-transfers/edit', href: '/features/warehouse-transfers/edit', title: 'Depo Transferi Güncelle' },
    LIST: { id: '/features/warehouse-transfers', href: '/features/warehouse-transfers', title: 'Depo Transferleri' }
  },

  UNIT: {
    CREATE: { id: '/features/units/create', href: '/features/units/create', title: 'Yeni Birim' },
    UPDATE: { id: '/features/units/edit', href: '/features/units/edit', title: 'Birim Güncelle' },
    LIST: { id: '/features/units', href: '/features/units', title: 'Birimler' }
  }
} as const;
