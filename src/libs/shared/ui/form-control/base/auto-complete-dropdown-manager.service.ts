import { Injectable } from "@angular/core";
import { BaseDropdownComponent } from "./base-dropdown";
import { BaseAutoCompleteDropdownComponent } from "./base-auto-complete-dropdown";

@Injectable({ providedIn: 'root' })
export class AutoCompleteDropdownManagerService {
  private active: BaseAutoCompleteDropdownComponent | null = null;

  register(dropdown: BaseAutoCompleteDropdownComponent) {
    if (this.active && this.active !== dropdown) {
      this.active.forceClose();
    }
    this.active = dropdown;
  }

  clear(dropdown?: BaseAutoCompleteDropdownComponent) {
    if (!dropdown || this.active === dropdown) {
      this.active = null;
    }
  }
}
