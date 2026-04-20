import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { ApiClientService } from './_api-client.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  constructor(
    private apiService: ApiClientService
  ) { }

  // 🔹 MATRIX DATA
  async getAll(successCallBack?: (data: any) => void,
    errorCallBack?: (error: HttpErrorResponse) => void) {

    const observable: Observable<any> = this.apiService.get({
      controller: "Permissions",
      action: "get-all"   // backend: GET /api/Permissions/matrix
    });

    const promiseData = firstValueFrom(observable);

    promiseData
      .then(data => {
        if (successCallBack)
          successCallBack(data);
      })
      .catch(error => {
        if (errorCallBack)
          errorCallBack(error);
      });

    return await promiseData;
  }

  // 🔹 ROLE PERMISSIONS
  async getRolePermissions(roleId: string,
    successCallBack?: (data: string[]) => void,
    errorCallBack?: (error: HttpErrorResponse) => void) {

    const observable: Observable<any> = this.apiService.get({
      controller: "Administrators",
      action: "get-role-permission",
    }, roleId); // GET /api/Permissions/role/{roleId}

    const promiseData = firstValueFrom(observable);

    promiseData
      .then(data => {
        if (successCallBack)
          successCallBack(data);
      })
      .catch(error => {
        if (errorCallBack)
          errorCallBack(error);
      });

    return await promiseData;
  }

  // 🔹 ASSIGN PERMISSIONS
  async assign(request: {
    roleId: string,
    permissionCodes: string[]
  },
    successCallBack?: () => void,
    errorCallBack?: (error: HttpErrorResponse) => void) {

    const observable = this.apiService.post({
      controller: "Administrators",
      action: "assign-permissions-to-role"
    }, request);

    const promiseData = firstValueFrom(observable);

    promiseData
      .then(() => {
        if (successCallBack)
          successCallBack();
      })
      .catch(error => {
        if (errorCallBack)
          errorCallBack(error);
      });

    return await promiseData;
  }

  // GET ROLE USER
  async getRolesToUser(
    userId: string,
    successCallBack?: (roles: string[]) => void,
    errorCallBack?: (error: HttpErrorResponse) => void
  ) {

    const observable = this.apiService.get<string[]>(
      {
        controller: "Administrators",
        action: `get-roles-to-user/${userId}`
      }
    );

    const promiseData = firstValueFrom(observable);

    promiseData
      .then((data: string[]) => {
        if (successCallBack) successCallBack(data);
      })
      .catch((error: HttpErrorResponse) => {
        if (errorCallBack) errorCallBack(error);
      });

    return await promiseData;
  }

  // 🔹 KULLANICIYA ROL ATA
  async assignRole(
    body: { userId: string; roles: string[] },
    successCallBack?: () => void,
    errorCallBack?: (error: HttpErrorResponse) => void
  ) {

    const observable = this.apiService.post(
      {
        controller: "Administrators",
        action: "assign-role-to-user"
      },
      body
    );

    const promiseData = firstValueFrom(observable);

    promiseData
      .then(() => {
        if (successCallBack) successCallBack();
      })
      .catch((error: HttpErrorResponse) => {
        if (errorCallBack) errorCallBack(error);
      });

    return await promiseData;
  }

}
