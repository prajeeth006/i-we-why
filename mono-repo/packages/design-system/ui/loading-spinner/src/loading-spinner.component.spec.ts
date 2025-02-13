import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DsLoadingSpinnerHarness } from '@frontend/ui/loading-spinner/testing';

import { DsLoadingSpinner } from './loading-spinner.component';

describe('DsLoadingSpinnerHarness', () => {
    let fixture: ComponentFixture<DsLoadingSpinner>;
    let loader: HarnessLoader;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CardTestContainer],
        }).compileComponents();

        fixture = TestBed.createComponent(CardTestContainer);
        fixture.detectChanges();
        loader = TestbedHarnessEnvironment.loader(fixture);
    });

    it('should retrieve loading spinner', async () => {
        const harness = await loader.getHarness(DsLoadingSpinnerHarness);
        expect(await (await harness.getSvg()).getAttribute('xmlns')).toBe('http://www.w3.org/2000/svg');
    });

    it('should render with the correct CSS classes', async () => {
        const harness = await loader.getHarness(DsLoadingSpinnerHarness);
        const hostClasses = await (await harness.host()).getAttribute('class');
        expect(hostClasses).toContain('ds-loading-spinner');
    });

    it('should have the correct aria attributes', async () => {
        const harness = await loader.getHarness(DsLoadingSpinnerHarness);
        expect(await harness.getAriaLive()).toBe('polite');
        expect(await harness.getAriaBusy()).toBe('true');
        expect(await harness.getAriaLabel()).toBe('Loading');
        expect(await harness.getRole()).toBe('status');
    });

    it('should render the SVG with the correct class', async () => {
        const harness = await loader.getHarness(DsLoadingSpinnerHarness);
        expect(await harness.hasSvgClass('ds-loading-spinner-svg')).toBe(true);
    });
});

@Component({
    standalone: true,
    imports: [DsLoadingSpinner],
    template: ` <ds-loading-spinner /> `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
class CardTestContainer {}
