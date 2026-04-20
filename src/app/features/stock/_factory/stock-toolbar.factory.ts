import { TableToolbar } from "../../../../libs/shared/ui/toolbar/toolbar.models";
import { StockToolbarState } from "../_state/stock-toolbar.state";


export class StockToolbarFactory {

  static grid(ctx: StockToolbarState): TableToolbar {
    return {
      left: [
        {
          type: 'button',
          key: 'ilk',
          icon: 'skip-to-start.png',
          title: 'İlk',
          action: () => ctx.headerActions?.firstPage?.(),
          disabled: () => ctx.pagination!.page === 1
        },
        {
          type: 'button',
          key: 'geri',
          icon: 'previous.png',
          title: 'Geri',
          action: () => ctx.headerActions?.prevPage?.(),
          disabled: () => ctx.pagination!.page === 1
        },
        {
          type: 'page',
          action: () => ctx.headerActions?.page?.()
        },
        {
          type: 'button',
          key: 'ileri',
          icon: 'next.png',
          title: 'İleri',
          action: () => ctx.headerActions?.nextPage?.(),
          disabled: () => ctx.pagination!.page >= ctx.pagination!.totalPages
        },
        {
          type: 'button',
          key: 'son',
          icon: 'fast-forward.png',
          title: 'Son',
          action: () => ctx.headerActions?.lastPage?.(),
          disabled: () => ctx.pagination!.page === ctx.pagination!.totalPages
        },
        {
          type: 'button',
          key: 'refresh',
          icon: 'refresh.svg',
          title: 'Refresh',
          action: () => ctx.headerActions?.refresh?.()
        },
        { type: 'separator' },
        {
          type: 'button',
          key: 'edit',
          icon: 'edit.svg',
          title: 'Düzenle',
          label: 'Düzenle',
          action: () => ctx.headerActions?.edit?.(),
          disabled: () => !ctx.hasRole?.('Admin') && !ctx.hasRole?.('Satın Alma')
        },
        {
          type: 'button',
          key: 'add',
          icon: 'add.svg',
          title: 'Yeni',
          label: 'Yeni Stok',
          action: () => ctx.headerActions?.new?.(),
          disabled: () => !ctx.hasRole?.('Admin') && !ctx.hasRole?.('Satın Alma')
        },
        {
          type: 'button',
          key: 'delete',
          icon: 'close.svg',
          title: 'Sil',
          label: 'Sil',
          action: () => ctx.headerActions?.delete?.(),
          disabled: () => !ctx.hasRole?.('Admin') && !ctx.hasRole?.('Satın Alma')
        },

      ],
      right: [
        // {
        //   type: 'button',
        //   key: 'excel',
        //   icon: 'excel.svg',
        //   title: 'excel',
        //   action: () => ctx.headerActions?.excel?.()
        // },
        // {
        //   type: 'dropdown',
        //   icon: 'setting.svg',
        //   title: 'Ayarlar',
        //   items: [
        //     { label: 'Imalat Formu Oluştur', action: () => ctx.headerActions?.createImalatFormu?.() },

        //   ]
        // }
      ]
    };
  }



  // static tabA(ctx: StockToolbarState): TableToolbar {
  //   return {
  //     left: [
  //       {
  //         type: 'button',
  //         key: 'add',
  //         icon: 'add.svg',
  //         title: 'Ekle',
  //         action: () => ctx.tabActions.new?.()
  //       },
  //       {
  //         type: 'button',
  //         key: 'add-material',
  //         icon: 'replicate-rows.png',
  //         title: 'Malzeme Ekle',
  //         action: () => ctx.tabActions.add_material?.()
  //       }
  //     ],
  //     right: []
  //   };
  // }



}
