import { TableToolbar } from "../../../../libs/shared/ui/toolbar/toolbar.models";
import { PersonelToolbarState } from "../_state/personel-toolbar.state";

export class PersonelToolbarFactory {

  static grid(ctx: PersonelToolbarState): TableToolbar {
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
          disabled: () =>ctx.pagination!.page >= ctx.pagination!.totalPages
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
          action: () => ctx.headerActions?.edit?.()
        },
        {
          type: 'button',
          key: 'add',
          icon: 'add.svg',
          title: 'Yeni',
          label: 'Yeni Personel',
          action: () => ctx.headerActions?.new?.()
        },
        {
          type: 'button',
          key: 'delete',
          icon: 'close.svg',
          title: 'Sil',
          label: 'Sil',
          action: () => ctx.headerActions?.delete?.()
        },
        
       
        {
          type: 'dropdown',
          icon: 'ellipsis.png',
          title: 'Ayarlar',
          items: [
           // { label: 'Imalat Formu Oluştur', icon: 'create-document.png', action: () => ctx.headerActions?.createImalatFormu?.() },
          ]
        }
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



  // static tabA(ctx: PersonelToolbarState): TableToolbar {
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
