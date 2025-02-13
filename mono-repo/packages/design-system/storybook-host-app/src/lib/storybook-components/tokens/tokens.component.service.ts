import { Injectable } from '@angular/core';

import { SemanticToken, extractSemanticTokens } from './tokens.utils';

async function fetchText(url: string): Promise<string | null> {
    try {
        const response = await fetch(url);
        return response.ok ? await response.text() : null;
    } catch {
        return null;
    }
}

@Injectable({
    providedIn: 'root',
})
export class TokenReaderService {
    cssText?: string;

    async getCssText() {
        if (this.cssText) {
            return this.cssText;
        }

        const urlObject = new URL(window.location.href);
        const buildPathname = urlObject.pathname
            .split('/')
            .slice(0, -1)
            .filter((x) => x !== '');
        buildPathname.push('main.css');
        const baseUrl = `/${buildPathname.join('/')}`;
        const cssText = await fetchText(baseUrl);
        if (cssText) {
            this.cssText = cssText;
        }
        return this.cssText;
    }

    async getSemanticTokens(themeClassNames: string): Promise<SemanticToken[]> {
        const realClass = themeClassNames.split(' ').filter((x) => x.startsWith('th-'));
        if (realClass.length !== 1) {
            console.error('Invalid name', realClass);
            return [];
        }
        const themeClassName = realClass[0];
        const cssText = await this.getCssText();
        if (!cssText) {
            return [];
        }
        return extractSemanticTokens(cssText, themeClassName);
    }
}
