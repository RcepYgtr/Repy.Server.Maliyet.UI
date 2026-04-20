import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';
import { ApiClientService } from './_api-client.service';
import { Paginate } from './models/Paginate';
export interface PersonelQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  projeType?: number;
}
@Injectable({
  providedIn: 'root'
})
export class PersonelService {

  constructor(private apiService: ApiClientService) { }

  // 🔥 TÜM PERSONELLER
  async getAll(query: PersonelQuery = {}, successCallBack?: (res: Paginate<any>) => void, errorCallBack?: (error: HttpErrorResponse) => void): Promise<Paginate<any>> {

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
          controller: 'Personels',
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
        controller: 'Personels',
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
          controller: "Personels",
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
  async update(dto: any): Promise<any> {
    return await firstValueFrom(
      this.apiService.put({
        controller: 'Personels',
        action: `update`
      }, dto)
    );
  }
  // ---------------------------
  // DELETE
  // ---------------------------
  async delete(id: number): Promise<any> {
    return await firstValueFrom(
      this.apiService.delete({
        controller: 'Personels',
        action: id.toString()
      })
    );
  }

  // ---------------------------
  // GET NEXT SERI NO
  // ---------------------------
  async getNextSeriNo(): Promise<any> {
    return await firstValueFrom(
      this.apiService.get({
        controller: 'Personels',
        action: 'next-seri-no'
      })
    );
  }

  // ---------------------------
  // GET TOTAL COUNT
  // ---------------------------
  async getTotalCount(filter: any): Promise<number> {
    return await firstValueFrom(
      this.apiService.post<number>({
        controller: 'Personels',
        action: 'total-count'
      }, filter)
    );
  }

}