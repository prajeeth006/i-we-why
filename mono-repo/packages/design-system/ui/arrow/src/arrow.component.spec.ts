import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DsArrowHarness } from '@frontend/ui/arrow/testing';
import { virtual } from '@guidepup/virtual-screen-reader';

import { DsArrow } from './arrow.component';

describe('DsArrowComponent', () => {
    let fixture: ComponentFixture<ArrowTestContainer>;
    let loader: HarnessLoader;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DsArrow],
        }).compileComponents();

        fixture = TestBed.createComponent(ArrowTestContainer);
        fixture.detectChanges();
        loader = TestbedHarnessEnvironment.loader(fixture);
    });

    it('should load all Arrow harnesses', async () => {
        const arrows = await loader.getAllHarnesses(DsArrowHarness);
        expect(arrows.length).toBe(2);
    });

    it('should be able to filter Arrow by there size', async () => {
        const arrow = await loader.getHarness(DsArrowHarness.with({ size: 'large' }));
        expect(await arrow.hasSize('large')).toBeTruthy();
        expect(await arrow.hasSize('small')).toBeFalsy();
    });

    it('should find arrow with specific size and variant', async () => {
        fixture.componentRef.setInput('size', 'small');
        fixture.componentRef.setInput('variant', 'strong');

        const arrows = await loader.getAllHarnesses(DsArrowHarness.with({ size: 'small', variant: 'strong' }));
        expect(arrows.length).toBe(1);
    });

    it('should be able to click a Arrow', async () => {
        const arrow = await loader.getHarness(DsArrowHarness.with({ size: 'large' }));
        expect(fixture.componentInstance.isClicked).toBeFalsy();
        await arrow.click();
        expect(fixture.componentInstance.isClicked).toBeTruthy();
    });

    it('should have inverse class when inverse is true', async () => {
        const harness = await loader.getHarness(DsArrowHarness);
        expect(await harness.isInverse()).toBeFalsy();
        fixture.componentRef.setInput('inverse', true);
        expect(await harness.isInverse()).toBeTruthy();
        fixture.componentRef.setInput('inverse', false);
        expect(await harness.isInverse()).toBeFalsy();
    });

    it('should have role button', async () => {
        const search = await loader.getHarness(DsArrowHarness);
        expect(await search.getRole()).toBe('button');
    });

    it('should have aria-label left arrow', async () => {
        const search = await loader.getHarness(DsArrowHarness);
        expect(await search.getAriaLabel()).toBe('left arrow');
    });

    it('should read arrows correctly with screen reader', async () => {
        fixture.detectChanges();
        await fixture.whenStable();

        await virtual.start({ container: fixture.nativeElement });

        expect(await virtual.lastSpokenPhrase()).toBe('button, left arrow');
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toBe('button, right arrow');
    });
});

@Component({
    template: `
        <ds-arrow class="ds-arrow" size="large" [inverse]="inverse" [variant]="variant" (click)="isClicked = true">
            <ng-template #dsArrow>
                <svg width="11" height="20" viewBox="0 0 11 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M0.281018 10.3847L9.28102 19.695L10.719 18.305L2.41443 9.71403L10.6946 1.71939L9.30541 0.280582L0.305412 8.97024C0.114541 9.15453 0.00472972 9.40712 0.000154933 9.6724C-0.00441985 9.93768 0.0966153 10.1939 0.281018 10.3847Z"
                        fill="currentColor" />
                </svg>
            </ng-template>
        </ds-arrow>
        <ds-arrow class="ds-arrow" size="small" direction="right" [inverse]="inverse" [variant]="variant">
            <ng-template #dsArrow>
                <svg width="11" height="20" viewBox="0 0 11 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M10.719 10.3847L1.71898 19.695L0.281006 18.305L8.58557 9.71403L0.305399 1.71939L1.69459 0.280582L10.6946 8.97024C10.8855 9.15453 10.9953 9.40712 10.9998 9.6724C11.0044 9.93768 10.9034 10.1939 10.719 10.3847Z"
                        fill="currentColor" />
                </svg>
            </ng-template>
        </ds-arrow>
    `,
    host: {
        class: 'ds-arrow',
    },
    standalone: true,
    imports: [DsArrow],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
class ArrowTestContainer {
    isClicked = false;
    @Input() inverse = false;
    @Input() size = 'small';
    @Input() variant = 'strong'; // Default variant
}
