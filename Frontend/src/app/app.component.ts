import { Component, HostListener, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { UserStorageService } from './basic/services/storage/user-storage.service';
import { AuthService } from './basic/services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'ServiceBookingSystemWebSite';
  isClientLoggedIn: boolean = false;
  isCompanyLoggedIn: boolean = false;
  isMenuOpen: boolean = false;
  isScrolled: boolean = false;

  constructor(
    private router: Router,
    private userStorageService: UserStorageService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.updateLoginStatus();
    
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateLoginStatus();
    });

    // Subscribe to user changes
    this.userStorageService.currentUser$.subscribe(() => {
      this.updateLoginStatus();
    });
  }

  private updateLoginStatus() {
    this.isClientLoggedIn = this.userStorageService.isClientLoggedIn();
    this.isCompanyLoggedIn = this.userStorageService.isCompanyLoggedIn();
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.userStorageService.clearSession();
        this.router.navigateByUrl('/login');
        this.closeMenu();
      },
      error: () => {
        // Even if logout fails on server, clear local session
        this.userStorageService.clearSession();
        this.router.navigateByUrl('/login');
        this.closeMenu();
      }
    });
  }
}
