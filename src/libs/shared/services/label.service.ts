import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LabelLayout } from '../../domain/printer/etiket-model';

@Injectable({ providedIn: 'root' })
export class LabelService {

  private baseUrl = 'https://localhost:5001/api';

  constructor(private http: HttpClient) {}

  saveTemplate(layout: LabelLayout) {
    return this.http.post(`${this.baseUrl}/label-template`, layout);
  }

  // print(templateId: string, data: any) {
  //   return this.http.post(`${this.baseUrl}/print/${templateId}`, data);
  // }
  print(templateIds: string[], data: any) {
  return this.http.post('/api/print', {
    templateIds,
    data
  });
}
}