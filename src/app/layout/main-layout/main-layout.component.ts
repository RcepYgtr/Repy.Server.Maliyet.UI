import { Component, computed, OnInit } from '@angular/core';
import { TabService } from '../../../libs/shared/ui/tabs/tab.service';
import { Router } from '@angular/router';
import { TabItem } from '../../../libs/shared/ui/tabs/tab-model';
import { CookieService } from '../../../libs/core/cookies/cookie.service';
import { AuthService } from '../../../libs/core/auth/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: false,
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent implements OnInit {
  // 🔥 Signal'dan direkt türetilmiş değerler
  fullName = computed(() => this.auth.user()?.fullName ?? '');
  roles = computed(() => this.auth.user()?.roles ?? []);
  constructor(
    public tabService: TabService,
    private router: Router,
    private cookie: CookieService,
    public auth: AuthService
  ) { }


  ngOnInit(): void {

    // sayfa refresh olunca user'ı tekrar çek
    this.auth.loadUser().subscribe();




  }

  activate(tab: TabItem) {
    this.tabService.setActive(tab.id);
  }

  close(tab: TabItem, e: MouseEvent) {
    e.stopPropagation();
    this.tabService.closeTab(tab.id);
  }

  openTab(id: string, title: string, href: string) {
    this.tabService.openTab({
      id,
      title,
      href,
      closable: true
    });
  }


  userMenuOpen = false;

  toggleUserMenu() {
    this.userMenuOpen = !this.userMenuOpen;
  }

  logout() {
    this.auth.logout().subscribe(() => {

      // 🔥 tab state temizle
      this.tabService.resetAll();

      // 🔥 route değiştir
      this.router.navigate(['/auth/login']);

    });
  }


}
