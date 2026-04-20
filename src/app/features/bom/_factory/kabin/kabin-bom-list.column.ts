

import { ColDef } from 'ag-grid-community';


export const KABIN_BOM_LIST_COLUMNS: ColDef[] = [
    { width: 300, field: 'name', headerName: 'Kabin Modeli',},
    
];


function formatDate(value: any) {
    if (!value) return '';
    return value.toString().split('T')[0];
}
