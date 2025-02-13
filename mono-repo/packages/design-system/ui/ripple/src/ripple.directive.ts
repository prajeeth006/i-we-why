import { coerceElement } from '@angular/cdk/coercion';
import { DOCUMENT } from '@angular/common';
import { DestroyRef, Directive, ElementRef, NgZone, OnDestroy, OnInit, inject, input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { mergeInputs } from '@frontend/ui/shared';
import { Observable, first, fromEvent, merge, of, race, switchMap, tap } from 'rxjs';

import { DS_RIPPLE_OPTIONS_TOKEN } from './ripple.provider';
import { DsRippleAnimation, DsRippleOptions, DsRippleOptionsOptional } from './ripple.types';
import { SharedResizeObserver } from './ripple.utils';

const TO_KEYFRAMES = [
    {
        opacity: 'var(--ds-ripple-opacity, 0.2)',
        transform: 'scale3d(0,0,0)',
    },
    {
        opacity: 'var(--ds-ripple-opacity, 0.2)',
        transform: 'scale3d(1,1,1)',
    },
];
const FROM_KEYFRAMES = [
    {
        opacity: 'var(--ds-ripple-opacity, 0.2)',
    },
    {
        opacity: '0',
    },
];

export const defaultRippleAnimationConfig: DsRippleAnimation = {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    enterDuration: 225,
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    exitDuration: 150,
};

const defaultOptions: DsRippleOptions = {
    animation: defaultRippleAnimationConfig,
    centered: false,
    disabled: false,
    radius: 0,
    unbound: false,
};

type MouseEventKeys = {
    [K in keyof HTMLElementEventMap]: HTMLElementEventMap[K] extends MouseEvent ? K : never;
}[keyof HTMLElementEventMap];

/**
 * This directive is inspired by taiga-ui and material ui
 */
@Directive({
    standalone: true,
    selector: '[dsRipple]',
    exportAs: 'dsRipple',
    host: {
        '[style.overflow]': 'this.dsRipple().disabled ? false : (this.dsRipple().unbound ? "visible": "hidden")',
        '[style.position]': 'this.dsRipple().disabled? false: "relative"',
        'class': 'ds-ripple',
    },
})
export class DsRipple implements OnInit, OnDestroy {
    private _globalOptions: DsRippleOptionsOptional = inject(DS_RIPPLE_OPTIONS_TOKEN, { optional: true }) ?? {};

    dsRipple = input(defaultOptions, { transform: mergeInputs<DsRippleOptions>({ ...defaultOptions, ...this._globalOptions }) });

    startEventType = input('pointerdown' as MouseEventKeys);
    endEventTypes = input(['pointerup', 'pointermove', 'pointercancel'] as MouseEventKeys[]);

    private readonly document = inject(DOCUMENT);
    private readonly destroyRef = inject(DestroyRef);
    private readonly elementRef = inject(ElementRef);
    private readonly zone = inject(NgZone);

    private sharedObserver = inject(SharedResizeObserver);
    private bounds?: DOMRectReadOnly;

    private currentAnimation?: Animation;
    private animationId = 0; // Unique identifier for the current animation
    private rippleElement?: HTMLElement;

    public ngOnInit() {
        this.zone.runOutsideAngular(() => {
            const element = coerceElement(this.elementRef) as HTMLElement;
            element.addEventListener(this.startEventType(), this.mouseDownHandler);
        });
    }

    private mouseDownHandler = (event: MouseEvent) => {
        const element = coerceElement(this.elementRef) as HTMLElement;
        if (typeof ResizeObserver === 'undefined') {
            // Not supported, we have to fetch rect always
            this.bounds = element.getBoundingClientRect();
            this.startRipple(event.clientX, event.clientY);
        } else if (this.bounds) {
            this.startRipple(event.clientX, event.clientY);
        } else {
            // If there are no bounds (first time), the observer is initialised, the bounds set and then the ripple started
            this.getBounds(event.clientX, event.clientY, element);
        }
    };

    public ngOnDestroy() {
        this.zone.runOutsideAngular(() => {
            const element = coerceElement(this.elementRef) as HTMLElement;
            element.removeEventListener(this.startEventType(), this.mouseDownHandler);
        });
    }

    private getBounds(clientX: number, clientY: number, element: HTMLElement) {
        let firstEl = true;

        this.sharedObserver
            .observe(element)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                this.bounds = element.getBoundingClientRect();
                if (firstEl) {
                    firstEl = false;
                    this.startRipple(clientX, clientY);
                }
            });
    }

    private createRippleElement() {
        // Create a single ripple element
        const container = coerceElement(this.elementRef) as HTMLElement;
        const ripple = this.document.createElement('div');
        ripple.className = 'ds-ripple-element';
        Object.assign(ripple.style, {
            position: 'absolute',
            borderRadius: '50%',
            pointerEvents: 'none',
            transition: 'opacity, transform 0ms cubic-bezier(0, 0, 0.2, 1)',
            animationFillMode: 'forward',
            zIndex: 100,
            backgroundColor: 'var(--ds-ripple-background, currentColor)',
            opacity: 'var(--ds-ripple-opacity, 0.2)',
            willChange: 'transform, opacity',
        });
        container.append(ripple);
        return ripple;
    }

    private startRipple(clientX: number, clientY: number) {
        if (this._globalOptions.forcedDisabled ?? this.dsRipple().disabled) {
            return;
        }
        if (this.bounds === undefined) {
            console.warn('startRipple called before bounds are ready');
            return;
        }

        if (this.rippleElement === undefined) {
            this.rippleElement = this.createRippleElement();
        }

        const ripple = this.rippleElement;
        const element = coerceElement(this.elementRef) as HTMLElement;
        //Get element where host listener was called (i.e., where dsRipple is applied)
        if (element == null) {
            console.warn('Element for ripple is invalid, ripple effect not applied');
            return;
        }

        // Increment animation ID
        const animationId = ++this.animationId;

        // Cancel any ongoing animation
        if (this.currentAnimation) {
            this.currentAnimation.cancel();
            this.currentAnimation = undefined;
        }

        this.styleRipple(clientX, clientY, this.bounds);

        const touchEnd$ = merge(...this.endEventTypes().map((x) => fromEvent(element, x)));

        // In test cases or old browsers the animate function does not exist, so we ignore the animation part of the ripple
        let animationEndOn$: Observable<Event> = of(new Event('finish'));
        if (typeof ripple.animate === 'function') {
            this.currentAnimation = ripple.animate(TO_KEYFRAMES, { duration: this.dsRipple().animation.enterDuration });
            animationEndOn$ = fromEvent(this.currentAnimation, 'finish');
        }

        const onendTrigger$ = race(touchEnd$.pipe(switchMap(() => animationEndOn$)), animationEndOn$.pipe(switchMap(() => touchEnd$)));
        const onendAnimation$ = onendTrigger$.pipe(
            first(),
            switchMap(() => {
                if (this.currentAnimation && this.animationId === animationId) {
                    this.currentAnimation = ripple.animate(FROM_KEYFRAMES, { duration: this.dsRipple().animation.exitDuration });
                    return fromEvent(this.currentAnimation, 'finish');
                }
                return of(new Event('finish'));
            }),
            first(),
            tap(() => {
                ripple.style.transform = 'scale3d(0, 0, 0)';
            }),
        );
        this.zone.runOutsideAngular(() => {
            onendAnimation$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
        });
    }

    private styleRipple(clientX: number, clientY: number, rect: DOMRect) {
        if (this.rippleElement === undefined) {
            console.warn('Called ripple styling before ripple is created');
            return;
        }
        let offsetX = clientX;
        let offsetY = clientY;

        // Ignore mouse position and set to be centered in rect
        if (this.dsRipple().centered) {
            offsetX = rect.left + rect.width / 2;
            offsetY = rect.top + rect.height / 2;
        }

        // Get distance  to the furthest corner of a rectangle for radius
        const distX = Math.max(Math.abs(offsetX - rect.left), Math.abs(offsetX - rect.right));
        const distY = Math.max(Math.abs(offsetY - rect.top), Math.abs(offsetY - rect.bottom));
        const radius = this.dsRipple().radius > 0 ? this.dsRipple().radius : Math.hypot(distX, distY);

        // Get relative position on where clicked in rect
        offsetX -= rect.left;
        offsetY -= rect.top;

        // Get position on where to place element (rect)
        const x = offsetX - radius;
        const y = offsetY - radius;
        const rippleWidth = radius * 2;
        const rippleHeight = radius * 2;

        let styleObject: Partial<CSSStyleDeclaration> = {
            transform: 'scale3d(1,1,1)',
        };
        if (
            this.rippleElement.style.left !== `${x}px` ||
            this.rippleElement.style.top !== `${y}px` ||
            this.rippleElement.style.width !== `${rippleWidth}px` ||
            this.rippleElement.style.height !== `${rippleHeight}px`
        ) {
            styleObject = {
                ...styleObject,
                left: `${x}px`,
                top: `${y}px`,
                width: `${rippleWidth}px`,
                height: `${rippleHeight}px`,
            };
        }

        Object.assign(this.rippleElement.style, styleObject);
    }
}
