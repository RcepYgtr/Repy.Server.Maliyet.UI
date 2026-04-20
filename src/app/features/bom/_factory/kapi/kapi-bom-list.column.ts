

import { ColDef } from 'ag-grid-community';


export const KAPI_BOM_LIST_COLUMNS: ColDef[] = [
    { width: 300, field: 'name', headerName: 'Tür',},
    
];


function formatDate(value: any) {
    if (!value) return '';
    return value.toString().split('T')[0];
}
