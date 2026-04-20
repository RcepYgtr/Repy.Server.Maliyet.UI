import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { ApiClientService } from '../_api-client.service';



@Injectable({
    providedIn: 'root'
})
export class KapiTypeService {
    decode: any;
    loggedUserData: any;
    constructor(
        private apiService: ApiClientService,
        private http: HttpClient

    ) { }



async getByModel(
    doorCategory: number,
    successCallBack?: (res: any[]) => void,
    errorCallBack?: (error: HttpErrorResponse) => void
) {
    try {
        const observable: Observable<any[]> = this.apiService.get({
            controller: 'KapiTypes',
            action: `by-door-category/${doorCategory}`
        });

        const response = await firstValueFrom(observable);

        if (successCallBack) successCallBack(response);

        return response;

    } catch (error: any) {
        if (errorCallBack) errorCallBack(error);
        throw error;
    }
}



    // ---------------------------
    // CREATE
    // ---------------------------

    async create(body: any, successCallBack?: (res: any) => void, errorCallback?: (error: HttpErrorResponse) => void) {
        try {
            const observable = this.apiService.post(
                {
                    controller: "KapiTypes",
                    action: "create"
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

    // ---------------------------
    // UPDATE
    // ---------------------------
    async update(id: number, dto: any): Promise<any> {
        return await firstValueFrom(
            this.apiService.put({
                controller: 'KapiTypes',
                action: `update/${id}`
            }, dto)
        );
    }
    // ---------------------------
    // DELETE
    // ---------------------------
    async delete(id: number): Promise<any> {
        return await firstValueFrom(
            this.apiService.delete({
                controller: 'KapiTypes',
                action: id.toString()
            })
        );
    }











}





