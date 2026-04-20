import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { LookupCacheService } from '../../shared/ui/lookup/lookup-cache.service';

@Injectable({ providedIn: 'root' })
export class CoreInitializerService {

  constructor(
    private auth: AuthService,
    private lookupCache: LookupCacheService
  ) {}

  async init(): Promise<void> {
 const isAuth = await this.auth.check();

  if (!isAuth) return; // 🔥 login yok → hiçbir şey yapma


    // 📦 LOOKUP PRELOAD
    await Promise.all([
      //this.lookupCache.load('SIPARIS_DURUM_DB', 'Lookups/siparis-durum'),
      //this.lookupCache.load('ROLES', 'Roles/get-all'),
      this.lookupCache.load('UNITS', 'Lookups/get-all-unit'),
      this.lookupCache.load('KABIN_TYPES', 'Lookups/get-all-kabin'),
      this.lookupCache.load('SUSPANSIYON_TYPES', 'Lookups/get-all-suspansiyon'),
      this.lookupCache.load('MAKINESASESI_TYPES', 'Lookups/get-all-makine-sasesi'),
      this.lookupCache.load('AGIRLIKSASESI_TYPES', 'Lookups/get-all-agirlik-sasesi'),
      this.lookupCache.load('CAPACITIES', 'Lookups/get-all-dimension'),
    ]);

  }
}

