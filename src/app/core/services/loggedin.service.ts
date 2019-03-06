import { Injectable } from '@angular/core';
import { Router } from '@angular/router';


@Injectable()
export class IsLoggedIn {
    constructor(
        private router: Router) {
    }

    resolve(): void {
        if (sessionStorage.getItem('jwt') != null && sessionStorage.getItem('jwt') != '') this.router.navigate(['/phonepal'])
    }
}