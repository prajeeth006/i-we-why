import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DsNotificationBubble } from '@frontend/ui/notification-bubble';
import { virtual } from '@guidepup/virtual-screen-reader';

import { DsBottomNavHarness, DsBottomNavTabHarness } from '../src/testing/src/bottom-nav.harness';
import { DsBottomNav, DsBottomNavTab } from './bottom-nav.component';

@Component({
    template: `
        <ds-bottom-nav>
            <ds-bottom-nav-tab name="sports" [active]="active === 1">Sports</ds-bottom-nav-tab>
            <ds-bottom-nav-tab name="casino" (click)="active = 2" [active]="active === 2">Casino</ds-bottom-nav-tab>
            <ds-bottom-nav-tab name="promos" [disabled]="true">Promos</ds-bottom-nav-tab>
            <ds-bottom-nav-tab name="account" [active]="active === 4">
                Account
                <ds-notification-bubble variant="primary" slot="end" size="large">
                    @if (injectContent) {
                        <span>10</span>
                    }
                </ds-notification-bubble>
            </ds-bottom-nav-tab>
        </ds-bottom-nav>
    `,
    standalone: true,
    imports: [DsBottomNav, DsBottomNavTab, DsNotificationBubble],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
class TestComponent {
    active = 1;
    bottomNav: any;
    @Input()
    injectContent = false; // Controls whether text is shown in the slot
}

describe('DsBottomNav', () => {
    let fixture: ComponentFixture<TestComponent>;
    let loader: HarnessLoader;
    let component: TestComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TestComponent);
        component = fixture.componentInstance;
        loader = TestbedHarnessEnvironment.loader(fixture);
        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    it('should load all bottom nav harnesses', async () => {
        const bottomNavs = await loader.getAllHarnesses(DsBottomNavHarness);
        expect(bottomNavs.length).toBe(1);
    });

    it('should load all tabs', async () => {
        const bottomNav = await loader.getHarness(DsBottomNavHarness);
        const tabs = await bottomNav.getTabs();
        expect(tabs.length).toBe(4);
    });

    it('should return correct tab names', async () => {
        const bottomNav = await loader.getHarness(DsBottomNavHarness);
        const tabNames = await bottomNav.getTabNames();
        expect(tabNames).toEqual(['sports', 'casino', 'promos', 'account']);
    });

    it('should update active when selecting a new tab', async () => {
        const bottomNav = await loader.getHarness(DsBottomNavHarness);
        expect(await bottomNav.getSelectedTabName()).toBe('sports');
        await bottomNav.selectTab('casino');
        expect(component.active).toBe(2);
        expect(await bottomNav.getSelectedTabName()).toBe('casino');
    });

    it('should not activate if it is disabled', async () => {
        const bottomNav = await loader.getHarness(DsBottomNavHarness);
        expect(await bottomNav.getSelectedTabName()).toBe('sports');
        await bottomNav.selectTab('promos');
        expect(await bottomNav.getSelectedTabName()).toBe('sports');
    });

    it('should set active on click', async () => {
        const bottomNav = await loader.getHarness(DsBottomNavHarness);
        expect(await bottomNav.getSelectedTabName()).toBe('sports');
        let casinoTab: DsBottomNavTabHarness = await bottomNav.getTabByName('casino');
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        await casinoTab.onClick();
        expect(await bottomNav.getSelectedTabName()).toBe('casino');
    });

    it('should navigate through bottom navigation tabs correctly with screen reader', async () => {
        fixture.componentRef.setInput('injectContent', true);
        fixture.detectChanges();
        await fixture.whenStable().then(async () => {
            await virtual.start({ container: fixture.nativeElement });
            expect(await virtual.lastSpokenPhrase()).toEqual('navigation, Bottom navigation');
            await virtual.next();
            expect(await virtual.lastSpokenPhrase()).toEqual('tablist, orientated horizontally');
            await virtual.next();
            expect(await virtual.lastSpokenPhrase()).toEqual('tab, Sports, not disabled, position 1, set size 4, selected');
            await virtual.next();
            expect(await virtual.lastSpokenPhrase()).toEqual('tab, Casino, not disabled, position 2, set size 4, not selected');
            await virtual.next();
            expect(await virtual.lastSpokenPhrase()).toEqual('tab, Promos, disabled, position 3, set size 4, not selected');
            await virtual.next();
            expect(await virtual.lastSpokenPhrase()).toEqual('tab, Account Notification 10, not disabled, position 4, set size 4, not selected');
            await virtual.next();
            await virtual.next();
            expect(await virtual.lastSpokenPhrase()).toEqual('status, Notification 10');
            await virtual.next();
            await virtual.next();
            await virtual.next();
            await virtual.next();
            expect(await virtual.lastSpokenPhrase()).toEqual('end of tablist, orientated horizontally');
            await virtual.next();
            expect(await virtual.lastSpokenPhrase()).toEqual('end of navigation, Bottom navigation');
        });
    }, 10000);
});
