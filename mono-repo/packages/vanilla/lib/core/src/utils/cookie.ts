import { DOCUMENT } from '@angular/common';
import { inject } from '@angular/core';

export function getCookieRaw(name: string): string | null {
    const doc = inject(DOCUMENT);
    const pattern = RegExp(name + '=.[^;]*');
    const matched = doc.cookie.match(pattern);
    if (matched) {
        const cookie = matched[0].split('=');
        return cookie[1] || null;
    }

    return null;
}
