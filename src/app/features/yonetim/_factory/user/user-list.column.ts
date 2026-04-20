

import { ColDef } from 'ag-grid-community';


export const USER_LIST_COLUMNS: ColDef[] = [
    { width: 150, field: 'userName', headerName: 'Kullanıcı',},
    { width: 200, field: 'email', headerName: 'Email',},
    
];


function formatDate(value: any) {
    if (!value) return '';
    return value.toString().split('T')[0];
}
