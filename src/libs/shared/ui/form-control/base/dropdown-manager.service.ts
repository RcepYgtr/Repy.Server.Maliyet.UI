import { Injectable } from "@angular/core";
import { BaseDropdownComponent } from "./base-dropdown";

@Injectable({ providedIn: 'root' })
export class DropdownManagerService {
  private active: BaseDropdownComponent | null = null;

  register(dropdown: BaseDropdownComponent) {
    if (this.active && this.active !== dropdown) {
      this.active.forceClose();
    }
    this.active = dropdown;
  }

  clear(dropdown?: BaseDropdownComponent) {
    if (!dropdown || this.active === dropdown) {
      this.active = null;
    }
  }
}
