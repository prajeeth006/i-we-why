import { Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';

import { ElementRepositoryService } from './element-repository.service';

/**
 * @whatItDoes Marks an element to be registered with {@link ElementRepositoryService}.
 *
 * @howToUse
 *
 * ```
 * <div vnElementKey="SOME_KEY"></div>
 * ```
 *
 * ```
 * // in service or unrelated component:
 * const element = this.elementRepositoryService.get('SOME_KEY');
 * ```
 *
 * @stable
 */
@Directive({
    standalone: true,
    selector: '[vnElementKey]',
})
export class ElementKeyDirective implements OnInit, OnDestroy {
    @Input() vnElementKey: string;

    constructor(
        private elementRef: ElementRef,
        private elementRepositoryService: ElementRepositoryService,
    ) {}

    ngOnInit() {
        this.elementRepositoryService.register(this.vnElementKey, this.elementRef.nativeElement);
    }

    ngOnDestroy() {
        this.elementRepositoryService.remove(this.vnElementKey);
    }
}
