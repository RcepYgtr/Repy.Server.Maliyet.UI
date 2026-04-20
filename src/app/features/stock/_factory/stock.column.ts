

import { ColDef } from 'ag-grid-community';


export const STOCK_COLUMNS: ColDef[] = [
    { width: 150, field: 'code', headerName: 'Kod', filter: 'agTextColumnFilter', floatingFilter: true, filterParams: { suppressFloatingFilterButton: true }, },
    {
        cellRenderer: (params: any) => {
            const name = params.data?.name ?? '';

            if (params.data?.isGroup) {
                return `${name} <span style=" color: #a90c0c;font-size: 10px;font-weight: 600;"> GROUPED</span>`;
            }

            return name;
        }, width: 450, field: 'name', headerName: 'Malzeme Adı', filter: 'agTextColumnFilter', floatingFilter: true, filterParams: { suppressFloatingFilterButton: true }
    },
    { width: 70, field: 'unitCode', headerName: 'Birim', filter: 'agTextColumnFilter', floatingFilter: true, filterParams: { suppressFloatingFilterButton: true } },
    {
        width: 120,
        field: 'updatedDate',
        headerName: 'Güncelleme Tarihi',
        cellRenderer: (params: any) => {
            if (!params.value) return '';

            const date = new Date(params.value);

            const tarih = date.toLocaleDateString('tr-TR');
            const saat = date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

            return `
      <div style="
        display:flex;
        justify-content:space-between;
        width:100%;
        align-items:center; gap:10px;
      ">
        <span style="color: #410000;
    font-weight: 700;">${tarih}</span>
        <span style="opacity:0.7">${saat}</span>
      </div>
    `;
        }
    },
    {
        width: 100,
        field: 'updatedByName',
        headerName: 'Güncelleyen Personel',
        cellRenderer: (params: any) => {
            if (!params.value) return '';


            return `
      <div style="
        display:flex;
        justify-content:space-between;
        width:100%;
        align-items:center; gap:10px;
      ">
        <span style="color: #410000;
    font-weight: 700;">${params.value}</span>
      </div>
    `;
        }
    },

];


function formatDate(value: any) {
    if (!value) return '';
    return value.toString().split('T')[0];
}
