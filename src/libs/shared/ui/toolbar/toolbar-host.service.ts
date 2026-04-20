import { Injectable, signal, computed } from '@angular/core';
import { TableToolbar } from './toolbar.models';


export type HostTab = {
  id: string;
  title: string;
  closable?: boolean;
};

export interface TabToolbarConfig {
  toolbarFactory: (ctx: any) => TableToolbar;
  data?: any;
}

@Injectable()
export class ToolbarHostService {

  /* ---------------- TAB ---------------- */

  tabs = signal<HostTab[]>([]);
  activeTab = signal<string | null>(null);

  private tabContexts = signal<Record<string, TabToolbarConfig>>({});

  /* ---------------- TOOLBARS ---------------- */

  headerToolbar = signal<TableToolbar | null>(null);

  tabToolbar = computed<TableToolbar | null>(() => {
    const tabId = this.activeTab();
    if (!tabId) return null;

    const ctx = this.tabContexts()[tabId];
    if (!ctx) return null;

    return ctx.toolbarFactory(ctx.data);
  });

  /* ---------------- API ---------------- */

  registerTabs(tabs: { tab: HostTab; context: TabToolbarConfig }[]) {
    const map: Record<string, TabToolbarConfig> = {};
    tabs.forEach(t => map[t.tab.id] = t.context);

    this.tabs.set(tabs.map(t => t.tab));
    this.tabContexts.set(map);
  }

  setHeaderToolbar(toolbar: TableToolbar) {
    this.headerToolbar.set(toolbar);
  }

  setActiveTab(id: string) {
    this.activeTab.set(id);

    const ctx = this.tabContexts()[id]?.data;
    ctx?.onTabActivated?.(id);
  }

  reset() {
    this.tabs.set([]);
    this.tabContexts.set({});
    this.activeTab.set(null);
    this.headerToolbar.set(null);
  }
}


