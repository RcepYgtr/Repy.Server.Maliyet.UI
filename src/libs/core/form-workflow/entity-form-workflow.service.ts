import { Injectable } from '@angular/core';
import { TabService } from '../../shared/ui/tabs/tab.service';

export interface EntityWorkflowConfig {
  listRoute: string;
  listTitle: string;
  closableList?: boolean;
}

@Injectable({ providedIn: 'root' })
export class EntityFormWorkflowService {
  constructor(private tabService: TabService) { }

  completeFormOperation(config: EntityWorkflowConfig) {
    const activeTab = this.tabService.activeTab;

    if (activeTab) {
      activeTab().dirty = false;
    }

    // 🔥 önce edit/create tabını kapat
    this.tabService.closeActiveTab(true);

    // 🔥 liste tabına git
    this.openOrActivateListTab(config);
  }

  private openOrActivateListTab(config: EntityWorkflowConfig) {
    const listTab = this.tabService.tabs().find(t =>
      t.href === config.listRoute
    );

    if (listTab) {
      this.tabService.setActive(listTab.id);
      return;
    }

    this.tabService.openTab({
      id: config.listRoute,
      title: config.listTitle,
      href: config.listRoute,
      closable: config.closableList ?? false,
      dirty: false
    });







    //İşlem sonra tabloya hemen yansıması için 
    // if (listTab) {
    //       // 🔥 KRİTİK SATIR
    //       listTab.context = {};     // ⬅️ cache sıfırlandı
    //       listTab.dirty = false;

    //       this.tabService.setActive(listTab.id);
    //       return;
    //     }

    //     this.tabService.openTab({
    //       id: config.listRoute,
    //       title: config.listTitle,
    //       href: config.listRoute,
    //       closable: config.closableList ?? false,
    //       dirty: false,
    //       context: {}               // ⬅️ temiz başlasın
    //     });





  }
}
