import { Injectable, effect, signal, computed } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { debounceTime, filter, Subject } from 'rxjs';
import { GridCacheState, PersistedTabState, TabItem } from './tab-model';

const TAB_STATE_KEY = 'repy_erp_tabs';
const ACTIVE_TAB_KEY = 'repy_erp_active_tab';

const HOME_TAB: TabItem = {
  id: '/home',
  title: 'Anasayfa',
  href: '/home',
  closable: false,
  dirty: false
};

@Injectable({ providedIn: 'root' })
export class TabService {

  // =========================
  // STATE (SIGNALS)
  // =========================

  readonly tabs = signal<TabItem[]>([]);
  readonly activeTabId = signal<string>(HOME_TAB.id);

  // =========================
  // DERIVED STATE
  // =========================

  readonly activeTab = computed<TabItem>(() => {
    return this.tabs().find(t => t.id === this.activeTabId()) ?? HOME_TAB;
  });
  private persistTrigger = new Subject<void>();
  // constructor(private router: Router) {

  //   this.restore();

  //   this.router.events
  //     .pipe(filter(e => e instanceof NavigationEnd))
  //     .subscribe((e: NavigationEnd) => {
  //       this.syncActiveTabWithUrl(e.urlAfterRedirects);
  //     });

  //   // 🔥 Otomatik persist
  //   effect(() => {
  //     // sessionStorage.setItem(TAB_STATE_KEY, JSON.stringify(this.tabs()));
  //     // sessionStorage.setItem(ACTIVE_TAB_KEY, this.activeTabId());
  //     effect(() => {
  //       this.tabs();
  //       this.activeTabId();
  //       this.persistTrigger.next();
  //     });

  //     this.persistTrigger
  //       .pipe(debounceTime(300))
  //       .subscribe(() => {
  //         this.saveToSession();
  //       });
  //   });
  // }

