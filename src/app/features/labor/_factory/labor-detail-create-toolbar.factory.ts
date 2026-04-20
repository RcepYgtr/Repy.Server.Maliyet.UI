
import { TableToolbar } from "../../../../libs/shared/ui/toolbar/toolbar.models";
import { LaborToolbarState } from "../_state/labor-toolbar.state";


export class LaborDetailCreateToolbarFactory {

  static grid(ctx: LaborToolbarState): TableToolbar {
    return {
      left: [
       
        {
          type: 'button',
          key: 'add',
          icon: 'add.svg',
          title: 'Yeni',
          label: 'Persenel Ata',
          action: () => ctx.headerActions?.new?.()
        },
        
      ],
      right: [
       
      ]
    };
  }




}
