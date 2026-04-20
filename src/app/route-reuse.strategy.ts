import {
  ActivatedRouteSnapshot,
  DetachedRouteHandle,
  RouteReuseStrategy
} from '@angular/router';

export class CustomRouteReuseStrategy implements RouteReuseStrategy {
  private storedRoutes = new Map<string, DetachedRouteHandle>();

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    const fullPath = this.getFullPath(route);
    return !!fullPath && this.isCacheable(fullPath);
  }

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    const fullPath = this.getFullPath(route);
    if (fullPath && this.isCacheable(fullPath)) {
      this.storedRoutes.set(fullPath, handle);
      // console.log('🧩 Stored:', fullPath);
    }
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    const fullPath = this.getFullPath(route);
    return !!fullPath && this.storedRoutes.has(fullPath);
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    const fullPath = this.getFullPath(route);
    if (!fullPath) return null;
    // console.log('🔁 Retrieve:', fullPath);
    return this.storedRoutes.get(fullPath) || null;
  }

  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return future.routeConfig === curr.routeConfig;
  }

  /**
   * 🔹 Lazy-load modül hiyerarşisinden tam route path üret
   * örn: stock-rule/create
   */
  private getFullPath(route: ActivatedRouteSnapshot): string | null {
    const segments: string[] = [];

    let current: ActivatedRouteSnapshot | null = route;
    while (current) {
      if (current.routeConfig?.path) {
        segments.unshift(current.routeConfig.path);
      }
      current = current.parent;
    }

    const fullPath = segments.join('/');
    return fullPath || null;
  }

  /** 🔹 Cache edilecek path listesi */
  private isCacheable(fullPath: string): boolean {
    const reusable = [
      'stock-rule/create',
      'stock-rule/list',
      'stock-bom/create',
      'stock/list',
    ];
    return reusable.includes(fullPath);
  }
}
