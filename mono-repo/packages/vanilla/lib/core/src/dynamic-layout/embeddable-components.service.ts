import { ApplicationRef, ComponentRef, Injectable, Injector, Type, createComponent, inject, reflectComponentType } from '@angular/core';

import { Observable, Subject } from 'rxjs';

export interface EmbeddableComponentFactoryInfo {
    component: Type<any>;
    selector: string;
    priority: number;
    config?: { projectableNodesMapper?: (el: HTMLElement) => Node[][] };
}

export interface CustomElement extends HTMLElement {
    originalAttributes: Map<string, string>;
    originalHtmlString: string;
    hasEmbeddedComponent: boolean;
}

/**
 * @whatItDoes Allows you to register components that can be embedded to dynamic html with {@link DynamicHtmlDirective}.
 *
 * @description
 *
 * Only one component per element will be embedded. e.g. single element cannot have multiple components. If multiple selectors would match an element, the component with highest `priority` will be created.
 *
 * The default priority is `100`.
 *
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class EmbeddableComponentsService {
    applicationRef = inject(ApplicationRef);
    private componentInfoList: EmbeddableComponentFactoryInfo[] = [];
    private embeddedComponentRegisteredEvents: Subject<void> = new Subject<void>();

    get embeddedComponentRegistered(): Observable<void> {
        return this.embeddedComponentRegisteredEvents;
    }

    registerEmbeddableComponent(
        component: Type<any>,
        priority: number = 100,
        config: { projectableNodesMapper?: (el: HTMLElement) => Node[][] } = {},
    ) {
        let index = 0;

        for (index = 0; index < this.componentInfoList.length; index++) {
            const info = this.componentInfoList[index]!;
            if (priority >= info.priority) {
                break;
            }
        }
        const componentMetadata = reflectComponentType(component);
        if (!componentMetadata?.selector) {
            throw new Error(`Dynamic component of type ${componentMetadata?.type} need to have selector.`);
        }
        const info = { component, selector: componentMetadata.selector, priority, config };

        if (index === this.componentInfoList.length) {
            this.componentInfoList.push(info);
        } else {
            this.componentInfoList.splice(index, 0, info);
        }

        this.embeddedComponentRegisteredEvents.next();
    }

    createDynamicHtml(element: HTMLElement, elementInjector: Injector, content: string) {
        const dynamicHtml = new DynamicHtml();
        element.innerHTML = content || '';

        if (!content) {
            return dynamicHtml;
        }

        this.componentInfoList.forEach((componentInfo) => {
            const selectors = componentInfo.selector.split(',').map((x) => x.trim());
            selectors.forEach((selector) => {
                const embeddedComponentElements = this.onlyTopmostParents(element.querySelectorAll(selector));

                embeddedComponentElements.forEach((element) => {
                    if (element.hasEmbeddedComponent) {
                        return;
                    }

                    const component = this.createEmbeddedComponent(componentInfo.component, elementInjector, element, componentInfo.config);

                    dynamicHtml.addEmbeddedComponent(component);
                    element.hasEmbeddedComponent = true;
                });
            });
        });

        return dynamicHtml;
    }

    public refreshEmbeddedComponents(element: HTMLElement, dynamicHtml: DynamicHtml, elementInjector: Injector, index: number) {
        if (dynamicHtml) {
            dynamicHtml.destroy();
        }

        this.componentInfoList.forEach((componentInfo) => {
            const selectors = componentInfo.selector.split(',').map((x) => x.trim());
            selectors.forEach((selector) => {
                const embeddedComponentElements = this.onlyTopmostParents(element.querySelectorAll(selector));
                embeddedComponentElements.forEach((element) => {
                    if ((element as any)['hasEmbeddedComponent' + index]) {
                        return;
                    }

                    const component = this.createEmbeddedComponent(componentInfo.component, elementInjector, element, componentInfo.config);

                    dynamicHtml.addEmbeddedComponent(component);
                    (element as any)['hasEmbeddedComponent' + index] = true;
                });
            });
        });
    }

    private createEmbeddedComponent(
        componentType: Type<any>,
        elementInjector: Injector,
        element: CustomElement,
        config: { projectableNodesMapper?: (el: HTMLElement) => any[][] } = {},
    ) {
        const originalAttributes = new Map<string, string>();
        for (let i = 0; i < element.attributes.length; i++) {
            const attribute = element.attributes.item(i)!;
            originalAttributes.set(attribute.name, attribute.value);
        }
        element.originalHtmlString = element.innerHTML;
        element.originalAttributes = originalAttributes;

        const cmp = createComponent(componentType, {
            hostElement: element,
            environmentInjector: this.applicationRef.injector,
            elementInjector: elementInjector,
            projectableNodes: config.projectableNodesMapper ? config.projectableNodesMapper(element) : [],
        });
        const mirror = reflectComponentType(componentType);

        if (mirror) {
            for (let i = 0; i < element.attributes.length; i++) {
                for (let input of mirror.inputs) {
                    const attribute = element.attributes.item(i)!;
                    if (input.propName === attribute.name) {
                        cmp.setInput(input.propName, attribute.value);
                    }
                }
            }
        }

        return cmp;
    }

    private onlyTopmostParents(elements: NodeListOf<CustomElement>): CustomElement[] {
        const parents: CustomElement[] = [];

        Array.from(elements).forEach((e) => {
            if (!parents.some((p) => this.isParentOf(p, e))) {
                parents.push(e);
            }
        });

        return parents;
    }

    private isParentOf(parent: Element, element: Element | null) {
        while (element != null) {
            if (element.parentElement === parent) {
                return true;
            }

            element = element.parentElement;
        }

        return false;
    }
}

/**
 * @stable
 */
export class DynamicHtml {
    private embeddedComponents: ComponentRef<any>[] = [];

    addEmbeddedComponent(component: ComponentRef<any>) {
        this.embeddedComponents.push(component);
    }

    detectChanges() {
        this.embeddedComponents.forEach((comp) => comp.changeDetectorRef.detectChanges());
    }

    destroy() {
        // destroy components otherwise there will be memory leaks
        this.embeddedComponents.forEach((comp) => comp.destroy());
        this.embeddedComponents.length = 0;
    }
}
