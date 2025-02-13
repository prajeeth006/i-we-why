import { Directive, ElementRef, OnDestroy, OnInit, computed, inject, input } from '@angular/core';

import { BehaviorSubject, Observable, ReplaySubject, Subject, combineLatest } from 'rxjs';
import { distinctUntilChanged, finalize, map } from 'rxjs/operators';

import { _RxVirtualViewObserver } from './model';
import { RxaResizeObserver } from './resize-observer';
import { VirtualViewCache } from './virtual-view-cache';

/**
 * The RxVirtualViewObserver directive observes the virtual view and emits a boolean value indicating whether the virtual view is visible.
 * This is the container for the RxVirtualView directives.
 *
 * This is a mandatory directive for the RxVirtualView directives to work.
 *
 * @example
 * ```html
 * <div rxVirtualViewObserver>
 *   <div rxVirtualView>
 *     <div *rxVirtualViewContent>Virtual View 1</div>
 *     <div *rxVirtualViewPlaceholder>Loading...</div>
 *   </div>
 * </div>
 * ```
 *
 * @developerPreview
 */
@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: '[rxVirtualViewObserver]',
    standalone: true,
    providers: [VirtualViewCache, RxaResizeObserver, { provide: _RxVirtualViewObserver, useExisting: RxVirtualViewObserver }],
})
export class RxVirtualViewObserver extends _RxVirtualViewObserver implements OnInit, OnDestroy {
    #elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

    #observer: IntersectionObserver | null = null;

    #resizeObserver = inject(RxaResizeObserver, { self: true });

    /**
     * The root element to observe.
     *
     * If not provided, the root element is the element that the directive is attached to.
     */
    root = input<ElementRef | HTMLElement | null>();

    /**
     * The root margin to observe.
     *
     * This is useful when you want to observe the virtual view in a specific area of the root element.
     */
    rootMargin = input('');

    /**
     * The threshold to observe.
     *
     * If you want to observe the virtual view when it is partially visible, you can set the threshold to a number between 0 and 1.
     *
     * For example, if you set the threshold to 0.5, the virtual view will be observed when it is half visible.
     */
    threshold = input<number | number[]>(0);

    #rootElement = computed(() => {
        const root = this.root();
        if (root) {
            if (root instanceof ElementRef) {
                return root.nativeElement;
            }
            return root;
        } else if (root === null) {
            return null;
        }
        return this.#elementRef.nativeElement;
    });

    #elements = new Map<Element, Subject<boolean>>();

    #forcedHidden$ = new BehaviorSubject(false);

    ngOnInit(): void {
        this.#observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (this.#elements.has(entry.target)) this.#elements.get(entry.target)?.next(entry.isIntersecting);
                });
            },
            {
                root: this.#rootElement(),
                rootMargin: this.rootMargin(),
                threshold: this.threshold(),
            },
        );
    }

    ngOnDestroy() {
        this.#elements.clear();
        this.#observer?.disconnect();
        this.#observer = null;
    }

    /**
     * Hide all the virtual views.
     *
     * This is useful when you want to hide all the virtual views when the user cannot see them.
     *
     * For example, when the user opens a modal, you can hide all the virtual views to improve performance.
     *
     * **IMPORTANT:**
     *
     * Don't forget to call `showAllVisible()` when you want to show the virtual views again.
     */
    hideAll(): void {
        this.#forcedHidden$.next(true);
    }

    /**
     * Show all the virtual views that are currently visible.
     *
     * This needs to be called if `hideAll()` was called before.
     */
    showAllVisible(): void {
        this.#forcedHidden$.next(false);
    }

    observeElementVisibility(virtualView: HTMLElement) {
        const isVisible$ = new ReplaySubject<boolean>(1);

        // Store the view and the visibility state in the map.
        // This allows us to retrieve the visibility state later.
        this.#elements.set(virtualView, isVisible$);

        // Start observing the virtual view immediately.
        this.#observer?.observe(virtualView);

        return combineLatest([isVisible$, this.#forcedHidden$]).pipe(
            map(([isVisible, forcedHidden]) => (forcedHidden ? false : isVisible)),
            distinctUntilChanged(),
            finalize(() => {
                this.#observer?.unobserve(virtualView);
                this.#elements.delete(virtualView);
            }),
        );
    }

    observeElementSize(element: Element, options?: ResizeObserverOptions): Observable<ResizeObserverEntry> {
        return this.#resizeObserver.observeElement(element, options);
    }
}
