

import { ColDef } from 'ag-grid-community';


export const ROLE_LIST_COLUMNS: ColDef[] = [
    { width: 200, field: 'name', headerName: 'Rol',},
    
];


function formatDate(value: any) {
    if (!value) return '';
    return value.toString().split('T')[0];
}
