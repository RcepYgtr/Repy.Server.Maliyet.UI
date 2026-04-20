import {
    Component,
    Input,
    Optional,
    Self
} from '@angular/core';
import {
    ControlValueAccessor,
    NgControl
} from '@angular/forms';

@Component({
    selector: 'base-input',
    standalone: false,
    template: `
<div
  class="iwb-row"
  [class.has-error]="showError"
  [class.has-accent]="accentEnabled"
  [class.is-disabled]="disabled"
>
  <div class="iwb-label">{{ label }}</div>

  <div class="iwb-field" [ngClass]="gridClass">
    <input
      class="iwb-input"
      [type]="type"
      [value]="value"
      [readOnly]="readonly"
      (input)="onInput($event.target.value)"
      (blur)="markTouched()"
    />
    <span class="iwb-error-icon" *ngIf="showError">!</span>
  </div>
</div>
`,
    styles: [`@use "input-form";
    
    .disabled {
  opacity: 0.4;
  pointer-events: none; // 👈 Tıklamayı tamamen engeller
  cursor: not-allowed;
}`]
})
export class BaseInputComponent implements ControlValueAccessor {

    @Input() label = '';
    @Input() readonly = false;
    @Input() type: 'text' | 'number' | 'password' |'date'= 'text';
    @Input() hasAccent: boolean | '' = false;

    value: any = '';
    disabled = false;
    @Input() grid = 10;

    get gridClass() {
        return `iwb-span-${this.grid}`;
    }
    constructor(
        @Optional()
        @Self()
        public ngControl: NgControl
    ) {
        // 🔥 KRİTİK SATIR
        if (this.ngControl) {
            this.ngControl.valueAccessor = this;
        }
    }

    get accentEnabled(): boolean {
        return this.hasAccent !== false;
    }

    get showError(): boolean {
        return !!(
            this.ngControl &&
            this.ngControl.invalid &&
            (this.ngControl.touched || this.ngControl.dirty)
        );
    }

    private onChange = (_: any) => { };
    private onTouched = () => { };

    // writeValue(value: any): void {
    //     this.value = value ?? '';
    // }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    onInput(value: any) {
        this.value = value;
        this.onChange(value);
    }

    markTouched() {
        this.onTouched();
    }



writeValue(value: any): void {
  if (this.type === 'date' && value) {
    const d = new Date(value);
    this.value = isNaN(d.getTime())
      ? ''
      : d.toISOString().substring(0, 10);
    return;
  }

  this.value = value ?? '';
}














}
