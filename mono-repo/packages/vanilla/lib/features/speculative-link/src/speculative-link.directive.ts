import { Directive, ElementRef, OnDestroy, computed, effect, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, UrlTree } from '@angular/router';

import { WINDOW } from '@frontend/vanilla/core';
import { PageVisibilityService } from '@frontend/vanilla/features/page-visibility';
import { map } from 'rxjs';

import { SpeculativeLinkObserver } from './speculative-link-observer.service';
import { SpeculativeLinkConfig } from './speculative-link.client-config';

/**
 *
 * Inspired by the [Speculation Rules API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Speculation_Rules_API}
 *
 * @whatItDoes When the link is observed in the viewport it will preload its route and execute its preResolvers.
 *
 */

@Directive({ selector: '[vnSpeculativeLink]', standalone: true })
export class SpeculativeLinkDirective implements OnDestroy {
    path = input.required<string>({ alias: 'vnSpeculativeLink' });

    readonly #router = inject(Router);
    readonly #window = inject(WINDOW);

    readonly #pageVisibilityService = inject(PageVisibilityService);
    readonly #observer = inject(SpeculativeLinkObserver);

    readonly #configService = inject(SpeculativeLinkConfig);

    registeredTree: UrlTree | null = null;

    readonly #isPageVisible = toSignal(this.#pageVisibilityService.visibilityChange().pipe(map(({ isVisible }) => isVisible)));
    readonly #isEnabled = toSignal<boolean | undefined>(this.#configService.whenReady.pipe(map(() => this.#configService.isEnabled)));
    urlTree = computed(() => {
        // If the config has loaded and the feature is not enabled we do not register the signals in the effect
        if (this.#configService.isConfigReady && !this.#configService.isEnabled) {
            return null;
        }

        const path = this.path();
        const isEnabled = this.#isEnabled();

        if (!isEnabled || !path) {
            return null;
        }

        return this.parseUrl(path);
    });

    private parseUrl(path: string): UrlTree | null {
        if (!path.includes('http')) {
            return this.#router.parseUrl(path);
        }
        const url = new URL(path);
        if (this.#window.location.hostname !== url.hostname) {
            return null;
        }
        return this.#router.parseUrl(url.pathname);
    }

    element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

    #register = effect(() => {
        this.#observer.unregister(this);
        if (this.urlTree() && this.#isPageVisible()) {
            this.#observer.register(this);
        }
        this.registeredTree = this.urlTree();
    });

    ngOnDestroy() {
        this.#observer.unregister(this);
        this.#register.destroy();
    }
}
