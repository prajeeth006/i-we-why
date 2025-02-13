import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DsBadgeHarness } from '@frontend/ui/badge/testing';
import { virtual } from '@guidepup/virtual-screen-reader';

import { DsBadge } from './badge.component';

describe('DsBadgeHarness', () => {
    let fixture: ComponentFixture<BadgeTestContainer>;
    let loader: HarnessLoader;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BadgeTestContainer],
        }).compileComponents();

        fixture = TestBed.createComponent(BadgeTestContainer);
        fixture.detectChanges();
        loader = TestbedHarnessEnvironment.loader(fixture);
    });

    it('should retrieve badge text', async () => {
        const harness = await loader.getHarness(DsBadgeHarness);
        expect(await harness.getLabelText()).toBe('Initial Label');
    });

    it('should find badge with specific size and variant', async () => {
        fixture.componentRef.setInput('size', 'xsmall');
        fixture.componentRef.setInput('variant', 'secondary');

        const badges = await loader.getAllHarnesses(DsBadgeHarness.with({ size: 'xsmall', variant: 'secondary' }));
        expect(badges.length).toBe(1);
    });

    it('should find badge with specific label using filters', async () => {
        const badges = await loader.getAllHarnesses(DsBadgeHarness.with({ label: /^Initial/ }));
        expect(badges.length).toBe(1);
        expect(await badges[0].getLabelText()).toMatch(/^Initial/);
    });

    it('should react to size changes', async () => {
        fixture.componentRef.setInput('size', 'medium');

        const badge = await loader.getHarness(DsBadgeHarness.with({ size: 'medium' }));
        expect(await badge.hasSize('medium')).toBe(true);
    });

    it('should handle dynamic content in start slot', async () => {
        fixture.componentRef.setInput('injectStart', true);

        const badge = await loader.getHarness(DsBadgeHarness);
        const startSlotElement = await badge.getStartSlotElement();
        expect(startSlotElement).toBeTruthy();
        const text = await startSlotElement?.text();
        expect(text).toBe('Some Start Text');
    });

    it('should handle dynamic content in end slot', async () => {
        fixture.componentRef.setInput('injectEnd', true);

        const badge = await loader.getHarness(DsBadgeHarness);
        const endSlotElement = await badge.getEndSlotElement();
        expect(endSlotElement).toBeTruthy();
        const text = await endSlotElement?.text();
        expect(text).toBe('Some End Text');
    });

    it('should update classes when size changes', async () => {
        const badge = await loader.getHarness(DsBadgeHarness);
        expect(await badge.hasSize('medium')).toBe(true);

        fixture.componentRef.setInput('size', 'xsmall');

        expect(await badge.hasSize('xsmall')).toBe(true);
        expect(await badge.hasSize('medium')).toBe(false);
    });

    it('should not find badge with variant that is not present', async () => {
        const badges = await loader.getAllHarnesses(DsBadgeHarness.with({ variant: 'secondary' }));
        expect(badges.length).toBe(0);
    });

    it('should handle SVG content in start slot', async () => {
        fixture.componentRef.setInput('injectStartSvg', true);

        const badge = await loader.getHarness(DsBadgeHarness);
        const startSlotElement = await badge.getStartSlotElement();
        expect(startSlotElement).toBeTruthy();
        const xmlns = await startSlotElement?.getAttribute('xmlns');
        expect(xmlns?.toLowerCase()).toBe('http://www.w3.org/2000/svg');
    });

    it('should have inverse class when inverse is true', async () => {
        const harness = await loader.getHarness(DsBadgeHarness);
        expect(await harness.isInverse()).toBeFalsy();
        fixture.componentRef.setInput('inverse', true);
        expect(await harness.isInverse()).toBeTruthy();
        fixture.componentRef.setInput('inverse', false);
        expect(await harness.isInverse()).toBeFalsy();
    });

    it('should read badge content correctly with screen reader', async () => {
        fixture.componentRef.setInput('label', 'Label');
        fixture.componentRef.setInput('injectStart', true);
        fixture.componentRef.setInput('injectEnd', true);

        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();

        await virtual.start({ container: fixture.nativeElement });

        const lastSpokenPhrase = await virtual.lastSpokenPhrase();

        expect(lastSpokenPhrase).toEqual('img, Badge: Label'); // for now we are using role img till we find better solution to work with nvda app

        await virtual.stop();
    }, 10000);
});

@Component({
    standalone: true,
    imports: [DsBadge],
    template: `
        <ds-badge [size]="size" [variant]="variant" [inverse]="inverse">
            {{ label }}
            @if (injectStart) {
                <span slot="start">Some Start Text</span>
            }
            @if (injectEnd) {
                <span slot="end">Some End Text</span>
            }
            @if (injectStartSvg) {
                <svg slot="start" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path d="M0 0h24v24H0z" fill="none" />
                </svg>
            }
        </ds-badge>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
class BadgeTestContainer {
    @Input()
    label = 'Initial Label';
    @Input()
    size = 'medium'; // Default size
    @Input()
    variant = 'primary'; // Default variant
    @Input()
    inverse = false;
    @Input()
    injectStart = false; // Controls whether text is shown in the start slot
    @Input()
    injectStartSvg = false; // Controls whether SVG is shown in the start slot
    @Input()
    injectEnd = false; // Controls whether text is shown in the end slot
}
