import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { NotificationService } from '../notification/notification.service';
import { SuccessType } from '../../shared/enums/success-type.enum';

@Injectable()
export class SuccessInterceptor implements HttpInterceptor {

  constructor(private notify: NotificationService) { }


intercept(req: HttpRequest<any>, next: HttpHandler) {

  return next.handle(req).pipe(
    tap(event => {

      if (!(event instanceof HttpResponse)) return;

      if (!['POST','PUT','DELETE'].includes(req.method)) return;

      const body = event.body;
      if (!body?.message) {
        return;
      }

      const type = body.operation as SuccessType;

      this.notify.success(body.message, type ?? SuccessType.Completed);
    })
  );
}

}
