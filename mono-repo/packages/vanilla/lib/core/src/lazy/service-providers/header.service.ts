import { Injectable, Signal, Type } from '@angular/core';

import { Observable } from 'rxjs';

import { LazyServiceProviderBase } from './lazy-service-provider-base';

/**
 * @whatItDoes Provides utility functions for manipulating the header
 *
 * @description
 *
 * # Overview
 * This provides functionality for manipulating the header:
 *  - Get header height
 *  - Highlight product
 *  - show/hide
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class HeaderService extends LazyServiceProviderBase {
    get headerComponentRect(): Signal<{ width: number; height: number }> {
        return this.inner.headerComponentRect.asReadonly();
    }
    get headerElementRect(): Signal<{ width: number; height: number }> {
        return this.inner.headerElementRect.asReadonly();
    }
    get hasHeaderElement(): Signal<boolean> {
        return this.inner.hasHeaderElement;
    }
    get display(): Observable<boolean> {
        return this.inner.display;
    }
    getHeaderHeight(): number {
        return this.inner.getHeaderHeight();
    }
    highlightProduct(name: string | null): void {
        this.inner.highlightProduct(name);
    }
    setHeaderComponent(itemType: string, component: Type<any>): void {
        this.inner.setHeaderComponent(itemType, component);
    }
    getHeaderComponent(itemType: string | undefined): void {
        return this.inner.getHeaderComponent(itemType);
    }
    setItemCounter(itemName: string, count: any, cssClass?: string): void {
        this.inner.setItemCounter(itemName, count, cssClass);
    }
    show(disabledItems?: string[]): void {
        this.inner.show(disabledItems);
    }
    hide(): void {
        this.inner.hide();
    }
    itemDisabled(item: string): boolean {
        return this.inner.itemDisabled(item);
    }
}
