import { ComponentRef, Directive, Input, OnChanges, OnDestroy, OnInit, Type, ViewContainerRef } from '@angular/core';

import { PageMatrixService as CorePageMatrixService, Logger } from '@frontend/vanilla/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { PageMatrixService } from './page-matrix.service';

/**
 * @whatItDoes
 *
 * @stable
 */
@Directive({
    standalone: true,
    selector: '[vnPageMatrix]',
})
export class PageMatrixDirective<T = any> implements OnInit, OnChanges, OnDestroy {
    @Input() vnPageMatrix: T;

    templatesRegistered: boolean = false;

    private unsubscribe = new Subject<void>();
    private componentRef: ComponentRef<any>;

    constructor(
        private viewContainerRef: ViewContainerRef,
        private pageMatrixService: PageMatrixService,
        private corePageMatrixService: CorePageMatrixService,
        private log: Logger,
    ) {}

    ngOnInit() {
        this.corePageMatrixService.whenReady.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
            this.templatesRegistered = true;
            this.renderComponent();
        });
    }

    ngOnChanges() {
        this.renderComponent();
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    private renderComponent() {
        if (!this.templatesRegistered) {
            return;
        }

        this.viewContainerRef.clear();

        if (this.vnPageMatrix) {
            const type = this.resolveTemplate(this.vnPageMatrix);

            if (type) {
                this.componentRef = this.viewContainerRef.createComponent(type);
                this.componentRef.setInput('item', this.vnPageMatrix);
                this.componentRef.changeDetectorRef.detectChanges();
            }
        }
    }

    private resolveTemplate(content: T | any): Type<any> | null {
        let templateName;

        if (content?.parameters) {
            templateName = content.parameters.render || content.parameters.template;
        }

        templateName = templateName || content.templateName;

        if (!templateName) {
            this.log.warn('templateName is not specified for content ', content);

            return null;
        }

        const component = this.pageMatrixService.getComponent(templateName);

        if (!component) {
            this.log.warn(`No component is registered to render template '${templateName}'`);

            return null;
        }

        return component;
    }
}
