import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TabService } from './tab.service';

@Injectable({ providedIn: 'root' })
export class TabFormStateService {

  constructor(private tabService: TabService) { }

  initForm<T>(form: FormGroup, options: { editData?: any; editMapper?: (data: any) => Partial<T>; } = {}) {
  
    const tab = this.tabService.activeTab;
    if (!tab) return;

    tab().canClose = () => !form.dirty;

    // 2️⃣ Edit data varsa
    if (options.editData && options.editMapper) {
  
      const mapped = options.editMapper(options.editData);
      form.patchValue(mapped, { emitEvent: false });
      form.markAsPristine();
    }
    // 1️⃣ Daha önce yazılmış state
    if (tab().context?.formState) {
      
      form.patchValue(tab().context.formState, { emitEvent: false });
      form.markAsDirty();
      // return;
    }

    // 3️⃣ Değişiklikleri cachele
    form.valueChanges.subscribe(value => {
      tab().context = {
        ...tab().context,
        formState: value
      };
      tab().dirty = form.dirty;
    });
  }



  clearFormState() {
    const tab = this.tabService.activeTab;
    if (!tab) return;

    delete tab().context?.formState;
    tab().dirty = false;
  }
}

