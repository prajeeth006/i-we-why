import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DsCardFooter } from '@frontend/ui/card-footer';
import { DsCardFooterHarness } from '@frontend/ui/card-footer/testing';
import { DsCardHeader } from '@frontend/ui/card-header';
import { DsCardHeaderHarness } from '@frontend/ui/card-header/testing';
import { DsCardContentHarness, DsCardHarness } from '@frontend/ui/card/testing';
import { DsDivider } from '@frontend/ui/divider';

import { DsCardContent } from './card-content.component';
import { DsCard } from './card.component';

describe('DsCardHarness', () => {
    let fixture: ComponentFixture<DsCardTestContainer>;
    let loader: HarnessLoader;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DsCardTestContainer],
        }).compileComponents();

        fixture = TestBed.createComponent(DsCardTestContainer);
        fixture.detectChanges();
        loader = TestbedHarnessEnvironment.loader(fixture);
    });

    it('should retrieve card', async () => {
        const cards = await loader.getAllHarnesses(DsCardHarness);
        expect(cards.length).toBe(1);
    });

    it('should update class based on cards elevation', async () => {
        const card = await loader.getHarness(DsCardHarness);
        expect(await card.isElevated()).toBe(true);

        fixture.componentRef.setInput('isElevated', false);
        expect(await card.isElevated()).toBe(false);

        fixture.componentRef.setInput('isElevated', true);
        expect(await card.isElevated()).toBe(true);
    });

    it('should find card with specific variant', async () => {
        fixture.componentRef.setInput('variant', 'surface-low');

        const card = await loader.getHarness(DsCardHarness.with({ variant: 'surface-low' }));
        expect(await card.hasVariant('surface-low')).toBe(true);
    });

    it('should load card header title', async () => {
        const header = await loader.getHarness(DsCardHeaderHarness);
        expect(await header.getTitle()).toBe('Card header title');
    });

    it('should load card footer', async () => {
        const footer = await loader.getHarness(DsCardFooterHarness);
        expect(await footer.getDividerSlotElement()).toBeTruthy();
        expect(await footer.getText()).toBe('Card footer');
    });

    it('should load card content', async () => {
        const content = await loader.getHarness(DsCardContentHarness);
        expect(await content.getText()).toBe('Card content');
    });
});

@Component({
    standalone: true,
    template: `
        <ds-card [elevated]="isElevated" [variant]="variant">
            <ds-card-header [title]="'Card header title'" />
            <ds-card-content>Card content</ds-card-content>
            <ds-card-footer>
                <ds-divider slot="divider" />
                Card footer
            </ds-card-footer>
        </ds-card>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [DsCard, DsCardHeader, DsCardFooter, DsCardContent, DsDivider],
})
class DsCardTestContainer {
    @Input() title = 'Card Title';
    @Input() subtitle? = 'Card Subtitle';
    @Input() isElevated = true;
    @Input() variant = 'surface-highest';
}
