import {
  Component,
  forwardRef,
  Input
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR
} from '@angular/forms';

@Component({
  selector: 'base-checkbox',
  standalone: false,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true
    }
  ],
  template: `
    <div class="iwb-row">
      <div class="iwb-label"></div>

      <div class="iwb-field d-flex align-items-center">
        <!-- <input
          type="checkbox"
          class="me-2"
          [checked]="value"
          [disabled]="disabled"
          (change)="toggle($event)"
          (blur)="markTouched()"
        />
        {{ label }} -->

        <label class="corp-checkbox">
                        <input type="checkbox" 
          [disabled]="disabled"
           [checked]="checked"
    [disabled]="disabled"
    (change)="toggle($event.target.checked)">
                        <span class="box"></span>
                        <span class="text">{{ label }}</span>
                    </label>
      </div>
    </div>


<!-- <label class="corp-checkbox">
                        <input type="checkbox" [checked]="value"
          [disabled]="disabled"
          (change)="toggle($event)"
          (blur)="markTouched()">
                        <span class="box"></span>
                        <span class="text">{{ label }}</span>
                    </label> -->




  `,
  styles: [`@use "input-form";
    
    

.corp-checkbox {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  user-select: none;

  input {
    display: none;
  }

  .box {
    width: 26px;
    height: 26px;
    border: 2px solid #7cc3d0;
    border-radius: 4px;
    position: relative;
    transition: all .2s;
  }

  input:checked + .box {
    background: #0b6b88;
    border-color: #0b6b88;
  }

  input:checked + .box::after {
    content: '✔';
    color: #fff;
    font-size: 12px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .text {
    font-size: 14px;
    color: #535657;
    font-weight: 500;
  }
}

    `


  ]
})
export class CheckboxComponent implements ControlValueAccessor {

  @Input() label = '';

  // 🔥 OPSİYONEL MOD
  @Input() valueMode: 'boolean' | 'string' = 'boolean';

  // string mode için
  @Input() trueValue: any = 'OK';
  @Input() falseValue: any = null;

  checked = false;
  disabled = false;

  private onChange = (_: any) => {};
  private onTouched = () => {};

  writeValue(value: any): void {
    if (this.valueMode === 'string') {
      this.checked = value === this.trueValue;
    } else {
      this.checked = !!value;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  toggle(checked: boolean) {
    this.checked = checked;

    if (this.valueMode === 'string') {
      this.onChange(checked ? this.trueValue : this.falseValue);
    } else {
      this.onChange(checked);
    }

    this.onTouched();
  }
}
