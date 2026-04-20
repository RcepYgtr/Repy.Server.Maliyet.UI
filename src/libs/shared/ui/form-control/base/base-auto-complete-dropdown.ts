
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
import { AutoCompleteDropdownManagerService } from './auto-complete-dropdown-manager.service';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { LookupService } from '../../lookup/lookup.service';
import { LookupCacheService } from '../../lookup/lookup-cache.service';
import { CoreInitializerService } from '../../../../core/api/core-initializer.service';

@Component({
  selector: 'base-auto-complete-dropdown',
  standalone: false,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => BaseAutoCompleteDropdownComponent),
      multi: true
    }
  ],
  template: `


<div
  class="iwb-row"
  [class.has-error]="showError"
  [class.has-accent]="accentEnabled"
   [class.has-lookup]="lookupEnabled"
  [class.is-disabled]="disabled"
>
  <div class="iwb-label">{{ label }}</div>

  <div class="iwb-field" [ngClass]="gridClass">
    <div class="iwb-dropdown" (click)="$event.stopPropagation()">
      <div class="iwb-lookup">


        <input
  class="iwb-lookup-input"
  [value]="inputText"
  (input)="onInput($event)"
  (blur)="onBlur()"
  (click)="toggle()"
  [placeholder]="placeholder"
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
        <!-- <div
          class="iwb-dropdown-item"
          *ngFor="let item of items"
          (click)="select(item)"
        >
          {{ item[displayField] }}
        </div> -->

        <div
  class="iwb-dropdown-item"
  *ngFor="let item of filteredItems"
  (click)="select(item)"
>
  {{item[displayField] }}
</div>
      </div>

      <span class="iwb-error-icon" *ngIf="showError">!</span>
    </div>
  </div>
</div>


`,
  styles: [`@use "input-form"; 

  .iwb-lookup-input {
    cursor: text;

}
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
export class BaseAutoCompleteDropdownComponent implements ControlValueAccessor, OnChanges, OnInit {

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
  @Input() dbKey?: string;

  @ViewChild('panel') panelRef!: ElementRef;

  open = false;
  selectedText = '';



  inputText = '';
  filteredItems: any[] = [];

  constructor(private el: ElementRef<HTMLElement>,
    private dropdownManager: AutoCompleteDropdownManagerService,
    private lookupService: LookupService,
    private lookupCache: LookupCacheService,
    private coreInit: CoreInitializerService) { }



  async ngOnInit() {

    // 1️⃣ Eğer manuel items verilmişse dokunma
    if (this.items?.length) {
      this.filteredItems = [...this.items];
      return;
    }

    // 2️⃣ DB cache varsa onu al
    if (this.dbKey) {



      const cached = this.lookupCache.get(this.dbKey);

      if (cached?.length) {
        this.items = cached;
        this.filteredItems = [...this.items];
        this.resolveValueToText();
      } else {

        // 🔥 CACHE BOŞSA SERVİSTEN ÇEK
        await this.coreInit.init();
        // 🔥 50ms sonra tekrar dene (cache dolacak)
        setTimeout(() => {
          this.items = this.lookupCache.get(this.dbKey);
          this.filteredItems = [...this.items];
          this.resolveValueToText();
        }, 50);
      }
    }

    // 3️⃣ Statik liste varsa
    if (this.listKey) {
      this.items = this.lookupService.getList(this.listKey as any);
      this.filteredItems = [...this.items];
    }
  }

  private resolveValueToText() {
    if (this._value == null) return;

    const found = this.items.find(
      x => x[this.valueField] === this._value
    );

    if (found) {
      this.inputText = found[this.displayField];
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['items'] || changes['selectedValue']) {

      // 🔥 SADECE selectedValue gerçekten geldiyse UI güncelle
      if (this.selectedValue !== null && this.selectedValue !== undefined) {

        const found = this.items.find(
          x => x[this.valueField] === this.selectedValue

        );

        if (found) {
          this.inputText = found[this.displayField];
        }
      }

      this.filteredItems = [...this.items];
    }
  }



  private _value: any = null;
  private onChange = (_: any) => { };
  private onTouched = () => { };
  writeValue(value: any): void {
    this._value = value;

    if (value == null) {
      this.inputText = '';
      return;
    }

    const found = this.items.find(
      x => x[this.valueField] === value
    );
    if (found) {
      this.inputText = found[this.displayField];
    } else {
      // 🔥 LİSTEDE YOKSA BİLE GÖSTER
      this.inputText = "";
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

  get hasValue(): boolean {
    return this._value !== null && this._value !== undefined;
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
    this.inputText = item[this.displayField];

    this.onChange(val);
    this.onTouched();

    this.open = false;
  }


  clear() {
    this._value = null;
    this.inputText = '';
    this.filteredItems = [...this.items];

    this.onChange(null);
    this.onTouched();

    this.open = false;
  }

  @Output() valueChange = new EventEmitter<number>();

  onSelect(item: any) {
    this.valueChange.emit(item.id); // 🔥 sadece number
  }

  @HostListener('document:click')
  onDocumentClick() {
    this.forceClose();
  }







  onInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.inputText = value;

    this.filteredItems = this.items.filter(item =>
      item[this.displayField]
        ?.toLowerCase()
        .includes(value.toLowerCase())
    );

    // 🔥 FORM'U GÜNCELLE
    // this._value = value;
    // this.onChange(value);

    if (!this.open) {
      this.dropdownManager.register(this);
      this.open = true;
      setTimeout(() => this.updatePosition());
    }
  }


  openDropdown() {
    if (this.disabled) return;

    this.dropdownManager.register(this);
    this.open = true;
    this.filteredItems = [...this.items];

    setTimeout(() => this.updatePosition());
  }
  onBlur() {
    setTimeout(() => {

      const found = this.items.find(
        x => x[this.displayField] === this.inputText
      );

      if (found) {
        this._value = found[this.valueField];
        this.onChange(this._value);
      } else {
        this._value = null;
        this.onChange(null);
      }

      this.onTouched();

    }, 150);
  }

}
