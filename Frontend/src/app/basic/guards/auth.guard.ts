import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserStorageService } from '../services/storage/user-storage.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(
        private router: Router,
        private userStorageService: UserStorageService
    ) { }

    canActivate(): boolean {
        const token = this.userStorageService.getToken();
        if (token) {
            return true;
        } else {
            this.router.navigate(['/login']);
            return false;
        }
    }
} 
