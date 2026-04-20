import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, catchError, of, switchMap } from 'rxjs';
import { CurrentUser } from './user.model';
import { environment } from '../../../environment';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private _user = signal<CurrentUser | null>(null);

  user = this._user.asReadonly();

  constructor(private http: HttpClient) {}

  // login(data: { username: string; password: string }) {
  //   return this.http.post('/Auth/login', data).pipe(
  //     tap(() => this.loadUser().subscribe())
  //   );
  // }

  // logout() {
  //   return this.http.post('/Auth/logout', {}).pipe(
  //     tap(() => this._user.set(null))
  //   );
  // }



check(): Promise<boolean> {
  return new Promise((resolve) => {

    this.loadUser().subscribe({
      next: (user) => {
        resolve(!!user); // user varsa true
      },
      error: () => {
        resolve(false);
      }
    });

  });
}
login(data: any) {
  return this.http.post(
    `${environment.apiUrl}/Auth/login`,
    data,
    { withCredentials: true }
  ).pipe(
    switchMap(() => this.loadUser())
  );
}

  logout() {
    return this.http.post(
      `${environment.apiUrl}/Auth/logout`,
      {},
      { withCredentials: true }
    ).pipe(
       tap(() => this._user.set(null))
    );
  }





// loadUser() {
//   return this.http.get<CurrentUser>(
//     `${environment.apiUrl}/Auth/me`,
//     { withCredentials: true }  
//   ).pipe(
//     tap(user => {

//       this._user.set(user)
    
//     }),
//     catchError(() => {
//       this._user.set(null);
//       return of(null);
//     })
//   );
// }

loadUser() {
  return this.http.get<CurrentUser>(
    `${environment.apiUrl}/Auth/me`,
    { withCredentials: true }  
  ).pipe(
    tap(user => {
     // console.log("ME RESPONSE:", user);   // 🔥 BURASI
      this._user.set(user);
     // console.log("SIGNAL STATE:", this._user()); // 🔥 BURASI
    }),
    catchError(err => {
     // console.log("ME ERROR:", err);  // 🔥 HATA VARSA GÖR
      this._user.set(null);
      return of(null);
    })
  );
}

  isLoggedIn(): boolean {
    return this._user() !== null;
  }

  hasRole(role: string): boolean {
    return this._user()?.roles.includes(role) ?? false;
  }

  hasPermission(permission: string): boolean {
    return this._user()?.permissions.includes(permission) ?? false;
  }
}
