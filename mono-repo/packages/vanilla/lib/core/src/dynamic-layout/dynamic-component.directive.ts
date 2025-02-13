import { ComponentRef, Directive, Injector, Input, OnChanges, SimpleChanges, Type, ViewContainerRef, reflectComponentType } from '@angular/core';

/**
 * @whatItDoes Renders the specified component dynamically.
 *
 * @howToUse
 *
 * ```
 * <ng-container [vnDynamicComponent]="componentExpression; attr: attrExpression" />
 * ```
 * @stable
 */
@Directive({
    standalone: true,
    selector: '[vnDynamicComponent]',
})
export class DynamicComponentDirective implements OnChanges {
    @Input() vnDynamicComponent: Type<any> | null | undefined;
    @Input() vnDynamicComponentAttr: Record<string, any> | null | undefined;
    @Input() vnDynamicComponentInjector: Injector | null | undefined;

    private componentRef: ComponentRef<any> | undefined;

    constructor(private viewContainerRef: ViewContainerRef) {}

    ngOnChanges(changes: SimpleChanges) {
        const { vnDynamicComponent, vnDynamicComponentAttr, vnDynamicComponentInjector } = changes;

        if (vnDynamicComponent) {
            this.createComponent(vnDynamicComponent.currentValue, vnDynamicComponentInjector?.currentValue);
        }

        if (vnDynamicComponentAttr) {
            this.updateComponent(vnDynamicComponentAttr.currentValue);
        }
    }

    private createComponent(vnDynamicComponent?: Type<any> | null, injector?: Injector | null) {
        this.viewContainerRef.clear();

        if (vnDynamicComponent) {
            const options = injector ? { injector } : undefined;

            this.componentRef = this.viewContainerRef.createComponent(vnDynamicComponent, options);
        }
    }

    private updateComponent(attrs?: Record<string, any>) {
        const componentRef = this.componentRef;

        if (componentRef && attrs) {
            Object.keys(attrs).forEach((input: string) => {
                const componentMetadata = reflectComponentType(componentRef.componentType);
                if (componentMetadata?.inputs.find((x) => [x.propName, x.templateName].includes(input))) {
                    componentRef.setInput(input, attrs[input]);
                }
            });
        }
    }
}
