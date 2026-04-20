import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthService } from "./auth.service";
import { map } from "rxjs";

@Injectable({ providedIn: 'root' })
export class LoginGuard implements CanActivate {

  constructor(private auth: AuthService,
              private router: Router) {}

  canActivate() {
    return this.auth.loadUser().pipe(
      map(user => {
        if (user) {
          this.router.navigate(['/dashboard']);
          return false;
        }
        return true;
      })
    );
  }
}