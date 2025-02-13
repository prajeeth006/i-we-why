import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class LoginSpinnerService {
    readonly visible = signal<boolean>(false);

    show() {
        this.visible.set(true);
    }

    hide() {
        this.visible.set(false);
    }
}
