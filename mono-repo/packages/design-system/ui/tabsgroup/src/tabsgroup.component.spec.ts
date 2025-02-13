import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DsTabsGroupHarness } from '@frontend/ui/tabsgroup/testing';
import { virtual } from '@guidepup/virtual-screen-reader';

import { DsTab } from './tab.component';
import { DsTabContent, DsTabHeader } from './tabs.directives';
import { DsTabsGroup } from './tabsgroup.component';
import { TabsGroupIndicatorType, TabsGroupSizesType, TabsGroupVariantsType } from './tabsgroup.types';

// needed when run with Jest as it doesn't support ResizeObserver
class ResizeObserverMock {
    // eslint-disable-next-line @typescript-eslint/class-methods-use-this
    observe() {}
    // eslint-disable-next-line @typescript-eslint/class-methods-use-this
    unobserve() {}
    // eslint-disable-next-line @typescript-eslint/class-methods-use-this
    disconnect() {}
}

// eslint-disable-next-line jest/no-disabled-tests
describe('DsTabsGroupHarness', () => {
    let fixture: ComponentFixture<TabsGroupTestContainer>;
    let loader: HarnessLoader;

    beforeEach(() => {
        window['ResizeObserver'] = ResizeObserverMock;

        TestBed.configureTestingModule({ imports: [TabsGroupTestContainer, DsTab, DsTabHeader, DsTabContent] });

        fixture = TestBed.createComponent(TabsGroupTestContainer);

        fixture.detectChanges();
        loader = TestbedHarnessEnvironment.loader(fixture);
    });

    it('should load all tabsGroup harnesses', async () => {
        const tabsGroup = await loader.getAllHarnesses(DsTabsGroupHarness);
        expect(tabsGroup.length).toBe(3);
    });

    it('should load fullWidthTabs', async () => {
        const tabsGroup = await loader.getAllHarnesses(
            DsTabsGroupHarness.with({
                fullWidth: true,
            }),
        );
        expect(tabsGroup.length).toBe(1);
    });

    it('should load scrollable tab groups', async () => {
        const tabsGroup = await loader.getAllHarnesses(
            DsTabsGroupHarness.with({
                scrollable: true,
            }),
        );
        expect(tabsGroup.length).toBe(1);
    });

    it('should load small and large tab groups', async () => {
        const tabsGroup = await loader.getAllHarnesses(
            DsTabsGroupHarness.with({
                size: 'small',
            }),
        );
        expect(tabsGroup.length).toBe(1);

        const tabsGroup2 = await loader.getAllHarnesses(
            DsTabsGroupHarness.with({
                size: 'large',
            }),
        );
        // one default and one static
        expect(tabsGroup2.length).toBe(2);
    });

    it('should load underline and fill tab groups', async () => {
        const underlineTabsGroup = await loader.getAllHarnesses(
            DsTabsGroupHarness.with({
                indicator: 'underline',
            }),
        );
        // one default, one dynamic
        expect(underlineTabsGroup.length).toBe(2);

        const fillTabGroup = await loader.getAllHarnesses(
            DsTabsGroupHarness.with({
                indicator: 'fill',
            }),
        );
        // one static attribute
        expect(fillTabGroup.length).toBe(1);
    });

    it('should select tab', async () => {
        const tabsGroup = await loader.getHarness(DsTabsGroupHarness.with({ scrollable: true }));
        expect(tabsGroup).toBeTruthy();
        // default tab is the first one
        expect(await (await tabsGroup.getSelectedTab()).getText()).toBe('Tab1');

        await tabsGroup.selectTab({ text: 'Tab2' });
        // we cannot select a disabled tab, that's why we still get to see Tab1
        expect(await (await tabsGroup.getSelectedTab()).getText()).toBe('Tab1');

        await tabsGroup.selectTab({ text: 'Tab3' });
        expect(await (await tabsGroup.getSelectedTab()).getText()).toBe('Tab3');
    });

    it('should update selected tab based on input', async () => {
        const tabsGroup = await loader.getHarness(DsTabsGroupHarness.with({ scrollable: true }));
        expect(tabsGroup).toBeTruthy();

        fixture.componentRef.setInput('activeTab', '7');
        fixture.detectChanges();

        // count start from 0 while tabs start from 1 so we have Tab7 instead of Tab6
        expect(await (await tabsGroup.getSelectedTab()).getText()).toBe('Tab7');

        await tabsGroup.selectTab({ text: 'Tab3' });
        expect(await (await tabsGroup.getSelectedTab()).getText()).toBe('Tab3');
    });

    it('should be able to filter tabsgroup by there size', async () => {
        const tabsGroup = await loader.getHarness(DsTabsGroupHarness.with({ size: 'large' }));
        expect(await tabsGroup.isSize('large')).toBeTruthy();
        expect(await tabsGroup.isSize('small')).toBeFalsy();
    });

    it('should emit onTabOptionChange event when we select tab', async () => {
        const component = fixture.componentInstance;

        const spyOnTabOptionChange = jest.spyOn(component, 'onTabOptionChange');

        const tabsGroup = await loader.getHarness(DsTabsGroupHarness.with({ scrollable: true }));
        await tabsGroup.selectTab({ text: 'Tab3' });

        expect(await (await tabsGroup.getSelectedTab()).getText()).toBe('Tab3');
        expect(spyOnTabOptionChange).toHaveBeenCalled();
        expect(await component.selectedTabName).toBe('3');
    });

    it('should have inverse class when inverse is true', async () => {
        const harness = await loader.getHarness(DsTabsGroupHarness);
        expect(await harness.isInverse()).toBeFalsy();
        fixture.componentRef.setInput('inverse', true);
        expect(await harness.isInverse()).toBeTruthy();
        fixture.componentRef.setInput('inverse', false);
        expect(await harness.isInverse()).toBeFalsy();
    });

    it('should emit tabChanged event when we select tab', async () => {
        const component = fixture.componentInstance;

        const spyOnTabChange = jest.spyOn(component, 'onTabChanged');

        const tabsGroup = await loader.getHarness(DsTabsGroupHarness.with({ scrollable: true }));
        await tabsGroup.selectTab({ text: 'Tab3' });

        expect(await (await tabsGroup.getSelectedTab()).getText()).toBe('Tab3');
        expect(spyOnTabChange).toHaveBeenCalled();
        expect(await component.selectedTabObj.name).toBe('3');
    });

    it('should navigate through tabs correctly with screen reader', async () => {
        await virtual.start({ container: fixture.nativeElement });
        expect(await virtual.lastSpokenPhrase()).toEqual('tablist, orientated horizontally');
        await virtual.next();
        let phrase = await getLastPhrases();
        ['tab', 'Tab1', 'not disabled', 'selected'].every((item) => expect(phrase.includes(item)).toBeTruthy());
        await virtual.next();
        phrase = await getLastPhrases();
        ['tab', 'Tab2', 'not disabled', 'not selected'].every((item) => expect(phrase.includes(item)).toBeTruthy());
        await virtual.next();
        phrase = await getLastPhrases();
        ['tab', 'Tab3', 'disabled', 'not selected'].every((item) => expect(phrase.includes(item)).toBeTruthy());
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toEqual('end of tablist, orientated horizontally');
    }, 10_000);
});

