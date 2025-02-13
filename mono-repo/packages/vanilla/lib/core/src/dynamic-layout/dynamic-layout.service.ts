import { Injectable, Type, signal } from '@angular/core';

import { ViewTemplate } from '../content/content.models';

/**
 * @whatItDoes Provides access to layout extension points in vanilla
 *
 * @description
 *
 * ## Overview
 *
 * This service allows for registration of `slots`. These slots can be either `single` (a slot that contains 0 or 1 component) or
 * `multi` (a slot that contains 0 - n components). A registered slot is rendered with `vn-dynamic-layout-single-slot` or
 * `vn-dynamic-layout-multi-slot` components. The rendered components can be added/removed or changed at runtime.
 *
 * ### Single slot
 *
 * Single slot can host a single component.
 *
 * ```
 * dynamicLayoutService.registerSlot('<slotName>', 'single'); // this registration is done by whoever defines the layout (mostly vanilla)
 *
 * dynamicLayoutService.setComponent('<slotName>', MyComponent, [optional_args]); // set custom component
 *
 * dynamicLayoutService.removeComponent('<slotName>'); // clear the slot
 * ```
 *
 * ### Multi slot
 *
 * Multi slot can host multiple components.
 *
 * Remarks:
 * - Only one of each component is supported (this may change in the future)
 * - Components are in no particular order (this may change in the future)
 *
 * ```
 * dynamicLayoutService.registerSlot('<slotName>', 'multi'); // this registration is done by whoever defines the layout (mostly vanilla)
 *
 * dynamicLayoutService.addComponent('<slotName>', MyComponent, [optional_args]); // add custom component
 * dynamicLayoutService.addComponent('<slotName>', MyComponent2, [optional_args]); // add custom component
 *
 * dynamicLayoutService.removeComponent('<slotName>', MyComponent); // remove specified component
 *
 * dynamicLayoutService.removeComponents('<slotName>'); // clear the slot
 * ```
 *
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class DynamicLayoutService {
    private slots = new Map<string, SingleSlot | MultiSlot>();

    registerSlot(name: string, type: SlotType) {
        if (this.slots.has(name)) {
            throw new Error(`Slot '${name}' is already registered.`);
        }

        const ctor = this.getSlotType(type);
        const slot = new ctor(name, type);

        this.slots.set(name, slot);
    }

    getSlot<T extends SingleSlot | MultiSlot>(slotName: string, slotType: SlotType): T {
        const slot = this.slots.get(slotName);

        if (!slot) {
            throw new Error(
                `Slot '${slotName}' is not registered. You misspelled the name or didn't register it (use dynamicLayoutService.registerSlot() to register a slot).`,
            );
        }

        if (slotType !== SlotType.Any) {
            const slotCtor = this.getSlotType(slotType);

            if (!(slot instanceof slotCtor)) {
                throw new Error('Requested slot is not the correct type.');
            }
        }

        return slot as T;
    }

    getSlots(): (SingleSlot | MultiSlot)[] {
        const values: (SingleSlot | MultiSlot)[] = [];
        this.slots.forEach((s) => values.push(s));

        return values;
    }

    swap(oldSlot: string, newSlot: string, component: Type<any>, attributes?: any) {
        this.removeComponent(oldSlot);
        this.setComponent(newSlot, component, attributes);
    }

    setComponent(slotName: string, component: Type<any>, attributes?: any) {
        const slot = this.getSlot<SingleSlot>(slotName, SlotType.Single);

        slot.set(component, attributes);
    }

    addComponent(slotName: string, component: Type<any>, attributes?: any) {
        const slot = this.getSlot<MultiSlot>(slotName, SlotType.Multi);

        slot.add(component, attributes);
    }

    addFirstComponent(slotName: string, component: Type<any>, attributes?: any) {
        const slot = this.getSlot<MultiSlot>(slotName, SlotType.Multi);

        slot.addFirst(component, attributes);
    }

    removeComponent(slotName: string, component?: Type<any>) {
        const slot = this.getSlot<SingleSlot | MultiSlot>(slotName, SlotType.Any);

        if (slot instanceof SingleSlot) {
            slot.remove();
        } else {
            slot.remove(component!);
        }
    }

    removeComponents(slotName: string) {
        const slot = this.getSlot<MultiSlot>(slotName, SlotType.Multi);

        slot.clear();
    }

    private getSlotType(type: SlotType): typeof SingleSlot | typeof MultiSlot {
        if (type === SlotType.Single) {
            return SingleSlot;
        } else if (type === SlotType.Multi) {
            return MultiSlot;
        } else {
            throw new Error(`Unknown slot type '${type}'.`);
        }
    }
}

/**
 * @stable
 */
export enum SlotType {
    Single = 'single',
    Multi = 'multi',
    Any = 'any',
}

/**
 * @stable
 */
export enum SlotName {
    AccountMenuHeaderLeft = 'account_menu_header_left',
    App = 'app',
    Background = 'background',
    Banner = 'banner',
    Bottom = 'bottom',
    Footer = 'footer',
    FooterItems = 'footer_items',
    FooterItemsInline = 'footer_items_inline',
    Header = 'header',
    HeaderBottomItems = 'header_bottom_items',
    HeaderSubNav = 'header_subnav',
    HeaderTopItems = 'header_top_items',
    LoginSpinner = 'login_spinner',
    Main = 'main',
    MainContentFooter = 'main_content_footer',
    MainContentHeader = 'main_content_header',
    Menu = 'menu',
    Messages = 'messages',
    NavLayoutFooter = 'nav-layout-footer',
}

/**
 * @stable
 */
export interface ComponentSlotInfo {
    component: Type<any>;
    attr: any;
}

/**
 * @stable
 */
export class BaseSlot {
    /** Dynamic HTML content. */
    content: ViewTemplate[];

    /** Signal of the slot visibility. Will instantly return current value to subscribers. */
    readonly display = signal<boolean>(false);

    protected constructor(
        public slotName: string,
        public slotType: SlotType,
    ) {}

    /** Shows the slot. */
    show() {
        this.display.set(true);
    }

    /** Hides the slot. */
    hide() {
        this.display.set(false);
    }
}

/**
 * @stable
 */
export class SingleSlot extends BaseSlot {
    component: ComponentSlotInfo | null;

    constructor(
        public override slotName: string,
        public override slotType: SlotType,
    ) {
        super(slotName, slotType);
    }

    set(component: Type<any>, attr: any) {
        this.component = { component, attr };
    }

    remove() {
        this.component = null;
    }
}

/**
 * @stable
 */
export class MultiSlot extends BaseSlot {
    components: ComponentSlotInfo[] = [];

    constructor(
        public override slotName: string,
        public override slotType: SlotType,
    ) {
        super(slotName, slotType);
    }

    add(component: Type<any>, attr: any) {
        if (this.components.some((c) => c.component === component)) {
            throw new Error(`Component '${component}' was already added to '${this.slotName}'.`);
        }

        this.components.push({ component, attr });
    }

    addFirst(component: Type<any>, attr: any) {
        if (this.components.some((c) => c.component === component)) {
            throw new Error(`Component '${component}' was already added to '${this.slotName}'.`);
        }

        this.components.unshift({ component, attr });
    }

    remove(component: Type<any>) {
        this.components = this.components.filter((c) => c.component !== component);
    }

    clear() {
        this.components = [];
    }
}
