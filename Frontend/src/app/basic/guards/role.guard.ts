import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserStorageService } from '../services/storage/user-storage.service';

@Injectable({
    providedIn: 'root'
})
export class RoleGuard implements CanActivate {

    constructor(
        private router: Router,
        private userStorageService: UserStorageService
    ) { }

    canActivate(): boolean {
        const userRole = this.userStorageService.getUserRole();
        if (userRole === 'COMPANY') {
            return true;
        } else {
            this.router.navigate(['/login']);
            return false;
        }
    }
} 