const getLastPhrases = async (): Promise<string[]> => {
    const lastSpoken = await virtual.lastSpokenPhrase();
    return lastSpoken.split(',');
};

@Component({
    template: `
        <ds-tabs-group [activeTab]="activeTab" size="large" [inverse]="inverse" [variant]="variant" [indicator]="indicator" [scrollable]="false">
            <ds-tab name="1" title="Tab1">
                <ng-container *dsTabHeader>
                    <svg width="16px" height="16px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M2 3.81818H4.72727V2H19.2727V3.81818H22V6.90405C22 7.81592 21.5443 8.66745 20.7855 9.17327L19.9598 9.72377C19.7336 9.87456 19.4875 9.98985 19.2298 10.067C18.8764 13.3209 16.3765 15.9307 13.1755 16.4509L13.0386 18.3683C12.9686 19.3483 13.7448 20.1818 14.7273 20.1818H16.5455C17.0475 20.1818 17.4545 20.5889 17.4545 21.0909V22H6.54545V21.0909C6.54545 20.5889 6.95247 20.1818 7.45455 20.1818H9.13849C10.1937 20.1818 11.027 19.2865 10.9518 18.2341L10.8244 16.4509C7.62344 15.9307 5.12361 13.3209 4.77015 10.067C4.51255 9.98985 4.26639 9.87456 4.04021 9.72377L3.21445 9.17327C2.45573 8.66745 2 7.81592 2 6.90405V3.81818ZM12 4.72727L13.0474 6.9221L15.4584 7.23993L13.6946 8.91428L14.1374 11.3055L12 10.1454L9.8626 11.3055L10.3054 8.91428L8.54161 7.23993L10.9527 6.9221L12 4.72727Z"
                            fill="#252D41" />
                    </svg>
                    <div>Tab1</div>
                </ng-container>
                <div *dsTabContent>Tab content 1</div>
            </ds-tab>

            <ds-tab name="2" title="Tab2">
                <ng-container *dsTabHeader>
                    <svg width="16px" height="16px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M2 3.81818H4.72727V2H19.2727V3.81818H22V6.90405C22 7.81592 21.5443 8.66745 20.7855 9.17327L19.9598 9.72377C19.7336 9.87456 19.4875 9.98985 19.2298 10.067C18.8764 13.3209 16.3765 15.9307 13.1755 16.4509L13.0386 18.3683C12.9686 19.3483 13.7448 20.1818 14.7273 20.1818H16.5455C17.0475 20.1818 17.4545 20.5889 17.4545 21.0909V22H6.54545V21.0909C6.54545 20.5889 6.95247 20.1818 7.45455 20.1818H9.13849C10.1937 20.1818 11.027 19.2865 10.9518 18.2341L10.8244 16.4509C7.62344 15.9307 5.12361 13.3209 4.77015 10.067C4.51255 9.98985 4.26639 9.87456 4.04021 9.72377L3.21445 9.17327C2.45573 8.66745 2 7.81592 2 6.90405V3.81818ZM12 4.72727L13.0474 6.9221L15.4584 7.23993L13.6946 8.91428L14.1374 11.3055L12 10.1454L9.8626 11.3055L10.3054 8.91428L8.54161 7.23993L10.9527 6.9221L12 4.72727Z"
                            fill="#252D41" />
                    </svg>
                    <div>Tab2</div>
                </ng-container>
                <div *dsTabContent>Tab content 2</div>
            </ds-tab>

            <ds-tab name="3" title="Tab3" disabled="true">
                <ng-container *dsTabHeader>
                    <svg width="16px" height="16px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M2 3.81818H4.72727V2H19.2727V3.81818H22V6.90405C22 7.81592 21.5443 8.66745 20.7855 9.17327L19.9598 9.72377C19.7336 9.87456 19.4875 9.98985 19.2298 10.067C18.8764 13.3209 16.3765 15.9307 13.1755 16.4509L13.0386 18.3683C12.9686 19.3483 13.7448 20.1818 14.7273 20.1818H16.5455C17.0475 20.1818 17.4545 20.5889 17.4545 21.0909V22H6.54545V21.0909C6.54545 20.5889 6.95247 20.1818 7.45455 20.1818H9.13849C10.1937 20.1818 11.027 19.2865 10.9518 18.2341L10.8244 16.4509C7.62344 15.9307 5.12361 13.3209 4.77015 10.067C4.51255 9.98985 4.26639 9.87456 4.04021 9.72377L3.21445 9.17327C2.45573 8.66745 2 7.81592 2 6.90405V3.81818ZM12 4.72727L13.0474 6.9221L15.4584 7.23993L13.6946 8.91428L14.1374 11.3055L12 10.1454L9.8626 11.3055L10.3054 8.91428L8.54161 7.23993L10.9527 6.9221L12 4.72727Z"
                            fill="#252D41" />
                    </svg>
                    <div>Tab3</div>
                </ng-container>
                <div *dsTabContent>Tab content 3</div>
            </ds-tab>
        </ds-tabs-group>

        <ds-tabs-group [activeTab]="activeTab" size="small" [inverse]="inverse" [variant]="variant" [scrollable]="false">
            <ds-tab name="1" title="Tab1">
                <ng-container *dsTabHeader>
                    <svg width="16px" height="16px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M2 3.81818H4.72727V2H19.2727V3.81818H22V6.90405C22 7.81592 21.5443 8.66745 20.7855 9.17327L19.9598 9.72377C19.7336 9.87456 19.4875 9.98985 19.2298 10.067C18.8764 13.3209 16.3765 15.9307 13.1755 16.4509L13.0386 18.3683C12.9686 19.3483 13.7448 20.1818 14.7273 20.1818H16.5455C17.0475 20.1818 17.4545 20.5889 17.4545 21.0909V22H6.54545V21.0909C6.54545 20.5889 6.95247 20.1818 7.45455 20.1818H9.13849C10.1937 20.1818 11.027 19.2865 10.9518 18.2341L10.8244 16.4509C7.62344 15.9307 5.12361 13.3209 4.77015 10.067C4.51255 9.98985 4.26639 9.87456 4.04021 9.72377L3.21445 9.17327C2.45573 8.66745 2 7.81592 2 6.90405V3.81818ZM12 4.72727L13.0474 6.9221L15.4584 7.23993L13.6946 8.91428L14.1374 11.3055L12 10.1454L9.8626 11.3055L10.3054 8.91428L8.54161 7.23993L10.9527 6.9221L12 4.72727Z"
                            fill="#252D41" />
                    </svg>
                    <div>Tab1</div>
                </ng-container>
                <div *dsTabContent>Tab content 1</div>
            </ds-tab>

            <ds-tab name="2" title="Tab2">
                <ng-container *dsTabHeader>
                    <svg width="16px" height="16px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M2 3.81818H4.72727V2H19.2727V3.81818H22V6.90405C22 7.81592 21.5443 8.66745 20.7855 9.17327L19.9598 9.72377C19.7336 9.87456 19.4875 9.98985 19.2298 10.067C18.8764 13.3209 16.3765 15.9307 13.1755 16.4509L13.0386 18.3683C12.9686 19.3483 13.7448 20.1818 14.7273 20.1818H16.5455C17.0475 20.1818 17.4545 20.5889 17.4545 21.0909V22H6.54545V21.0909C6.54545 20.5889 6.95247 20.1818 7.45455 20.1818H9.13849C10.1937 20.1818 11.027 19.2865 10.9518 18.2341L10.8244 16.4509C7.62344 15.9307 5.12361 13.3209 4.77015 10.067C4.51255 9.98985 4.26639 9.87456 4.04021 9.72377L3.21445 9.17327C2.45573 8.66745 2 7.81592 2 6.90405V3.81818ZM12 4.72727L13.0474 6.9221L15.4584 7.23993L13.6946 8.91428L14.1374 11.3055L12 10.1454L9.8626 11.3055L10.3054 8.91428L8.54161 7.23993L10.9527 6.9221L12 4.72727Z"
                            fill="#252D41" />
                    </svg>
                    <div>Tab1</div>
                </ng-container>
                <div *dsTabContent>Tab content 2</div>
            </ds-tab>

            <ds-tab name="3" title="Tab3" disabled="true">
                <ng-container *dsTabHeader>
                    <svg width="16px" height="16px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M2 3.81818H4.72727V2H19.2727V3.81818H22V6.90405C22 7.81592 21.5443 8.66745 20.7855 9.17327L19.9598 9.72377C19.7336 9.87456 19.4875 9.98985 19.2298 10.067C18.8764 13.3209 16.3765 15.9307 13.1755 16.4509L13.0386 18.3683C12.9686 19.3483 13.7448 20.1818 14.7273 20.1818H16.5455C17.0475 20.1818 17.4545 20.5889 17.4545 21.0909V22H6.54545V21.0909C6.54545 20.5889 6.95247 20.1818 7.45455 20.1818H9.13849C10.1937 20.1818 11.027 19.2865 10.9518 18.2341L10.8244 16.4509C7.62344 15.9307 5.12361 13.3209 4.77015 10.067C4.51255 9.98985 4.26639 9.87456 4.04021 9.72377L3.21445 9.17327C2.45573 8.66745 2 7.81592 2 6.90405V3.81818ZM12 4.72727L13.0474 6.9221L15.4584 7.23993L13.6946 8.91428L14.1374 11.3055L12 10.1454L9.8626 11.3055L10.3054 8.91428L8.54161 7.23993L10.9527 6.9221L12 4.72727Z"
                            fill="#252D41" />
                    </svg>
                    <div>Tab1</div>
                </ng-container>
                <div *dsTabContent>Tab content 3</div>
            </ds-tab>
        </ds-tabs-group>

        <ds-tabs-group
            [activeTab]="activeTab"
            fullWidthTabs
            scrollable
            indicator="fill"
            (activeTabChanged)="onTabOptionChange($event)"
            (tabChanged)="onTabChanged($event)"
            [inverse]="inverse">
            <ds-tab name="1" title="Tab1">
                <div>Tab content 1</div>
            </ds-tab>
            <ds-tab name="2" title="Tab2" disabled="true">
                <div>Tab content 2</div>
            </ds-tab>
            <ds-tab name="3" title="Tab3">
                <div>Tab content 3</div>
            </ds-tab>
            <ds-tab name="4" title="Tab4">
                <div>Tab content 4</div>
            </ds-tab>
            <ds-tab name="5" title="Tab5">
                <div>Tab content 5</div>
            </ds-tab>
            <ds-tab name="6" title="Tab6">
                <div>Tab content 6</div>
            </ds-tab>
            <ds-tab name="7" title="Tab7">
                <div>Tab content 7</div>
            </ds-tab>
            <ds-tab name="8" title="Tab8">
                <div>Tab content 8</div>
            </ds-tab>
            <ds-tab name="9" title="Tab9">
                <div>Tab content 9</div>
            </ds-tab>
        </ds-tabs-group>
    `,
    standalone: true,
    imports: [DsTabsGroup, DsTab, DsTabHeader, DsTabContent],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
class TabsGroupTestContainer {
    @Input() activeTab = '1';

    @Input() size: TabsGroupSizesType = 'large';
    @Input() variant: TabsGroupVariantsType = 'vertical';
    @Input() indicator: TabsGroupIndicatorType = 'underline';
    @Input() inverse = false;

    selectedTabName: any;
    selectedTabObj: any;

    onTabOptionChange(event: any) {
        this.selectedTabName = event;
    }

    onTabChanged(event: any) {
        this.selectedTabObj = event;
    }
}
