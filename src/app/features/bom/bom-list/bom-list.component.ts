import { Component, OnInit } from '@angular/core';
import { BomToolbarStateService } from '../_state/bom-toolbar.state.service';
import { ToolbarHostService } from '../../../../libs/shared/ui/toolbar/toolbar-host.service';
import { TabService } from '../../../../libs/shared/ui/tabs/tab.service';
export type BomTabKey =
  | 'KABIN'
  | 'BUTON'
  | 'SUSPANSIYON'
  | 'LKARKAS'
  | 'AGIRLIKSASESI'
  | 'MAKINESASESI'
  | 'KAPI';
@Component({
  selector: 'app-bom-list',
  standalone: false,
  templateUrl: './bom-list.component.html',
  styleUrl: './bom-list.component.scss',
})
export class BomListComponent implements OnInit {
  activeTab: BomTabKey = 'KABIN';

  /**
   *
   */
  constructor(public host: ToolbarHostService, public _bomToolbarStateService: BomToolbarStateService, private tabService: TabService) {


  }


ngOnInit() {
  const ctx = this.tabService.activeTab()?.context;

  if (ctx?.pageActiveTab) {
    this.activeTab = ctx.pageActiveTab;
  }

  // fallback
  setTimeout(() => {
    const ctx2 = this.tabService.activeTab()?.context;
    if (ctx2?.pageActiveTab) {
      this.activeTab = ctx2.pageActiveTab;
    }
  });
}
onTabChanged(tab: BomTabKey) {

  if (this.activeTab === tab) return;

  this.activeTab = tab;

  this.tabService.updateActiveTabContext({
    pageActiveTab: tab   // 🔥 DOĞRU KEY
  });
}

}
