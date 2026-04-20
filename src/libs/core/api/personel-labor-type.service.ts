import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ApiClientService } from './_api-client.service';

@Injectable({
  providedIn: 'root'
})
export class PersonelLaborTypeService {

  constructor(private apiService: ApiClientService) { }

  // 🔥 ASSIGN (REPLACE)
  async assignPersonnels(body: any, success?: () => void, error?: (err: HttpErrorResponse) => void) {
    try {
      const res = await firstValueFrom(
        this.apiService.post({
          controller: 'PersonelLaborTypes',
          action: 'assign-personnels'
        }, body)
      );

      if (success) success();
      return res;

    } catch (err: any) {
      if (error) error(err);
      throw err;
    }
  }

  // 🔥 GET BY LABOR TYPE
  async getByLaborType(laborTypeId: number) {
    return await firstValueFrom(
      this.apiService.get({
        controller: 'PersonelLaborTypes',
        action: 'personnels-by-labor-type',
        queryString: `laborTypeId=${laborTypeId}`
      })
    );
  }

  // 🔥 UPDATE (bulk zaten assign ile yapılıyor ama yine koyduk)
  async update(body: any) {
    return await firstValueFrom(
      this.apiService.put({
        controller: 'PersonelLaborTypes',
        action: 'update'
      }, body)
    );
  }
}