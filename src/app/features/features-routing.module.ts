import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
   { path: 'stock', loadChildren: () => import('./stock/stock.module').then(m => m.StockModule) },
   { path: 'bom', loadChildren: () => import('./bom/bom.module').then(m => m.BOMModule) },
   { path: 'maliyet', loadChildren: () => import('./maliyet/maliyet.module').then(m => m.MaliyetModule) },
   { path: 'personel', loadChildren: () => import('./personel/personel.module').then(m => m.PersonelModule) },
   { path: 'labor', loadChildren: () => import('./labor/labor.module').then(m => m.LaborModule) },
   { path: 'stock-group', loadChildren: () => import('./stock-group/stock-group.module').then(m => m.StockGroupModule) },
   { path: 'yonetim', loadChildren: () => import('./yonetim/yonetim.module').then(m => m.YonetimModule) },

    // { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forChild(routes)], // ✅ DOĞRU
    exports: [RouterModule]
})
export class FeaturesRoutingModule { }
