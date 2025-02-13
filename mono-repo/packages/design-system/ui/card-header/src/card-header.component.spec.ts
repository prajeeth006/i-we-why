import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DsCardHeaderHarness } from '@frontend/ui/card-header/testing';
import { virtual } from '@guidepup/virtual-screen-reader';

import { DsCardHeader } from './card-header.component';

describe('DsCardHeaderHarness', () => {
    let fixture: ComponentFixture<DsCardHeaderTestContainer>;
    let loader: HarnessLoader;

    beforeEach(() => {
        TestBed.configureTestingModule({ imports: [DsCardHeaderTestContainer] });

        fixture = TestBed.createComponent(DsCardHeaderTestContainer);
        fixture.detectChanges();
        loader = TestbedHarnessEnvironment.loader(fixture);
    });

    it('should render card header', async () => {
        const card = await loader.getAllHarnesses(DsCardHeaderHarness);
        expect(card.length).toBe(1);
    });

    it('should retrieve card header title text', async () => {
        const harness = await loader.getHarness(DsCardHeaderHarness);
        expect(await harness.getTitle()).toBe('Card Title');
        expect(await harness.getSubText()).toBe('Card Subtitle');
    });

    it('should not display subtitle when empty string and expand title area', async () => {
        fixture.componentRef.setInput('subtitle', '');
        const card = await loader.getHarness(DsCardHeaderHarness);
        const subTextEl = await card.getSubText();
        expect(subTextEl).toBeFalsy();
        expect(await card.getTitleClass()).toContain('ds-card-header-title-expand');
    });

    it('should not display subtitle when undefined and expand title area', async () => {
        const card = await loader.getHarness(DsCardHeaderHarness);
        fixture.componentInstance.subtitle = undefined;
        fixture.componentRef.injector.get(ChangeDetectorRef).detectChanges();
        expect(await card.getSubText()).toBe(null);
        expect(await card.getTitleClass()).toContain('ds-card-header-title-expand');
    });

    it('should handle content in all the slots except last chevron icon slot', async () => {
        const card = await loader.getHarness(DsCardHeaderHarness);

        expect(await card.getStartSlotElement()).toBeTruthy();
        expect(await (await card.getStartSlotElement())?.text()).toBe('Logo');

        expect(await card.getTitleSlotElement()).toBeTruthy();
        expect(await (await card.getTitleSlotElement())?.text()).toBe('Badge');

        expect(await card.getEndSlotElement()).toBeTruthy();
        expect(await (await card.getEndSlotElement())?.text()).toBe('Button');
    });

    it('should render toggle icon if expandable state of the header is set to true', async () => {
        const card = await loader.getHarness(DsCardHeaderHarness);
        expect(await card.isExpandable()).toBe(false);

        fixture.componentRef.setInput('isExpandable', true);
        expect(await card.isExpandable()).toBe(true);

        fixture.componentRef.setInput('isExpandable', false);
        expect(await card.isExpandable()).toBe(false);
    });

    it('should be able to toggle expansion state of card', async () => {
        const card = await loader.getHarness(DsCardHeaderHarness);
        fixture.componentRef.setInput('isExpandable', true);
        expect(await card.isExpanded()).toBe(false);
        await card.toggleExpand();
        expect(await card.isExpanded()).toBe(true);
    });

    it('should be able to expand a card', async () => {
        const card = await loader.getHarness(DsCardHeaderHarness);
        fixture.componentRef.setInput('isExpandable', true);
        expect(await card.isExpanded()).toBe(false);
        await card.expand();
        expect(await card.isExpanded()).toBe(true);
        await card.expand();
        expect(await card.isExpanded()).toBe(true);
    });

    it('should be able to collapse a card', async () => {
        const card = await loader.getHarness(DsCardHeaderHarness);
        fixture.componentRef.setInput('isExpandable', true);
        expect(await card.isExpanded()).toBe(false);
        await card.expand();
        expect(await card.isExpanded()).toBe(true);
        await card.collapse();
        expect(await card.isExpanded()).toBe(false);
        await card.collapse();
        expect(await card.isExpanded()).toBe(false);
    });

    it('should find card header specific variant', async () => {
        fixture.componentRef.setInput('variant', 'surface-low');

        const card = await loader.getHarness(DsCardHeaderHarness.with({ variant: 'surface-low' }));
        expect(await card.hasVariant('surface-low')).toBe(true);
    });

    it('should read card header correctly with screen reader', async () => {
        fixture.detectChanges();
        await fixture.whenStable();

        await virtual.start({ container: fixture.nativeElement });

        expect(await virtual.lastSpokenPhrase()).toBe('Logo');
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toBe('Card Title');
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toBe('Badge');
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toBe('Card Subtitle');
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toBe('Button');
    }, 30000);
});

@Component({
    standalone: true,
    imports: [DsCardHeader],
    template: `
        <ds-card-header [title]="title" [subtitle]="subtitle" [expandable]="isExpandable" [variant]="variant">
            <span slot="start">Logo</span>
            <span slot="title">Badge</span>
            <span slot="end">Button</span>
        </ds-card-header>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
class DsCardHeaderTestContainer {
    @Input() title = 'Card Title';
    @Input() subtitle? = 'Card Subtitle';
    @Input() isExpandable = false;
    @Input() variant = 'surface-highest';
}
