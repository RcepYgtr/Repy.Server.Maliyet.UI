import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
export type LoadingContext = 'page' | 'refresh' | 'upload' | 'default';
@Injectable({ providedIn: 'root' })
export class UiService {
 private _loadingStates = new Map<LoadingContext, BehaviorSubject<boolean>>([
    ['default', new BehaviorSubject<boolean>(false)],
    ['page', new BehaviorSubject<boolean>(false)],
    ['refresh', new BehaviorSubject<boolean>(false)],
    ['upload', new BehaviorSubject<boolean>(false)]
  ]);

  private _infoModal = new BehaviorSubject<{ show: boolean; title: string; message: string; type: 'success' | 'error' }>({
    show: false,
    title: '',
    message: '',
    type: 'success'
  });

  // 🔹 Genel observable erişimleri
  getLoading$(context: LoadingContext = 'default') {
    return this._loadingStates.get(context)!.asObservable();
  }

  // 🔹 Loading set et
  setLoading(context: LoadingContext, state: boolean) {
    const subj = this._loadingStates.get(context);
    if (subj) subj.next(state);
  }

  // 🔹 Genel (default) loading
  loading$ = this._loadingStates.get('default')!.asObservable();

  // 🔹 Bilgi / Hata modal
  infoModal$ = this._infoModal.asObservable();
  showSuccess(msg: string) { this._infoModal.next({ show: true, title: 'Başarılı', message: msg, type: 'success' }); }
  showError(msg: string) { this._infoModal.next({ show: true, title: 'Hata', message: msg, type: 'error' }); }
  closeModal() { this._infoModal.next({ ...this._infoModal.value, show: false }); }

  
}
