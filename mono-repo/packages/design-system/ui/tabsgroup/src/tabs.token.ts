import { InjectionToken, Provider } from '@angular/core';

export type TabsOptions = {
    /*
     * Whether the tabs should take up the full width of the container.
     */
    fullWidthTabs: boolean;
    defaultScrollDistance: number;
    defaultScrollSpeed: string;
};

const scrollDistance = 200;

const DEFAULT_TAB_OPTIONS: TabsOptions = {
    fullWidthTabs: false,
    defaultScrollDistance: scrollDistance,
    defaultScrollSpeed: 'faster',
};

export const DS_TAB_OPTIONS = new InjectionToken<TabsOptions>('TAB_OPTIONS', {
    providedIn: 'root',
    factory: () => DEFAULT_TAB_OPTIONS,
});

export const provideTabOptions = (options: Partial<TabsOptions>) =>
    ({
        provide: DS_TAB_OPTIONS,
        useValue: { ...DEFAULT_TAB_OPTIONS, ...options },
    }) satisfies Provider;
