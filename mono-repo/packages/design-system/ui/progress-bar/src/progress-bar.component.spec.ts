import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DsProgressBar } from './progress-bar.component';
import { DsProgressBarHarness } from './testing/src/progress-bar.harness';

describe('DsProgressBarHarness', () => {
    let fixture: ComponentFixture<ProgressBarTestContainer>;
    let loader: HarnessLoader;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ProgressBarTestContainer],
        }).compileComponents();

        fixture = TestBed.createComponent(ProgressBarTestContainer);
        fixture.detectChanges();
        loader = TestbedHarnessEnvironment.loader(fixture);
    });

    it('should create the component instance', () => {
        const hostComponent = fixture.componentInstance;
        expect(hostComponent).toBeTruthy();
    });

    it('should contain the progress-bar class', async () => {
        const harness = await loader.getHarness(DsProgressBarHarness);
        expect(await harness.getHostClasses()).toContain('ds-progress-bar');
    });

    it('should find progress bar with specific fill and variant', async () => {
        fixture.componentRef.setInput('fill', 'pattern');
        fixture.componentRef.setInput('variant', 'secondary');

        const harness = await loader.getAllHarnesses(DsProgressBarHarness.with({ fill: 'pattern', variant: 'secondary' }));
        expect(harness).not.toBeNull();
    });

    it('should be able to inject start and end slot', async () => {
        const harness = await loader.getHarness(DsProgressBarHarness);
        expect(await (await harness.getStartSlotElement())?.text()).toBe('StartContent');
        expect(await (await harness.getEndSlotElement())?.text()).toBe('EndContent');
    });

    it('should get the correct progress value', async () => {
        const harness = await loader.getHarness(DsProgressBarHarness);

        fixture.componentRef.setInput('value', 75);
        fixture.detectChanges();
        let value = await harness.getValue();
        expect(value).toBe(75);

        fixture.componentRef.setInput('value', 25);
        fixture.detectChanges();
        value = await harness.getValue();
        expect(value).toBe(25);
    });

    it('should find progress bar with counter', async () => {
        fixture.componentRef.setInput('showCounter', 'true');
        const harness = await loader.getHarness(DsProgressBarHarness);
        expect(await harness.isShowCounter()).toBeTruthy();
    });

    it('should match counters value with progress value', async () => {
        fixture.componentRef.setInput('showCounter', 'true');
        const harness = await loader.getHarness(DsProgressBarHarness);
        expect(await harness.isShowCounter()).toBeTruthy();

        fixture.componentRef.setInput('value', 75);
        fixture.detectChanges();
        let value = await harness.getValue();
        expect(value).toBe(75);

        const counterText = await (await harness.isShowCounter())?.text();
        expect(counterText).toBe('75');
    });

    it('should have inverse class when inverse is true', async () => {
        const harness = await loader.getHarness(DsProgressBarHarness);
        expect(await harness.getInverse()).toBe(false);
        fixture.componentInstance.isInverse = true;
        fixture.componentRef.injector.get(ChangeDetectorRef).detectChanges();
        expect(await harness.getInverse()).toBe(true);
        fixture.componentInstance.isInverse = false;
        fixture.componentRef.injector.get(ChangeDetectorRef).detectChanges();
        expect(await harness.getInverse()).toBe(false);
    });
});

@Component({
    standalone: true,
    imports: [DsProgressBar],
    template: `
        <ds-progress-bar [fill]="fill" [variant]="variant" [value]="value" [showCounter]="showCounter" [inverse]="isInverse">
            <div slot="start">StartContent</div>
            <div slot="end">EndContent</div>
        </ds-progress-bar>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
class ProgressBarTestContainer {
    isInverse = false;
    @Input() variant = 'negative';
    @Input() value = 0;
    @Input() fill = 'solid';
    @Input() showCounter = true;
}
