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
    selector: 'base-radio',
    standalone: false,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => RadioComponent),
            multi: true
        }
    ],
    template: `
    <label class="corp-checkbox">
      <input
        type="radio"
        [name]="name"
        [checked]="checked"
        [disabled]="disabled"
        (change)="select()"
      />

      <span class="box"></span>
      <span class="text">{{ label }}</span>
    </label>
  `,
    styles: [`
    .corp-checkbox {
      display: flex;
      align-items: center;
      gap: 10px;
      margin: 5px 0;
      cursor: pointer;

      input {
        display: none;
      }

      .box {
        width: 20px;
        height: 20px;
        border: 2px solid #7cc3d0;
        border-radius: 4px; /* 🔥 kare kalıyor */
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
  `]
})
export class RadioComponent implements ControlValueAccessor {

    @Input() label = '';
    @Input() value: any;      // 🔥 bu radio’nun değeri
    @Input() name = '';       // 🔥 group için şart

    checked = false;
    disabled = false;

    private onChange = (_: any) => { };
    private onTouched = () => { };

    writeValue(obj: any): void {
        this.checked = obj === this.value;
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

    select() {
        this.checked = true;
        this.onChange(this.value);
        this.onTouched();
    }
}