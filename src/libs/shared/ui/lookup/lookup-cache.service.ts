import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { environment } from "../../../../environment";

@Injectable({ providedIn: 'root' })
export class LookupCacheService {

  private cache: Record<string, any[]> = {};
  private loading: Record<string, Promise<any>> = {};

  constructor(private http: HttpClient) { }
  async load(key: string, endpoint: string) {

    if (this.cache[key]?.length) return this.cache[key];

    if (this.loading[key]) return this.loading[key];

    const url = `${environment.apiUrl}/${endpoint}`;

    this.loading[key] = firstValueFrom(
      this.http.get<any[]>(url)
    ).then(data => {
      this.cache[key] = data;
      delete this.loading[key];
      return data;
    });

    return this.loading[key];
  }
  get(key: string): any[] {
    return this.cache[key] ?? [];
  }

  set(key: string, data: any[]) {
    this.cache[key] = data;
  }
}
