import { Injectable } from "@angular/core";
import { ModalService } from "../../../core/modal/modal.service";
import { LookupOptions } from "./lookup.models";
import { LookupDialogComponent } from "./lookup-dialog";
import { DROPDOWN_DATA } from "../../../../DROPDOWN-DATA";

@Injectable({ providedIn: 'root' })
export class LookupService {

  constructor(private modal: ModalService) { }

  // lookup.service.ts
  async select<T>(options: LookupOptions<T>): Promise<T | null> {

    const ref = this.modal.open(
      LookupDialogComponent,
      { size: options.size ?? 'lg' },
      {
        title: options.title,
        smallTitle: options.smallTitle,
        columnDefs: options.columnDefs,
        loadFn: options.loadFn,
        cacheKey: options.cacheKey,
        filterComponent: options.filterComponent,
        multiSelect: options.multiSelect ?? false // 🔥
      }
    );

    try {
      return await ref.result;
    } catch {
      return null;
    }
  }

  getList(key: keyof typeof DROPDOWN_DATA) {
    console.log(DROPDOWN_DATA);
    return DROPDOWN_DATA[key] ?? [];
  }

}
