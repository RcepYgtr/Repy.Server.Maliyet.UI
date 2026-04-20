import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { ApiClientService } from './_api-client.service';
import { Paginate } from './models/Paginate';
import { CreateImalatFormuExcelQueryResponse, GrafikResult, ProjeType } from '../../domain/siparis-genel/siparis-genel-models';
import { environment } from '../../../environment';




@Injectable({
    providedIn: 'root'
})
export class DimentionService {
    decode: any;
    loggedUserData: any;
    constructor(
        private apiService: ApiClientService,
        private http: HttpClient

    ) { }



async getDimensions(
  capacity: number,
  successCallBack?: (res: any[]) => void,
  errorCallBack?: (error: HttpErrorResponse) => void
): Promise<any[]> {

  try {

    const response = await firstValueFrom(
      this.apiService.get<any[]>({
        controller: 'Dimensions',   // 🔥 backend controller adı
        action: 'dimensions',
        queryString: `capacity=${capacity}`
      })
    );

    if (successCallBack) successCallBack(response);

    return response;

  } catch (error: any) {

    if (errorCallBack)
      errorCallBack(error);

    throw error;
  }
}






}





