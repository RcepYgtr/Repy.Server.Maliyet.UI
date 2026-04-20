import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';
import { ApiClientService } from './_api-client.service';

export interface UserDto {
  id: string;
  userName: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private apiService: ApiClientService) { }


  create(body: any,
    successCallBack?: (data: any) => void,
    errorCallBack?: (error: any) => void
  ) {

    const observable = this.apiService.post(
      {
        controller: "Users",
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


  update(body: any,
    successCallBack?: (data: any) => void,
    errorCallBack?: (error: any) => void
  ) {

    const observable = this.apiService.put(
      {
        controller: "Users",
        action: "update"
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


  // 🔹 TÜM KULLANICILARI GETİR
  async getAll(
    successCallBack?: (data: UserDto[]) => void,
    errorCallBack?: (error: HttpErrorResponse) => void
  ) {

    const observable: Observable<any> = this.apiService.get(
      {
        controller: "Users",
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
