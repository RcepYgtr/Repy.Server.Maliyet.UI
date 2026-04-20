import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { ApiClientService } from './_api-client.service';
import { Paginate } from './models/Paginate';
import { CreateImalatFormuExcelQueryResponse, GrafikResult, ProjeType } from '../../domain/siparis-genel/siparis-genel-models';
import { environment } from '../../../environment';


export interface StockQuery {
    page?: number;
    pageSize?: number;
    search?: string;
    projeType?: number;
}

@Injectable({
    providedIn: 'root'
})
export class StockService {
    decode: any;
    loggedUserData: any;
    constructor(
        private apiService: ApiClientService,
        private http: HttpClient

    ) { }



    async getAll(query: StockQuery = {}, successCallBack?: (res: Paginate<any>) => void, errorCallBack?: (error: HttpErrorResponse) => void): Promise<Paginate<any>> {

        try {
            const params: string[] = [
                `Page=${query.page ?? 1}`,
                `PageSize=${query.pageSize ?? 100}`
            ];

            if (query.search) {
                params.push(`Search=${encodeURIComponent(query.search)}`);
            }
            if (query.projeType !== undefined) {
                params.push(`ProjeType=${query.projeType}`);
            }
            return await firstValueFrom(
                this.apiService.get<Paginate<any>>({
                    controller: 'Stocks',
                    action: 'get-all',
                    queryString: params.join('&')
                })
            );

        } catch (error: any) {
            if (errorCallBack)
                errorCallBack(error);
            throw error;
        }
    }
  async getList(
    successCallBack?: (res: any[]) => void,
    errorCallBack?: (error: HttpErrorResponse) => void
  ) {
    try {

      const observable: Observable<any[]> = this.apiService.get({
        controller: 'Stocks',
        action: 'get-list',
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
                    controller: "Stocks",
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
  async update(update: any, successCallBack?: () => void, errorCallback?: (errorMessage: HttpErrorResponse) => void) {

    const observable = await this.apiService.put({
      controller: "Stocks",
      action: "update",

    }, update)
    const promiseData = firstValueFrom(observable);
    promiseData.then(successCallBack).catch(errorCallback);
    return await promiseData;
  }
    // ---------------------------
    // DELETE
    // ---------------------------
  async delete(id: string, successCallBack?: () => void, errorCallback?: (errorMessage: HttpErrorResponse) => void) {
    const observable = await this.apiService.delete({
      controller: "Stocks",
      action: "delete",
      queryString: "id=" + id
    })
    const promiseData = firstValueFrom(observable);
    promiseData.then(successCallBack).catch(errorCallback);
    return await promiseData;
  }
    // ---------------------------
    // GET NEXT SERI NO
    // ---------------------------
async getNextStockCode(
  successCallBack?: (code: string) => void,
  errorCallBack?: (error: HttpErrorResponse) => void
) {
  try {
    const observable = this.apiService.get(
      {
        controller: 'Stocks',
        action: 'next-code',
 
      }
    );

    const response = await firstValueFrom(observable);

    if (successCallBack) {
      successCallBack(response as string);
    }

    return response;
  } catch (error: any) {
    if (errorCallBack) {
      errorCallBack(error);
    }
    throw error;
  }
}

    // ---------------------------
    // GET TOTAL COUNT
    // ---------------------------
    async getTotalCount(filter: any): Promise<number> {
        return await firstValueFrom(
            this.apiService.post<number>({
                controller: 'Stocks',
                action: 'total-count'
            }, filter)
        );
    }









}





