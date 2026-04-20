import { Component, OnInit } from '@angular/core';
import { ToolbarHostService } from '../../../libs/shared/ui/toolbar/toolbar-host.service';
import { BomToolbarStateService } from '../bom/_state/bom-toolbar.state.service';
import { TabService } from '../../../libs/shared/ui/tabs/tab.service';
import { YonetimToolbarStateService } from './_state/yonetim-toolbar.state.service';
export type BomTabKey =
  | 'USER'
  | 'ROLE'
  | 'PERMISSION';
@Component({
  selector: 'app-yonetim',
  standalone: false,
  templateUrl: './yonetim.component.html',
  styleUrl: './yonetim.component.scss',
})
export class YonetimComponent implements OnInit {
  activeTab: BomTabKey = 'USER';

  constructor(public host: ToolbarHostService, private tabService: TabService) {


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
