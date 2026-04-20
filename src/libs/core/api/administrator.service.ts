import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { firstValueFrom, Observable, tap } from 'rxjs';
import { ApiClientService } from './_api-client.service';
import { Paginate } from './models/Paginate';
import { AuthStore } from '../auth/auth.store';
import { environment } from '../../../environment';


export interface SiparisGenelQuery {
    page?: number;
    pageSize?: number;
    search?: string;
    projeType?: number;
}

@Injectable({
    providedIn: 'root'
})
export class AdministratorService {
    decode: any;
    loggedUserData: any;
    constructor(
        private http: HttpClient,
        private store: AuthStore,

    ) { }



    login(data: any) {
        return this.http.post<any>(
            `${environment.apiUrl}/Administrators/login`,
            data,
            { withCredentials: true }
        ).pipe(
            tap(res => {
                this.store.setAuth(res.accessToken, res.roles);
                localStorage.setItem('has_session', 'true');
            })
        );
    }

    logout() {
        return this.http.post(
            `${environment.apiUrl}/Administrators/logout`,
            {},
            { withCredentials: true }
        ).pipe(
            tap(() => {
                this.store.clear();
                localStorage.removeItem('has_session');
            })
        );
    }

    refresh() {
        return this.http.post<any>(
            `${environment.apiUrl}/Administrators/refresh`,
            {},
            { withCredentials: true }
        ).pipe(
            tap(res => {
                this.store.setAuth(res.accessToken, res.roles);
            })
        );
    }

    bootstrap(): Promise<void> {

        // Eğer zaten token varsa refresh atma
        if (this.store.token()) {
            return Promise.resolve();
        }

        const hasSession = localStorage.getItem('has_session');
        if (!hasSession) {
            return Promise.resolve();
        }

        return firstValueFrom(this.refresh())
            .then(() => { })
            .catch(() => {
                this.store.clear();
                localStorage.removeItem('has_session');
            });
    }


















}





