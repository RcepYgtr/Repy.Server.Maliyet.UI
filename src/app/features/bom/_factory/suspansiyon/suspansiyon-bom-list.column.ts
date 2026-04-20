

import { ColDef } from 'ag-grid-community';


export const SUSPANSİYON_BOM_LIST_COLUMNS: ColDef[] = [
    { width: 300, field: 'name', headerName: 'Askı Tipi',},
    
];


function formatDate(value: any) {
    if (!value) return '';
    return value.toString().split('T')[0];
}
