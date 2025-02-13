import { Component, DoCheck, ElementRef, Injector, OnDestroy, OnInit } from '@angular/core';

import { CustomElement, DslService, DynamicHtml, EmbeddableComponentsService } from '@frontend/vanilla/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    standalone: true,
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: '[data-content-filter]',
    template: '<ng-content />',
})
export class ContentFilterComponent implements OnInit, OnDestroy, DoCheck {
    private unsubscribe = new Subject<void>();
    private dynamicHtml: DynamicHtml | null;

    constructor(
        private elementRef: ElementRef<HTMLElement>,
        private dslService: DslService,
        private embeddableComponentsService: EmbeddableComponentsService,
        private injector: Injector,
    ) {}

    ngOnInit() {
        const element: CustomElement = this.elementRef.nativeElement as CustomElement;
        const condition = element.originalAttributes.get('data-content-filter')!;
        const style = element.originalAttributes.get('style') || '';
        const content = element.originalHtmlString;
        this.elementRef.nativeElement.setAttribute('data-content-filter', condition);

        this.dslService
            .evaluateExpression(condition)
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((r: any) => {
                if (this.dynamicHtml) {
                    this.dynamicHtml.destroy();
                }

                if (r) {
                    this.elementRef.nativeElement.setAttribute('style', style);
                    this.dynamicHtml = this.embeddableComponentsService.createDynamicHtml(this.elementRef.nativeElement, this.injector, content);
                } else {
                    this.elementRef.nativeElement.setAttribute('style', 'display: none');
                    this.dynamicHtml = this.embeddableComponentsService.createDynamicHtml(this.elementRef.nativeElement, this.injector, '');
                }
            });
    }

    ngDoCheck() {
        if (this.dynamicHtml) {
            this.dynamicHtml.detectChanges();
        }
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();

        if (this.dynamicHtml) {
            this.dynamicHtml.destroy();
        }
    }
}
