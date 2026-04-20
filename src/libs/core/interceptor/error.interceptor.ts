import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, throwError } from "rxjs";
import { NotificationService } from "../notification/notification.service";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private notify: NotificationService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError(error => {

        if (error.status === 0) {
          this.notify.error('Sunucuya ulaşılamıyor');
        } else {
          this.notify.error(error.error?.message || 'Sistem hatası');
        }

        return throwError(() => error);
      })
    );
  }
}
