import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Env, StateService } from '../../services/state.service';
import { Observable, merge, of } from 'rxjs';
import { LanguageService } from '../../services/language.service';
import { EnterpriseService } from '../../services/enterprise.service';
import { NavigationService } from '../../services/navigation.service';
import { MenuComponent } from '../menu/menu.component';

@Component({
  selector: 'app-master-page',
  templateUrl: './master-page.component.html',
  styleUrls: ['./master-page.component.scss'],
})
export class MasterPageComponent implements OnInit {
  @Input() headerVisible = true;
  @Input() footerVisibleOverride: boolean | null = null;

  env: Env;
  network$: Observable<string>;
  connectionState$: Observable<number>;
  navCollapsed = false;
  isMobile = window.innerWidth <= 767.98;
  officialMempoolSpace = this.stateService.env.OFFICIAL_MEMPOOL_SPACE;
  urlLanguage: string;
  subdomain = '';
  networkPaths: { [network: string]: string };
  networkPaths$: Observable<Record<string, string>>;
  footerVisible = true;
  userAuth: any | undefined;
  servicesEnabled = false;

  @ViewChild(MenuComponent)
  private menuComponent!: MenuComponent;

  constructor(
    public stateService: StateService,
    private languageService: LanguageService,
    private enterpriseService: EnterpriseService,
    private navigationService: NavigationService,
  ) { }

  ngOnInit(): void {
    this.env = this.stateService.env;
    this.connectionState$ = this.stateService.connectionState$;
    this.network$ = merge(of(''), this.stateService.networkChanged$);
    this.urlLanguage = this.languageService.getLanguageForUrl();
    this.subdomain = this.enterpriseService.getSubdomain();
    this.navigationService.subnetPaths.subscribe((paths) => {
      this.networkPaths = paths;
      if (this.footerVisibleOverride === null) {
        if (paths.mainnet.indexOf('docs') > -1) {
          this.footerVisible = false;
        } else {
          this.footerVisible = true;
        }
      } else {
        this.footerVisible = this.footerVisibleOverride;
      }
    });
    
    this.servicesEnabled = this.officialMempoolSpace && this.stateService.env.ACCELERATOR === true && this.stateService.network === '';
    this.userAuth = JSON.parse(localStorage.getItem('auth') || '') ?? null;
  }

  collapse(): void {
    this.navCollapsed = !this.navCollapsed;
  }

  onResize(): void {
    this.isMobile = window.innerWidth <= 767.98;
  }

  brandClick(e): void {
    this.stateService.resetScroll$.next(true);
  }

  hamburgerClick(): void {
    if (this.menuComponent) {
      this.menuComponent.hambugerClick();
    }
  }
}
