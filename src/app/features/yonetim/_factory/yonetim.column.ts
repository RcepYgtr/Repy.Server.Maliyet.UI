

import { ColDef } from 'ag-grid-community';


export const YONETIM_COLUMNS: ColDef[] = [
    { width: 150, field: 'code', headerName: 'Kod', filter: 'agTextColumnFilter', floatingFilter: true, filterParams: { suppressFloatingFilterButton: true }, },
    { width: 450, field: 'name', headerName: 'Malzeme Adı', filter: 'agTextColumnFilter', floatingFilter: true, filterParams: { suppressFloatingFilterButton: true } },
    { width: 70, field: 'unitCode', headerName: 'Birim', filter: 'agTextColumnFilter', floatingFilter: true, filterParams: { suppressFloatingFilterButton: true } },
    
];


function formatDate(value: any) {
    if (!value) return '';
    return value.toString().split('T')[0];
}
