import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { ApiClientService } from '../_api-client.service';




@Injectable({
    providedIn: 'root'
})
export class KabinCostService {
    decode: any;
    loggedUserData: any;
    constructor(
        private apiService: ApiClientService,
        private http: HttpClient

    ) { }

    async calculate(body: any,
        successCallBack?: (res: any) => void, errorCallback?: (error: HttpErrorResponse) => void) {

        try {
            const observable = this.apiService.post(
                {
                    controller: "KabinCosts",   // 🔥 controller adı
                    action: "calculate"        // 🔥 endpoint
                },
                body
            );

            const response = await firstValueFrom(observable);

            if (successCallBack) successCallBack(response);

            return response;

        } catch (error: any) {
            if (errorCallback) errorCallback(error);
            throw error;
        }
    }







}





