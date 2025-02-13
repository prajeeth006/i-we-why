import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { virtual } from '@guidepup/virtual-screen-reader';

import { DsAccordionModule } from './index';
import { DsAccordionHarness } from './testing/src/accordion.harness';

describe('DsAccordionHarness', () => {
    let fixture: ComponentFixture<AccordionTestContainer>;
    let loader: HarnessLoader;
    //
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AccordionTestContainer],
        }).compileComponents();

        fixture = TestBed.createComponent(AccordionTestContainer);
        fixture.detectChanges();
        loader = TestbedHarnessEnvironment.loader(fixture);
    });

    it('should be able to create component instance', () => {
        const hostComponent = fixture.componentInstance;
        expect(hostComponent).toBeTruthy();
    });

    it('should contain accordion class', async () => {
        const harness = await loader.getHarness(DsAccordionHarness);
        expect(await harness.getHostClasses()).toContain('ds-accordion');
    });

    it('should find accordion with specific size and variant', async () => {
        fixture.componentRef.setInput('size', 'small');
        fixture.componentRef.setInput('variant', 'surface-highest');

        const harness = await loader.getAllHarnesses(DsAccordionHarness.with({ size: 'small', variant: 'surface-highest' }));
        expect(harness).not.toBeNull();
    });

    it('should open and close accordion', async () => {
        fixture.componentRef.setInput('showWithCustom', true);
        const harness = await loader.getHarness(DsAccordionHarness);
        const headerHarness = await harness.getAccordionHeaderHarness();
        const trigger = await headerHarness?.getTriggerElement();
        expect(trigger).not.toBeNull();
        expect(headerHarness).not.toBeNull();
        expect(await harness.isOpen()).toBeFalsy();
        expect(await trigger?.text()).toBe('c-open');
        await headerHarness?.click();
        expect(await harness.isOpen()).toBeTruthy();
        expect(await trigger?.text()).toBe('c-close');
        await headerHarness?.click();
        expect(await harness.isOpen()).toBeFalsy();
        expect(await trigger?.text()).toBe('c-open');
    });

    it('should find harness by title', async () => {
        const harness = await loader.getHarness(DsAccordionHarness.with({ headerTitle: 'Accordion', headerSubtitle: 'Optional Subtext' }));
        expect(harness).toBeTruthy();
    });

    it('should have inverse class when inverse is true', async () => {
        const harness = await loader.getHarness(DsAccordionHarness);
        expect(await harness.isInverse()).toBeFalsy();
        fixture.componentRef.setInput('inverse', true);
        expect(await harness.isInverse()).toBeTruthy();
        fixture.componentRef.setInput('inverse', false);
        expect(await harness.isInverse()).toBeFalsy();
    });

    it('should switch to correct open state', async () => {
        const harness = await loader.getHarness(DsAccordionHarness);
        const contentHarness1 = await harness.getAccordionContentHarness();
        expect(await harness.isOpen()).toBeFalsy();
        expect(contentHarness1).toBeNull();
        fixture.componentRef.setInput('open', true);
        const contentHarness2 = await harness.getAccordionContentHarness();
        expect(await harness.isOpen()).toBeTruthy();
        expect(contentHarness2).not.toBeNull();
        expect(await contentHarness2?.getContentText()).toBe('content');
        fixture.componentRef.setInput('open', false);
        const contentHarness3 = await harness.getAccordionContentHarness();
        expect(await harness.isOpen()).toBeFalsy();
        expect(contentHarness3).toBeNull();
    });

    it('should handle dynamic content in start slot', async () => {
        const harness = await loader.getHarness(DsAccordionHarness);
        const headerHarness = await harness.getAccordionHeaderHarness();
        const startSlotElement = await headerHarness?.getStartSlotElement();
        const text = await startSlotElement?.text();
        expect(text).toBe('LogoAccordionOptional Subtext');
    });

    it('should handle dynamic content in end slot', async () => {
        const harness = await loader.getHarness(DsAccordionHarness);
        const headerHarness = await harness.getAccordionHeaderHarness();
        const endSlotElement = await headerHarness?.getEndSlotElement();
        const text = await endSlotElement?.text();
        expect(text).toBe('SlotSlot');
    });

    it('should handle keyboard navigation', async () => {
        const harness = await loader.getHarness(DsAccordionHarness);
        await virtual.start({ container: fixture.nativeElement });
        expect(await virtual.lastSpokenPhrase()).toEqual('Logo');
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toEqual('Accordion');
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toEqual('Optional Subtext');
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toEqual('Slot');
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toEqual('Slot');
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toEqual('button, Open Accordion');
        expect(await harness.isOpen()).toBeFalsy();
        await virtual.act();
        expect(await harness.isOpen()).toBeTruthy();
        // As DOM is modified, the virtual screen reader is reset when calling next to first element
        await virtual.next();
        await virtual.next();
        await virtual.next();
        await virtual.next();
        await virtual.next();
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toEqual('button, Close Accordion');
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toEqual('content');
        await virtual.previous();
        expect(await virtual.lastSpokenPhrase()).toEqual('button, Close Accordion');
        expect(await harness.isOpen()).toBeTruthy();
        await virtual.act();
        expect(await harness.isOpen()).toBeFalsy();
        // As DOM is modified, the virtual screen reader is reset when calling next to first element
        await virtual.next();
        await virtual.next();
        await virtual.next();
        await virtual.next();
        await virtual.next();
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toEqual('button, Open Accordion');
    }, 10000);
});

@Component({
    standalone: true,
    imports: [DsAccordionModule],
    template: `
        @if (showWithCustom) {
            <ds-accordion [inverse]="inverse" [size]="size" [variant]="variant" [open]="open">
                <ds-accordion-header>
                    <ng-container slot="start">
                        <span>Logo</span>
                        <div class="ds-accordion-text">
                            <div slot="title">Accordion</div>
                            <div slot="subtitle">Optional Subtext</div>
                        </div>
                    </ng-container>

                    <ng-container slot="end">
                        <span>Slot</span>
                        <span>Slot</span>
                    </ng-container>

                    <button *dsAccordionTrigger="let isOpen">
                        {{ isOpen ? 'c-close' : 'c-open' }}
                    </button>
                </ds-accordion-header>

                <ds-accordion-content>content</ds-accordion-content>
            </ds-accordion>
        }
        @if (!showWithCustom) {
            <ds-accordion [inverse]="inverse" [size]="size" [variant]="variant" [open]="open">
                <ds-accordion-header>
                    <ng-container slot="start">
                        <span>Logo</span>
                        <div class="ds-accordion-text">
                            <div slot="title">Accordion</div>
                            <div slot="subtitle">Optional Subtext</div>
                        </div>
                    </ng-container>

                    <ng-container slot="end">
                        <span>Slot</span>
                        <span>Slot</span>
                    </ng-container>
                </ds-accordion-header>

                <ds-accordion-content>content</ds-accordion-content>
            </ds-accordion>
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
class AccordionTestContainer {
    @Input() size = 'large';
    @Input() variant = 'transparent';
    @Input() inverse = false;
    @Input() open = false;
    @Input() showWithCustom = false;
}
