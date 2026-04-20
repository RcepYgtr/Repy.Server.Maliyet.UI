

import { ColDef } from 'ag-grid-community';


export const LABOR_COLUMNS: ColDef[] = [
    { width: 150, field: 'name', headerName: 'Ad', filter: 'agTextColumnFilter', floatingFilter: true, filterParams: { suppressFloatingFilterButton: true }, },
    // { width: 150, field: 'lastName', headerName: 'Soyad', filter: 'agTextColumnFilter', floatingFilter: true, filterParams: { suppressFloatingFilterButton: true } },
    // { width: 150, field: 'departman', headerName: 'Departman', filter: 'agTextColumnFilter', floatingFilter: true, filterParams: { suppressFloatingFilterButton: true } },
    // { width: 70, field: 'totalMonthlyCost', headerName: 'Var Sayılan Maaş', filter: 'agTextColumnFilter', floatingFilter: true, filterParams: { suppressFloatingFilterButton: true } },
    
];


function formatDate(value: any) {
    if (!value) return '';
    return value.toString().split('T')[0];
}
