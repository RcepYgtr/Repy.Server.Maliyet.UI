import { Component, Input, SimpleChanges } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, take } from 'rxjs';
import { TabService } from '../../../libs/shared/ui/tabs/tab.service';
import { LayoutService } from '../layout.service';
import { AuthService } from '../../../libs/core/auth/auth.service';

export interface SidebarGroup {
    id: string;
    title: string;
    icon: string;
    roles?: string[];
    cards: {
        title: string;
        icon: string;
        href?: string;
        disabled?: boolean;
        roles?: string[];
    }[];
}



export const SIDEBAR_GROUPS: SidebarGroup[] = [


    {
        id: 'maliyet',
        title: 'Maliyet',
        icon: 'fa-solid fa-elevator',
        cards: [
            { title: 'Stok Listesi', icon: '/system.png', href: '/features/stock', roles: ['Admin','Satın Alma','Kullanıcı']},
            { title: 'Stok Grupları', icon: '/system.png', href: '/features/stock-group', roles: ['Admin']},
            { title: 'Ürün Ağaçları', icon: '/system.png', href: '/features/bom', roles: ['Admin','Satış/Pazarlama']},
            { title: 'Maliyet Hesabı', icon: '/system.png', href: '/features/maliyet', roles: ['Admin','Satış/Pazarlama']},
            { title: 'Personeller', icon: '/system.png', href: '/features/personel', roles: ['Admin','Muhasebe']},
            { title: 'İşçilik Parametreleri', icon: '/system.png', href: '/features/labor', roles: ['Admin','Satış/Pazarlama']},
            { title: 'Yönetim', icon: '/system.png', href: '/features/yonetim', roles: ['Admin']},
            { title: 'Maliyet Grafik', icon: '/system.png', href: '/features/maliyet/grafik', roles: ['Admin','Satış/Pazarlama']},
        ]
    },

];



@Component({
    selector: 'app-sidebar',
    standalone: false,
    styleUrls: ["./card-sidebar.scss"],
    styles: [`@use "sidebar";`],
    template: `
        <aside class="iwb-sidebar toggled" [class.toggled]="!layout.sidebarOpen()">
             <div class="iwb-logo">YÜKSELİŞ  </div> <!-- (üretim yönetimi) -->
            <div class="iwb-role">Full Yetkili</div>

            <input class="form-control iwb-search" placeholder="Ara">


             <div class="page-wrapper chiller-theme toggled" [class.toggled]="layout.sidebarOpen()">
           <div id="sidebar-menu" class="border-end overflow-auto sidebar-content" style="height: calc(100vh - 150px);">
             <div class="pr-0 pt-0">
               <div class="file-manager">
                 <div class="dashboard-grid">




<div class="sidebar-layout">


  <div class="sidebar-cards">
<div (click)="onMenuClick(item, $event)"
  class="menu-card"
  *ngFor="let item of activeGroup?.cards"
  [class.disabled]="item.disabled" [routerLink]="item.href"
>
  <img [src]="item.icon" />
  <span>{{ item.title }}</span>
</div>
  </div>

</div>

            
            </div>
            </div>


             </div>
            </div>




                 <div class="sidebar-wrapper">
     
                     <div class="sidebar-footer">
                         <a style="cursor: pointer;">
                           <i class="fa fa-bell"></i>
                           <span class="badge badge-pill badge-warning notification" style="color: red;">3</span>
                         </a>
                         <a style="cursor: pointer;">
                           <i class="fa fa-envelope"></i>
                           <span class="badge badge-pill badge-success notification" style="color: red;">7</span>
                         </a>
                         <a style="cursor: pointer;">
                           <i class="fa fa-cog"></i>
         
                         </a>
                         <a style="cursor: pointer;" (click)="layout.setSidebar(false)">
                           <i class="fa-solid fa-outdent" style="font-size: 14px;color: #000037;"></i>
                           <span class="badge-sonar"></span>
                         </a>
                     </div>
                 </div>
             </div>


        </aside>

         <!-- <a id="show-sidebar" class="btn btn-sm btn-dark toggledhidden" [class.togglednone]="isSidebarOpen" (click)="toggleDropdown()" style="position:absolute;position: absolute;left: 0;top: 50%;">
           <i class="fas fa-bars"></i>
           <span class="badge-sonar"></span>
         </a> -->

<a class="sidebar-handle"
   [class.toggledhidden]="layout.sidebarOpen()"
   (click)="layout.toggleSidebar()">
    <i class="fas fa-chevron-right"></i>
</a>



  `
})
export class SidebarComponent {
    @Input() module: string = '';
    activeMenu: any[] = [];
    activeItem: any = null;

    menu = SIDEBAR_GROUPS;


    activeGroupid = 'maliyet';

    //groups = SIDEBAR_GROUPS;

get activeGroup() {
  const group = this.menu.find(g => g.id === this.activeGroupid);

  if (!group) return null;

  return {
    ...group,
    cards: group.cards.filter(card => {
      if (!card.roles) return true; // herkese açık
      return card.roles.some(r => this.authService.hasRole(r));
    })
  };
}







