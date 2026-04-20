
import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ElementRef,
  forwardRef,
  OnInit
} from '@angular/core';
import { DropdownManagerService } from './dropdown-manager.service';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseAutoCompleteDropdownComponent } from './base-auto-complete-dropdown';
import { LookupService } from '../../lookup/lookup.service';

@Component({
  selector: 'base-dropdown',
  standalone: false,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => BaseDropdownComponent),
      multi: true
    }
  ],
  template: `
<div
  class="iwb-row"
  [class.has-error]="showError"
  [class.has-accent]="accentEnabled"
  [class.has-lookup]="lookupEnabled"
  [class.is-disabled]="disabled">
  <div class="iwb-label">{{ label }}</div>
  <div class="iwb-field" [ngClass]="gridClass">
    <div class="iwb-dropdown" (click)="$event.stopPropagation()">
      <div class="iwb-lookup">
        <input
          class="iwb-lookup-input"
          [value]="selectedText || placeholder"
          readonly
          (click)="toggle()"
          (blur)="blur.emit()"
          [class.placeholder]="!selectedText"
        />

        <div class="iwb-lookup-actions">
          <span
            class="iwb-icon-btn"
            *ngIf="hasValue"
            (click)="clear()"
          >✕</span>
          <span class="iwb-icon-btn" (click)="toggle()">▾</span>


          <span
            class="iwb-icon-btn iwb-add-btn"
            *ngIf="allowAdd && !disabled"
            (click)="addClick.emit()"
          >＋</span>
        </div>
      </div>

      <div
        class="iwb-dropdown-panel"
        *ngIf="open"
        #panel
      >
        <div
          class="iwb-dropdown-item"
          *ngFor="let item of items"
          (click)="select(item)"
        >
          {{ item[displayField] }}
        </div>
      </div>

      <span class="iwb-error-icon" *ngIf="showError">!</span>
    </div>
  </div>
</div>

`,
  styles: [`@use "input-form"; 


   .iwb-lookup-input.placeholder {
      color: #9ca3af;
    }

    .iwb-row.is-disabled {
      opacity: .6;
      pointer-events: none;
    } 
    .iwb-dropdown-panel {
  max-height: 240px;
  overflow-y: auto;
  box-shadow: 0 8px 20px rgba(0,0,0,.15);
}

.iwb-dropdown-panel.open-up {
  box-shadow: 0 -8px 20px rgba(0,0,0,.15);
}




.iwb-dropdown-panel {
  animation: dropdownFade .12s ease-out;
}

@keyframes dropdownFade {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.iwb-dropdown-panel.open-up {
  animation: dropdownFadeUp .12s ease-out;
}

@keyframes dropdownFadeUp {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}



`]
})
export class BaseDropdownComponent implements ControlValueAccessor, OnChanges, OnInit {

  /* ===== DATA ===== */
  @Input() items: any[] = [];
  @Input() displayField!: string;
  @Input() valueField!: string;
  @Input() label = '';

  /* ===== STATE ===== */
  @Input() selectedValue: any = null;
  @Input() placeholder = 'Seçiniz';
  @Input() disabled = false;

  /* ===== UI FLAGS ===== */
  @Input() showError = false;
  @Input() hasLookup: boolean | '' = false;
  @Input() hasAccent: boolean | '' = false;
  @Input() allowAdd = true; // 🔥 YENİ

  /* ===== GRID ===== */
  @Input() grid = 10;

  /* ===== EVENTS ===== */
  @Output() selectChange = new EventEmitter<any>();
  @Output() clearChange = new EventEmitter<void>();
  @Output() addClick = new EventEmitter<void>();
  @Output() blur = new EventEmitter<void>();


  @ViewChild('panel') panelRef!: ElementRef;

  open = false;
  selectedText = '';



  constructor(private el: ElementRef<HTMLElement>, private dropdownManager: DropdownManagerService, private lookupService: LookupService) { }
  ngOnInit() {
    if (this.listKey) {
      this.items = this.lookupService.getList(this.listKey as any);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // 🔥 listKey değişirse listeyi yükle
    if (changes['listKey'] && this.listKey) {
      this.items = this.lookupService.getList(this.listKey as any);
    }
    if ((changes['items'] || changes['selectedValue']) && this.items?.length) {
      const found = this.items.find(
        x => x[this.valueField] === this.selectedValue
      );
      this.selectedText = found ? found[this.displayField] : '';
    }

    if (changes['selectedValue'] && this.selectedValue == null) {
      this.selectedText = '';
    }
  }










  get hasValue(): boolean {
    return !!this._value;
  }

  get lookupEnabled(): boolean {
    return this.hasLookup !== false;
  }

  get accentEnabled(): boolean {
    return this.hasAccent !== false;
  }

  get gridClass() {
    return `iwb-span-${this.grid}`;
  }
  private _listKey?: string;

  @Input()
  set listKey(value: string | undefined) {
    this._listKey = value;

    if (value) {
      this.items = this.lookupService.getList(value as any);
      this.resolveSelectedText(); // 🔥 önemli
    }
  }

  get listKey() {
    return this._listKey;
  }













  private _value: any = null;

  private onChange = (_: any) => { };
  private onTouched = () => { };

  writeValue(value: any): void {
    this._value = value;
    this.resolveSelectedText();
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
  private resolveSelectedText() {
    if (!this._value || !this.items?.length) {
      this.selectedText = '';
      return;
    }

    const found = this.items.find(
      x => x[this.valueField] === this._value
    );

    this.selectedText = found
      ? found[this.displayField]
      : '';
  }


  updatePosition() {
    const trigger = this.el.nativeElement.querySelector('.iwb-lookup');
    const panel = this.panelRef.nativeElement;

    const rect = trigger.getBoundingClientRect();
    const panelHeight = panel.offsetHeight;
    const viewportHeight = window.innerHeight;

    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;

    panel.style.position = 'fixed';
    panel.style.left = `${rect.left}px`;
    panel.style.width = `${rect.width}px`;
    panel.style.zIndex = '9999';

    // 🔥 ALTTA YER VARSA AŞAĞI
    if (spaceBelow >= panelHeight || spaceBelow >= spaceAbove) {
      panel.style.top = `${rect.bottom}px`;
      panel.style.bottom = 'auto';
      panel.classList.remove('open-up');
    }
    // 🔥 YER YOKSA YUKARI
    else {
      panel.style.top = 'auto';
      panel.style.bottom = `${viewportHeight - rect.top}px`;
      panel.classList.add('open-up');
    }
  }

  toggle() {
    if (this.disabled) return;

    if (!this.open) {
      this.dropdownManager.register(this);
      this.open = true;
      setTimeout(() => this.updatePosition());
    } else {
      this.forceClose();
    }
  }
  forceClose() {
    this.open = false;
    this.dropdownManager.clear(this);
  }
  select(item: any) {
    const val = item[this.valueField];

    this._value = val;
    this.selectedText = item[this.displayField];

    this.onChange(val);
    this.onTouched();

    this.open = false;
  }
  clear() {
    this._value = null;
    this.selectedText = '';

    this.onChange(null);
    this.onTouched();

    this.clearChange.emit();
  }
  @HostListener('document:click')
  onDocumentClick() {
    this.forceClose();
  }



}
