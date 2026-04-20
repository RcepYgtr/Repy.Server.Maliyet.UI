import { Component } from '@angular/core';
import { TabService } from '../../../../libs/shared/ui/tabs/tab.service';
export type MaliyetTabKey =
  | 'KABIN'
  | 'BUTON'
  | 'SUSPANSIYON'
  | 'LKARKAS'
  | 'AGIRLIKSASESI'
  | 'MAKINESASESI'
  | 'KAPI';
@Component({
  selector: 'app-maliyet-grafik',
  standalone: false,
  templateUrl: './maliyet-grafik.component.html',
  styleUrl: './maliyet-grafik.component.scss',
})
export class MaliyetGrafikComponent {
 activeTab: MaliyetTabKey = 'KABIN';
  
    /**
     *
     */
    constructor( private tabService: TabService) {
  
  
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
  onTabChanged(tab: MaliyetTabKey) {
  
    if (this.activeTab === tab) return;
  
    this.activeTab = tab;
  
    this.tabService.updateActiveTabContext({
      pageActiveTab: tab   // 🔥 DOĞRU KEY
    });
  }
  
  }
  