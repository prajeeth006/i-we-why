import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DsCardExpandableHarness } from '@frontend/ui/card-expandable/testing';
import { virtual } from '@guidepup/virtual-screen-reader';

import { DsCardExpandable } from './card-expandable.component';

describe('DsCardExpandableHarness', () => {
    let fixture: ComponentFixture<DsCardExpandableTestContainer>;
    let loader: HarnessLoader;

    beforeEach(async () => {
        await TestBed.configureTestingModule({ imports: [DsCardExpandableTestContainer] }).compileComponents();

        fixture = TestBed.createComponent(DsCardExpandableTestContainer);
        fixture.detectChanges();
        loader = TestbedHarnessEnvironment.loader(fixture);
    });

    it('should render expandable card', async () => {
        const card = await loader.getAllHarnesses(DsCardExpandableHarness);
        expect(card.length).toBe(1);
    });

    it('should render card header', async () => {
        const card = await loader.getHarness(DsCardExpandableHarness);
        const cardHeaderElement = await card.getCardHeader();
        expect(cardHeaderElement).toBeTruthy();
    });

    it('should retrieve card header title and subtitle text', async () => {
        const harness = await loader.getHarness(DsCardExpandableHarness);
        expect(await harness.getTitle()).toBe('Card Title');
        expect(await harness.getSubText()).toBe('Card Subtitle');
    });

    it('should handle content in all the slots', async () => {
        const card = await loader.getHarness(DsCardExpandableHarness);

        expect(await card.getStartSlotElement()).toBeTruthy();
        expect(await (await card.getStartSlotElement())?.text()).toBe('Logo');

        expect(await card.getTitleSlotElement()).toBeTruthy();
        expect(await (await card.getTitleSlotElement())?.text()).toBe('Badge');

        expect(await card.getEndSlotElement()).toBeTruthy();
        expect(await (await card.getEndSlotElement())?.text()).toBe('Button');
    });

    it('should update class based on cards elevation', async () => {
        const card = await loader.getHarness(DsCardExpandableHarness);
        expect(await card.isElevated()).toBe(true);

        fixture.componentRef.setInput('isElevated', false);
        expect(await card.isElevated()).toBe(false);

        fixture.componentRef.setInput('isElevated', true);
        expect(await card.isElevated()).toBe(true);
    });

    it('should be able to toggle expansion state of the card', async () => {
        const card = await loader.getHarness(DsCardExpandableHarness);
        expect(await card.isExpanded()).toBe(false);
        await card.toggleExpand();
        expect(await card.isExpanded()).toBe(true);
        const getCardBodyElement = await card.getCardBodyElement();
        expect(getCardBodyElement).toBeTruthy();
    });

    it('should be able to expand a card', async () => {
        const card = await loader.getHarness(DsCardExpandableHarness);
        expect(await card.isExpanded()).toBe(false);
        await card.expand();
        expect(await card.isExpanded()).toBe(true);
        await card.expand();
        expect(await card.isExpanded()).toBe(true);
    });

    it('should be able to collapse a card', async () => {
        const card = await loader.getHarness(DsCardExpandableHarness);
        expect(await card.isExpanded()).toBe(false);
        await card.expand();
        expect(await card.isExpanded()).toBe(true);
        await card.collapse();
        expect(await card.isExpanded()).toBe(false);
        await card.collapse();
        expect(await card.isExpanded()).toBe(false);
    });

    it('should retrieve cards body content', async () => {
        const card = await loader.getHarness(DsCardExpandableHarness);

        await card.toggleExpand();
        expect(await card.isExpanded()).toBe(true);

        const bodyContentText = await (await card.getCardBodyElement())?.text();
        expect(bodyContentText).toBe('Body Content');
    });

    it('should find card with specific variant', async () => {
        fixture.componentRef.setInput('variant', 'surface-low');

        const card = await loader.getHarness(DsCardExpandableHarness.with({ variant: 'surface-low' }));
        expect(await card.hasVariant('surface-low')).toBe(true);
    });

    it('should find card header with specific variant', async () => {
        fixture.componentRef.setInput('variant', 'surface-high');

        const cardHeader = await loader.getHarness(DsCardExpandableHarness.with({ headerVariant: 'surface-high' }));
        expect(await cardHeader.hasHeaderVariant('surface-high')).toBe(true);
    });

    it('should navigate through expandable card correctly with screen reader', async () => {
        await virtual.start({ container: fixture.nativeElement });
        expect(await virtual.lastSpokenPhrase()).toEqual('Logo');
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toEqual('Card Title');
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toEqual('Badge');
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toEqual('Card Subtitle');
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toEqual('Button');
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toEqual('button, Icon button');
        const card = await loader.getHarness(DsCardExpandableHarness);
        await card.toggleExpand();
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toEqual('Body Content');
    });
});

@Component({
    standalone: true,
    imports: [DsCardExpandable],
    template: `
        <ds-card-expandable [title]="title" [subtitle]="subtitle" [elevated]="isElevated" [headerVariant]="headerVariant" [variant]="variant">
            <span slot="start">Logo</span>
            <span slot="title">Badge</span>
            <span slot="end">Button</span>
            Body Content
        </ds-card-expandable>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
class DsCardExpandableTestContainer {
    @Input() title = 'Card Title';
    @Input() subtitle? = 'Card Subtitle';
    @Input() isExpandable = true;
    @Input() isElevated = true;
    @Input() variant = 'surface-high';
    @Input() headerVariant = 'surface-high';
}
