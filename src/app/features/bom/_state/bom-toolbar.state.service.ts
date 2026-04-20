import { Injectable } from "@angular/core";
import { TabService } from "../../../../libs/shared/ui/tabs/tab.service";
import { Subject } from "rxjs";
import { BomToolbarState } from "./bom-toolbar.state";

@Injectable({ providedIn: 'root' })
export class BomToolbarStateService {

    constructor(private tabService: TabService) { }

    ctx: BomToolbarState = {
        pagination: {
            page: 1,
            pageSize: 100,
            totalPages: 1,
            totalCount: 0
        },
        tabActions: {},
        headerActions: {},
    };


  private refreshSource = new Subject<void>();
  refresh$ = this.refreshSource.asObservable();

  triggerRefresh() {
    this.refreshSource.next();
  }
}

