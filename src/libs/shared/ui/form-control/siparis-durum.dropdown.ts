


// }
import {
    Component,
    Input,
    OnInit,
    Optional,
    Self
} from '@angular/core';
import {
    ControlValueAccessor,
    NgControl
} from '@angular/forms';
import { APP_ROUTES } from '../../../../APP_ROUTES';
import { TabService } from '../tabs/tab.service';

@Component({
    selector: 'siparis-durum-dropdown',
    standalone: false,
    template: `
            <base-auto-complete-dropdown
              [label]="label"
              [items]="datas"
              displayField="durumName"
              valueField="durumName"
              [selectedValue]="_value"
              [showError]="showError"
              [hasLookup]="hasLookup"
              [hasAccent]="hasAccent"
              [allowAdd]="allowAdd"
              [grid]='grid'
              (selectChange)="onSelect($event)"
              (clearChange)="onClear()"
              (addClick)="openUnitCreateTab()"
              (blur)="markTouched()" >
            </base-auto-complete-dropdown>
`
})
export class SiparisDurumDropdownComponent
    implements ControlValueAccessor, OnInit {

    @Input() hasLookup: boolean | '' = false;
    @Input() hasAccent: boolean | '' = false;
    @Input() grid: number;
    @Input() allowAdd: boolean = false;

    datas: any[] = [];
    _value: any = null;
    @Input() label: any = 'Sipariş Durum';
    private onChange = (_: any) => { };
    private onTouched = () => { };

    constructor(
        private tabService: TabService,
        @Optional() @Self() public ngControl: NgControl
    ) {
        if (this.ngControl) {
            this.ngControl.valueAccessor = this;
        }
    }

    async ngOnInit() {
        this.datas = [
            {id:1,durumName:"ÇİZİLMEDİ"},
            {id:2,durumName:"İPTAL"},
            {id:3,durumName:"İMALATTA"},
            {id:4,durumName:"HAZIR"},
            {id:5,durumName:"AMBALAJ"},
            {id:6,durumName:"BEKLEMEDE"},
            {id:7,durumName:"GİTTİ"},

        ];
    }

    get showError(): boolean {
        return !!(
            this.ngControl &&
            this.ngControl.invalid &&
            (this.ngControl.touched || this.ngControl.dirty)
        );
    }

    // 🔥 FORM İLE TEK TEMAS NOKTASI
    onSelect(value: any) {
        this._value = value;
        this.onChange(value);
        this.onTouched();
    }

    onClear() {
        this._value = null;
        this.onChange(null);
        this.onTouched();
    }

    writeValue(value: any): void {
        this._value = value;
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void { }

    markTouched() {
        this.onTouched();
    }

    openUnitCreateTab() {
        this.tabService.openTab({
            id: APP_ROUTES.UNIT.CREATE.id,
            title: APP_ROUTES.UNIT.CREATE.title,
            href: APP_ROUTES.UNIT.CREATE.href,
            closable: true,
            dirty: false
        });
    }
}
