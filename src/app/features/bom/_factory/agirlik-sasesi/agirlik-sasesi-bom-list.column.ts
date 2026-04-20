

import { ColDef } from 'ag-grid-community';


export const AGIRLIK_SASESI_BOM_LIST_COLUMNS: ColDef[] = [
    { width: 300, field: 'name', headerName: 'Şase Tipi',},
    
];


function formatDate(value: any) {
    if (!value) return '';
    return value.toString().split('T')[0];
}
