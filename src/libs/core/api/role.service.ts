import { Injectable } from "@angular/core";
import { firstValueFrom, Observable } from "rxjs";
import { ApiClientService } from "./_api-client.service";
import { HttpErrorResponse } from "@angular/common/http";
export interface RoleDto {
  id: string;
  name: string;
}
@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private apiService: ApiClientService) { }



  create(body: any, successCallBack?: (data: any) => void, errorCallBack?: (error: any) => void) {

    const observable = this.apiService.post(
      {
        controller: "Roles",
        action: "create"
      },
      body
    );

    const promiseData = firstValueFrom(observable);

    promiseData
      .then((data) => {
        successCallBack && successCallBack(data);
      })
      .catch((error) => {
        errorCallBack && errorCallBack(error);
      });

    return promiseData;
  }


  update(data: any): Promise<any> {

    const observable = this.apiService.put(
      {
        controller: "Roles",
        action: `update/${data.id}` // 🔥 route param burada
      },
      data
    );

    return firstValueFrom(observable);
  }




  async getAll(
    successCallBack?: (data: RoleDto[]) => void,
    errorCallBack?: (error: HttpErrorResponse) => void
  ) {

    const observable: Observable<any> = this.apiService.get(
      {
        controller: "Roles",
        action: "get-all"
      }
    );

    const promiseData = firstValueFrom(observable);

    promiseData
      .then((data) => {
        if (successCallBack) successCallBack(data);
      })
      .catch((error: HttpErrorResponse) => {
        if (errorCallBack) errorCallBack(error);
      });

    return await promiseData;
  }

}
