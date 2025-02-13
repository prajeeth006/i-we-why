import { Injectable, inject } from '@angular/core';

import { WINDOW } from '../browser/window/window.token';

const VISIBLE_SUFFIX = '-shown';
const HIDDEN_SUFFIX = '-hidden';

/**
 * @whatItDoes Abstracts html node dom manipulation.
 *
 * @howToUse
 *
 * ```
 * htmlNode.setCssClass('class', true); // add class
 * htmlNode.setCssClass('class', false); // remove class
 * htmlNode.hasCssClass('class'); // check if html node has class
 *
 * htmlNode.setAttribute('attr', 'val'); // set attribute
 * htmlNode.removeAttribute('attr'); // remove attribute
 * ```
 *
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class HtmlNode {
    private html: HTMLElement;
    readonly #window = inject(WINDOW);

    constructor() {
        this.html = this.#window.document.documentElement;
    }

    toggleVisibilityClass(featureName: string, add: boolean) {
        if (add) {
            this.setCssClass(`${featureName}${VISIBLE_SUFFIX}`, true);
            this.setCssClass(`${featureName}${HIDDEN_SUFFIX}`, false);
        } else {
            this.setCssClass(`${featureName}${HIDDEN_SUFFIX}`, true);
            this.setCssClass(`${featureName}${VISIBLE_SUFFIX}`, false);
        }
    }

    setCssClass(className: string, add: boolean) {
        if (!className) {
            return;
        }

        className
            .split(' ')
            .filter((c) => c)
            .forEach((c) => {
                if (add) {
                    this.html.classList.add(c);
                } else {
                    this.html.classList.remove(c);
                }
            });
    }

    hasCssClass(className: string): boolean {
        return this.html.classList.contains(className);
    }

    setAttribute(attr: string, value: string | null) {
        if (value) {
            this.html.setAttribute(attr, value);
        } else {
            this.html.removeAttribute(attr);
        }
    }

    getAttribute(attr: string): string | null {
        return this.html.getAttribute(attr);
    }

    /**
     * Low level function to block scrolling. If you are creating an overlay, use `@angular/cdk/overlay` and specify `block` scroll strategy instead!
     */
    blockScrolling(block: boolean) {
        if (block) {
            const scroll = this.#window.scrollY;

            this.html.style.top = `-${scroll}px`;
            this.setCssClass('cdk-global-scrollblock', true);
        } else {
            const scroll = parseInt(this.html.style.top || '0') * -1;

            this.html.style.top = '';
            this.setCssClass('cdk-global-scrollblock', false);
            this.#window.scrollTo(0, scroll);
        }
    }

    hasBlockScrolling(): boolean {
        return this.html.classList.contains('cdk-global-scrollblock');
    }

    removeClassStartsWith(className: string): void {
        if (className) {
            const classList = Array.from(this.html.classList);
            classList.forEach((name) => {
                if (name.startsWith(className)) {
                    this.html.classList.remove(name);
                }
            });
        }
    }
}
