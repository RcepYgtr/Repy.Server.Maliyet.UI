import { CanActivate, Router } from "@angular/router";
import { AuthService } from "./auth.service";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class PermissionGuard implements CanActivate {

  constructor(private auth: AuthService,
              private router: Router) {}

  canActivate(route: any) {
    const permission = route.data['permission'];

    if (!this.auth.hasPermission(permission)) {
      this.router.navigate(['/unauthorized']);
      return false;
    }

    return true;
  }
}
