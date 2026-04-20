import { Injectable } from "@angular/core";
export interface DirtyAware {
  isDirty(): boolean;
}
@Injectable({ providedIn: 'root' })
export class DirtyStateService {
    private dirtyMap = new Map<string, DirtyAware>();
    register(route: string, instance: DirtyAware) {
        this.dirtyMap.set(route, instance);

    }

    unregister(route: string) { this.dirtyMap.delete(route); }
    isDirty(route: string): boolean {
        const instance = this.dirtyMap.get(route);
        return instance?.isDirty() ?? false;
    }
}