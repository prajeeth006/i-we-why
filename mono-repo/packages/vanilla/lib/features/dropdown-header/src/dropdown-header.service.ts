import { Injectable, Type } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class DropDownHeaderService {
    private dropDownMenuToggleEvents: BehaviorSubject<boolean> = new BehaviorSubject(false);
    private dropDownHeaderComponents = new Map<string, Type<any>>();

    /** Observable of when dropdown menu is open or closed. Will instantly return current value to subscribers. */
    get dropDownMenuToggle(): Observable<boolean> {
        return this.dropDownMenuToggleEvents;
    }

    /** Set a component type for dropdown header item type. */
    setDropDownHeaderComponent(itemType: string, component: Type<any>) {
        this.dropDownHeaderComponents.set(itemType, component);
    }

    /** Gets a component type for dropdown header item type. */
    getDropDownHeaderComponent(itemType: string | undefined) {
        itemType = itemType || 'button';

        return this.dropDownHeaderComponents.get(itemType) || null;
    }

    toggleMenu(open: boolean) {
        this.dropDownMenuToggleEvents.next(open);
    }
}
