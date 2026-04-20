import { Component } from "@angular/core";

@Component({
  selector: 'permission-checkbox',
  template: `
    <input type="checkbox"
      [checked]="checked"
      (change)="onChange()"
      [disabled]="disabled" />
  `
})
export class PermissionCheckboxComponent {

  params: any;
  checked = false;
  disabled = false;

  agInit(params: any): void {
    this.params = params;
    this.updateState();
  }

  refresh(params: any): boolean {
    this.params = params;
    this.updateState();
    return true;
  }

//  updateState() {
//   const parent = this.params.context.componentParent;

//   // 🔥 DB’de var mı?
//   const permission = this.params.value;

//   if (!permission) {
//     this.checked = false;
//     this.disabled = true;
//     return;
//   }

//   this.checked = parent.isChecked(permission);
//   this.disabled = false;
// }

updateState() {
  const parent = this.params.context.componentParent;
  const permission = this.params.value;

  if (!permission) {
    this.checked = false;
    this.disabled = true;
    return;
  }

  this.checked = parent.isGroupChecked(
    permission.module,
    permission.actionType
  );

  this.disabled = false;
}

  // onChange() {
  //   const parent = this.params.context.componentParent;

  //   parent.toggle(this.params.value);

  //   this.updateState();
  // }

  onChange() {
  const parent = this.params.context.componentParent;
  const permission = this.params.value;

  parent.toggleGroup(permission.module, permission.actionType);

  this.updateState();
}
}