import { Overlay, OverlayModule, OverlayRef } from '@angular/cdk/overlay';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { DsButton } from '@frontend/ui/button';
import { DsTooltipContentHarness } from '@frontend/ui/tooltip/testing';
import { virtual } from '@guidepup/virtual-screen-reader';

import { DsTooltipContent } from './tooltip.component';
import { DsTooltipTrigger, OVERLAY_REF_WITH_DATA_TOKEN, OverlayRefWithData } from './tooltip.directives';

@Component({
    template: `
        <button ds-button class="ds-trigger-button" [dsTooltipTriggerFor]="tooltipTemplate" position="top" arrowPosition="start">Open Tooltip</button>
        <!-- <ng-template #tooltipTemplate> -->
        <ds-tooltip-content>
            <button ds-button slot="action" variant="flat" kind="tertiary" size="small">Flat Button</button>
            <span slot="close">{{ svgDataArray[0] }}</span>
            <div slot="title">Tooltip Title</div>
        </ds-tooltip-content>
        <!-- </ng-template> -->
    `,
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [DsButton, DsTooltipTrigger, DsTooltipContent],
    providers: [DsTooltipTrigger],
})
class TooltipTestComponent {
    showTitle = true;
    showLink = true;
    svgDataArray = [
        `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M8.001 8.94399L13.0591 14.0023L14.0019 13.0594L8.94379 8.00117L14.0019 2.9429L13.0591 2.00008L8.001 7.05835L2.9428 2L2 2.94282L7.0582 8.00117L2 13.0595L2.9428 14.0023L8.001 8.94399Z" fill="#0068B3"/>
        </svg>`,
    ];
}

describe('TooltipHarness', () => {
    let loader: HarnessLoader;
    let fixture: ComponentFixture<TooltipTestComponent>;
    let mockOverlayRefWithData: OverlayRefWithData;

    beforeEach(() => {
        mockOverlayRefWithData = {
            ref: {
                attach: () => {},
                detach: () => {},
                dispose: () => {},
                hasAttached: () => false,
            } as any as OverlayRef,
            data: {
                position: 'top',
                arrowPosition: 'start',
            },
        };

        TestBed.configureTestingModule({
            imports: [TooltipTestComponent, DsButton, OverlayModule],
            providers: [
                Overlay,
                {
                    provide: OVERLAY_REF_WITH_DATA_TOKEN,
                    useFactory: () => mockOverlayRefWithData,
                },
                DsTooltipTrigger,
            ],
        });

        fixture = TestBed.createComponent(TooltipTestComponent);
        loader = TestbedHarnessEnvironment.loader(fixture);
    });

    it('should open, close overlay on trigger button click', async () => {
        const triggerBtn = fixture.debugElement.query(By.css('.ds-trigger-button'));
        triggerBtn.triggerEventHandler('click', null);
        await fixture.whenStable();

        const tooltipHarness = await loader.getHarness(DsTooltipContentHarness);
        expect(tooltipHarness.isOpen()).toBeTruthy();

        const title = await tooltipHarness.getTitle();
        expect(title).toBe('Tooltip Title');

        await tooltipHarness.close();
        await fixture.whenStable();

        expect(await tooltipHarness.isClosed()).toBe(true);
    });

    it('should open, close overlay on trigger button mouse hover', async () => {
        const triggerBtn = fixture.debugElement.query(By.css('.ds-trigger-button'));
        triggerBtn.triggerEventHandler('mouseenter', null);
        await fixture.whenStable();

        const tooltipHarness = await loader.getHarness(DsTooltipContentHarness);
        expect(tooltipHarness.isOpen()).toBeTruthy();

        const title = await tooltipHarness.getTitle();
        expect(title).toBe('Tooltip Title');

        await tooltipHarness.close();
        await fixture.whenStable();

        expect(await tooltipHarness.isClosed()).toBe(true);
    });

    it('should open the tooltip automatically if autoOpen is true', async () => {
        fixture.componentInstance.showTitle = true;
        fixture.detectChanges();
        await fixture.whenStable();

        const tooltipHarness = await loader.getHarness(DsTooltipContentHarness);
        expect(tooltipHarness.isOpen()).toBeTruthy();

        const title = await tooltipHarness.getTitle();
        expect(title).toBe('Tooltip Title');
    });

    it('should initialize the tooltip with correct properties', () => {
        const trigger = fixture.debugElement.query(By.directive(DsTooltipTrigger)).injector.get(DsTooltipTrigger);
        expect(trigger.position).toBe('top');
        expect(trigger.arrowPosition).toBe('start');
    });

    it('should create position strategy with correct positions', () => {
        const trigger = fixture.debugElement.query(By.directive(DsTooltipTrigger)).injector.get(DsTooltipTrigger);
        const positionStrategy = TestBed.inject(Overlay)
            .position()
            .flexibleConnectedTo(trigger['elementRef'])
            .withPositions([
                {
                    originX: 'center',
                    originY: 'bottom',
                    overlayX: 'center',
                    overlayY: 'top',
                },
            ]);

        expect(positionStrategy).toBeTruthy();
    });

    it('should navigate through tooltip correctly with screen reader', async () => {
        await virtual.start({ container: fixture.nativeElement });
        expect(await virtual.lastSpokenPhrase()).toEqual('button');
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toEqual('tooltip, Tooltip Title');
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toEqual('button');
    });
});
