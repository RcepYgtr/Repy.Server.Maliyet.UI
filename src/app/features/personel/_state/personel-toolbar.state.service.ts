import { Injectable } from "@angular/core";
import { TabService } from "../../../../libs/shared/ui/tabs/tab.service";
import { Subject } from "rxjs";
import { PersonelToolbarState } from "./personel-toolbar.state";

@Injectable({ providedIn: 'root' })
export class PersonelToolbarStateService {

    constructor(private tabService: TabService) { }

    ctx: PersonelToolbarState = {
        pagination: {
            page: 1,
            pageSize: 1000,
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

