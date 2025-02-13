import { Directive, DoCheck, ElementRef, Injector, Input, OnDestroy, OnInit } from '@angular/core';

import { Subject, debounceTime, takeUntil } from 'rxjs';

import { DynamicHtml, EmbeddableComponentsService } from './embeddable-components.service';

/**
 * @whatItDoes Renders specified dynamic html string.
 *
 * @howToUse
 *
 * ```
 * <div [vnDynamicHtml]="html"></div>
 * ```
 *
 * @description
 *
 * This directive allows for dynamic html content (for example from Sitecore) to be rendered with registered
 * embedded components specified by {@link EmbeddableComponentsService}. These components will be created on the
 * respective DOM elements that match selectors of the embedded components.
 *
 * Such components come with some limitations when rendered inside dynamic HTML string:
 *  - `@Input()`, `@Output`, `@Attribute()` will not work - get inputs using `elementRef.nativeElement.getAttribute()`
 *  - `innerHTML` of the component will get overwritten by the components template. Sometimes you need to put it back (for example in case of button text).
 *    For this case use `this.elementRef.nativeElement.innerHTML = this.elementRef.nativeElement.originalHtmlString;` in `ngOnInit`
 *  - If the component selector is an attribute selector (e.g. `[someAttr]`), it will for some reason remove the value of that attribute from the element.
 *    You can access it with `this.elementRef.nativeElement.originalAttributes.get('someAttr')`
 *
 * The advantage of this method is that it doesn't require `JitCompiler`, and therefore we can take full advantage of AoT compilation.
 *
 * @stable
 */
@Directive({
    standalone: true,
    selector: '[vnDynamicHtml]',
})
export class DynamicHtmlDirective implements OnInit, OnDestroy, DoCheck {
    @Input() set vnDynamicHtml(value: string) {
        this.destroy();
        this.dynamicHtml = this.embeddableComponentsService.createDynamicHtml(this.elementRef.nativeElement, this.elementInjector, value);
    }

    private dynamicHtml: DynamicHtml;
    private unsubscribe: Subject<void> = new Subject<void>();

    constructor(
        private elementRef: ElementRef<HTMLElement>,
        private embeddableComponentsService: EmbeddableComponentsService,
        private elementInjector: Injector,
    ) {}

    ngOnInit() {
        let index = 0;
        this.embeddableComponentsService.embeddedComponentRegistered.pipe(debounceTime(300), takeUntil(this.unsubscribe)).subscribe(() => {
            this.embeddableComponentsService.refreshEmbeddedComponents(this.elementRef.nativeElement, this.dynamicHtml, this.elementInjector, index);
            index++;
        });
    }

    ngDoCheck() {
        this.dynamicHtml?.detectChanges();
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
        this.destroy();
    }

    private destroy() {
        if (this.dynamicHtml) {
            this.dynamicHtml.destroy();
        }
    }
}
