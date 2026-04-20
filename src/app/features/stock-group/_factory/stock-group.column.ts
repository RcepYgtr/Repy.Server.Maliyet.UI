

import { ColDef } from 'ag-grid-community';


export const STOCK_GROUP_COLUMNS: ColDef[] = [
    { width: 250, field: 'name', headerName: 'Grup Adı', filter: 'agTextColumnFilter', floatingFilter: true, filterParams: { suppressFloatingFilterButton: true }, },
    {
        width: 150, field: 'unitCost', headerName: 'Birim Fiyat', filter: 'agTextColumnFilter', floatingFilter: true, filterParams: { suppressFloatingFilterButton: true },
        valueParser: (p: any) => Number(p.newValue) || 0,
        valueFormatter: (p: any) => {
            const value = Number(p.value);

            if (!value) return '-';

            return value.toLocaleString('tr-TR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }) + ' ₺';
        }
    },


];


function formatDate(value: any) {
    if (!value) return '';
    return value.toString().split('T')[0];
}