  constructor(private router: Router) {

    this.restore();

    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: NavigationEnd) => {
        this.syncActiveTabWithUrl(e.urlAfterRedirects);
      });

    // 1️⃣ Signal değişimini dinle
    effect(() => {
      this.tabs();
      this.activeTabId();
      this.persistTrigger.next();
    });

    // 2️⃣ Debounce ile yaz
    this.persistTrigger
      .pipe(debounceTime(300))
      .subscribe(() => {
        this.saveToSession();
      });
  }

  private saveToSession() {

    const tabsToSave = this.tabs().filter(t => t.id !== HOME_TAB.id);

    const payload: PersistedTabState = {
      version: 1,
      activeId: this.activeTabId(),
      tabs: tabsToSave
    };

    sessionStorage.setItem(
      TAB_STATE_KEY,
      JSON.stringify(payload)
    );
  }

  // =========================
  // TAB ACTIONS
  // =========================

  openTab(tab: TabItem) {
    const id = tab.href;
    const existing = this.tabs().find(t => t.id === id);

    if (existing) {
      this.setActive(id);
      return;
    }

    const newTab: TabItem = {
      ...tab,
      id,
      loading: true
    };

    this.tabs.update(tabs => [...tabs, newTab]);
    this.setActive(id);
  }

  // closeTab(id: string, force = false) {
  //   const tab = this.tabs().find(t => t.id === id);
  //   if (!tab || !tab.closable) return;

  //   if (!force && tab.canClose && !tab.canClose()) {
  //     if (!confirm('Kaydedilmemiş değişiklikler var. Kapatmak istiyor musunuz?')) {
  //       return;
  //     }
  //   }

  //   this.tabs.update(tabs => {
  //     const remaining = tabs.filter(t => t.id !== id);
  //     return remaining.length ? remaining : [HOME_TAB];
  //   });

  //   const next = this.tabs().at(-1) ?? HOME_TAB;
  //   this.setActive(next.id);
  // }

  closeTab(id: string, force = false) {
    const tab = this.tabs().find(t => t.id === id);
    if (!tab || !tab.closable) return;

    if (!force && tab.canClose && !tab.canClose()) {
      if (!confirm('Kaydedilmemiş değişiklikler var. Kapatmak istiyor musunuz?')) {
        return;
      }
    }

    const parentId = tab.context?.parentTabId;

    this.tabs.update(tabs => {
      const remaining = tabs.filter(t => t.id !== id);
      return remaining.length ? remaining : [HOME_TAB];
    });

    // 🔥 KRİTİK: parent varsa ona dön
    if (parentId && this.tabs().some(t => t.id === parentId)) {
      this.setActive(parentId);
      return;
    }

    // fallback
    const next = this.tabs().at(-1) ?? HOME_TAB;
    this.setActive(next.id);
  }

  closeActiveTab(force = false) {
    this.closeTab(this.activeTabId(), force);
  }

  updateActiveTabContext(context: any) {
    const id = this.activeTabId();

    this.tabs.update(tabs =>
      tabs.map(t =>
        t.id === id
          ? { ...t, context: { ...t.context, ...context } }
          : t
      )
    );
  }

  updateGridState(gridKey: string, partial: any) {
    const tab = this.activeTab();

    this.updateActiveTabContext({
      grids: {
        ...tab.context?.grids,
        [gridKey]: {
          ...tab.context?.grids?.[gridKey],
          ...partial
        }
      }
    });
  }


  // =========================
  // ACTIVE TAB
  // =========================

  setActive(id: string) {
    this.activeTabId.set(id);

    if (this.router.url !== id) {
      this.router.navigateByUrl(id);
    }
  }

  private setActiveSilent(id: string) {
    this.activeTabId.set(id);
  }

  private syncActiveTabWithUrl(url: string) {
    const clean = url.split('?')[0];
    const tab = this.tabs().find(t => t.id === clean);

    if (tab) {
      this.activeTabId.set(tab.id);
    }
  }

  // =========================
  // RESTORE
  // =========================



  // private restore() {

  //   const raw = sessionStorage.getItem(TAB_STATE_KEY);

  //   let restoredTabs: TabItem[] = [];

  //   if (raw) {
  //     const parsed: PersistedTabState = JSON.parse(raw);

  //     if (parsed.version === 1 && parsed.tabs?.length) {
  //       restoredTabs = parsed.tabs;
  //     }
  //   }

  //   // 🔥 HOME daima başta
  //   const finalTabs = [
  //     HOME_TAB,
  //     ...restoredTabs.filter(t => t.id !== HOME_TAB.id)
  //   ];

  //   this.tabs.set(finalTabs);

  //   const activeIdFromStorage = raw
  //     ? JSON.parse(raw).activeId
  //     : null;

  //   const idToActivate =
  //     finalTabs.some(t => t.id === activeIdFromStorage)
  //       ? activeIdFromStorage
  //       : HOME_TAB.id;

  //   this.activeTabId.set(idToActivate);
  // }

  private restore() {

    const raw = sessionStorage.getItem(TAB_STATE_KEY);

    let restoredTabs: TabItem[] = [];

    if (raw) {
      const parsed: PersistedTabState = JSON.parse(raw);

      if (parsed.version === 1 && parsed.tabs?.length) {
        restoredTabs = parsed.tabs;
      }
    }

    const finalTabs = [
      HOME_TAB,
      ...restoredTabs.filter(t => t.id !== HOME_TAB.id)
    ];

    this.tabs.set(finalTabs);

    const activeIdFromStorage = raw
      ? JSON.parse(raw).activeId
      : null;

    const idToActivate =
      finalTabs.some(t => t.id === activeIdFromStorage)
        ? activeIdFromStorage
        : HOME_TAB.id;

    // 🔥 SADECE SET ETME
    this.activeTabId.set(idToActivate);

    // 🔥 ROUTER'I DE TETİKLE
    if (this.router.url !== idToActivate) {
      this.router.navigateByUrl(idToActivate);
    }
  }






  //==============

  getSelectedRowId(gridKey: string) {
    return computed(() => {
      const tab = this.activeTab();
      return tab.context?.grids?.[gridKey]?.selectedRowId ?? null;
    });
  }

  getGridState<T = any>(gridKey: string): GridCacheState<T> | null {
    return this.activeTab().context?.grids?.[gridKey] ?? null;
  }


  private gridRefreshRequests = new Map<string, (payload?: any) => void>();
  private pendingGridRefresh = new Set<string>();

  registerGridRefresh(key: string, fn: (payload?: any) => void) {
    this.gridRefreshRequests.set(key, fn);

    if (this.pendingGridRefresh.has(key)) {
      this.pendingGridRefresh.delete(key);
      fn();
    }
  }


  requestGridRefresh(key: string, payload?: any) {
    const fn = this.gridRefreshRequests.get(key);
    fn ? fn(payload) : this.pendingGridRefresh.add(key);
  }
  unregisterGridRefresh(key: string) {
    this.gridRefreshRequests.delete(key);
    this.pendingGridRefresh.delete(key);

  }


  clearGridState(gridKey: string) {
    const tab = this.activeTab();

    if (!tab.context?.grids?.[gridKey]) return;

    const newGrids = { ...tab.context.grids };
    delete newGrids[gridKey];

    this.updateActiveTabContext({
      grids: newGrids
    });
  }
  resetAll() {

    // session storage temizle
    sessionStorage.removeItem('repy_erp_tabs');

    // state sıfırla
    this.tabs.set([
      {
        id: '/home',
        title: 'Anasayfa',
        href: '/home',
        closable: false,
        dirty: false
      }
    ]);

    this.activeTabId.set('/home');
  }

}
