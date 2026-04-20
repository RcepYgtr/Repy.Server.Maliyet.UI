
import { TableToolbar } from "../../../../libs/shared/ui/toolbar/toolbar.models";
import { StockGroupToolbarState } from "../_state/stock-group-toolbar.state";


export class StockGroupDetailCreateToolbarFactory {

  static grid(ctx: StockGroupToolbarState): TableToolbar {
    return {
      left: [
       
        {
          type: 'button',
          key: 'add',
          icon: 'add.svg',
          title: 'Yeni',
          label: 'Stok Ekle',
          action: () => ctx.headerActions?.new?.()
        },
        
      ],
      right: [
       
      ]
    };
  }




}
