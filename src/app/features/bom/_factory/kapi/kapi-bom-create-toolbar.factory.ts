import { TableToolbar } from "../../../../../libs/shared/ui/toolbar/toolbar.models";
import { BomToolbarState } from "../../_state/bom-toolbar.state";


export class KapiBomCreateToolbarFactory {

  static grid(ctx: BomToolbarState): TableToolbar {
    return {
      left: [
       
        {
          type: 'button',
          key: 'add',
          icon: 'add.svg',
          title: 'Yeni',
          label: 'Malzeme Ekle',
          action: () => ctx.headerActions?.new?.()
        },
        
      ],
      right: [
       
      ]
    };
  }




}