    constructor(private router: Router, private tabService: TabService, public layout: LayoutService,private authService:AuthService) { }
    private readonly LS_PREFIX = 'repy_erp_';
    ngOnInit(): void {
        this.activeMenu = this.menu;

        //    const saved = localStorage.getItem(this.LS_PREFIX + 'activeItem');

        //  if (saved) this.activeItem = JSON.parse(saved);
        // if (saved) {
        //     this.activeItem = saved;
        // }
        this.router.events
            .pipe(filter(e => e instanceof NavigationEnd))
            .subscribe((e: NavigationEnd) => {
                this.highlightActiveByUrl(e.urlAfterRedirects);
            });

        setTimeout(() => this.highlightActiveByUrl(this.router.url), 100);
    }


    toggleNode(node: any) {
        node.expanded = !node.expanded;
    }


    // 🔹 Menü öğesine tıklanınca
    async onMenuClick(item: any, event: MouseEvent) {

        event.stopPropagation();
        this.activeItem = item;
        // localStorage.setItem(this.LS_PREFIX + 'activeItem', item.href);

        if (item.href) {
            // TAB’A SİNYAL GÖNDER
            this.openTab(item.id, item.title, item.href)

            // NOKTA 1 → Navigation'ı başlat
            this.router.navigate([item.href], { queryParams: item.query ?? {} });

            // NOKTA 2 → Navigate bitince aktiflik kontrolü
            this.router.events
                .pipe(filter(e => e instanceof NavigationEnd), take(1))
                .subscribe(() => {
                    const clean = this.router.url.split('?')[0];
                    this.highlightActiveByUrl(clean);
                });
        }
    }

    openTab(id: string, title: string, href: string) {
        this.tabService.openTab({
            id,
            title,
            href,
            closable: true
        });
    }

    // 🔹 Router URL'sine göre aktif item'ı bul ve set et
    private highlightActiveByUrl(currentUrl: string) {
        const cleanUrl = currentUrl.split('?')[0];

        // 🔥 HOME ise sidebar active KALKAR
        if (cleanUrl === '/home' || cleanUrl === '/') {

            this.activeItem = null;
            // localStorage.removeItem(this.LS_PREFIX + 'activeItem');
            return;
        }

        const queryParams = this.parseQuery(currentUrl);
        const found = this.findMenuItemByFullMatch(this.activeMenu, cleanUrl, queryParams);

        if (found) {
            this.activeItem = found;
            // localStorage.setItem(this.LS_PREFIX + 'activeItem', JSON.stringify(found));
            this.expandParents(this.activeMenu, cleanUrl);
        } else {
            // Menüde eşleşme yoksa da temizle
            this.activeItem = null;
            // localStorage.removeItem(this.LS_PREFIX + 'activeItem');
        }
    }

    private parseQuery(url: string): any {
        const qIndex = url.indexOf('?');
        if (qIndex === -1) return {};

        const queryString = url.substring(qIndex + 1);
        return Object.fromEntries(new URLSearchParams(queryString));
    }

    private findMenuItemByFullMatch(menu: any[], href: string, query: any): any | null {
        for (const item of menu) {
            const itemHref = item.href;
            const itemQuery = item.query ?? null;

            // 1️⃣ Href eşleşmiyorsa direk geç
            if (itemHref === href) {

                // 2️⃣ Menüde query varsa eşleştir
                if (itemQuery) {
                    if (this.compareQuery(itemQuery, query)) {
                        return item;
                    }
                }
                else {
                    // query yoksa href eşleşmesi yeter
                    return item;
                }
            }

            // 3️⃣ Alt menülere bak
            if (item.submenu?.length > 0) {
                const found = this.findMenuItemByFullMatch(item.submenu, href, query);
                if (found) return found;
            }
        }

        return null;
    }

    private compareQuery(menuQuery: any, urlQuery: any): boolean {
        const ids = Object.keys(menuQuery);

        for (let id of ids) {
            if (!urlQuery[id]) return false;

            // “Toptan Satış” vs “Toptan Sat%C4%B1%C5%9F” → decode gerekli
            if (decodeURIComponent(urlQuery[id]) !== menuQuery[id]) return false;
        }

        return true;
    }

    // 🔹 Recursive olarak menüde item bul
    private findMenuItemByHref(menu: any[], href: string): any | null {
        for (const item of menu) {
            if (item.href === href) return item;
            if (item.submenu?.length > 0) {
                const found = this.findMenuItemByHref(item.submenu, href);
                if (found) return found;
            }
        }
        return null;
    }

    // 🔹 Parent menüleri açık hale getir
    private expandParents(menu: any[], href: string): boolean {
        for (const item of menu) {
            if (item.href === href) return true;

            if (item.submenu?.length > 0) {
                const expanded = this.expandParents(item.submenu, href);
                if (expanded) {
                    item.expanded = true;
                    return true;
                }
            }
        }
        return false;
    }

























































}


function uid(): string {
    return Math.random().toString(36).substring(2, 11) + Date.now();
}