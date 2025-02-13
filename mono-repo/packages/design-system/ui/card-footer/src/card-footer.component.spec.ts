import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DsCardFooterHarness } from '@frontend/ui/card-footer/testing';
import { DsDivider } from '@frontend/ui/divider';
import { virtual } from '@guidepup/virtual-screen-reader';

import { DsBadge } from '../../badge/src';
import { DsButton } from '../../button/src';
import { DsCardFooter } from './card-footer.component';

describe('DsCardFooterHarness', () => {
    let fixture: ComponentFixture<DsCardFooterTestContainer>;
    let loader: HarnessLoader;

    beforeEach(() => {
        TestBed.configureTestingModule({ imports: [DsCardFooterTestContainer] });

        fixture = TestBed.createComponent(DsCardFooterTestContainer);
        fixture.detectChanges();
        loader = TestbedHarnessEnvironment.loader(fixture);
    });

    it('should render card footer', async () => {
        const card = await loader.getAllHarnesses(DsCardFooterHarness);
        expect(card.length).toBe(1);
    });

    it('should have divider in slot', async () => {
        const card = await loader.getHarness(DsCardFooterHarness);
        expect(await card.getDividerSlotElement()).toBeTruthy();
    });

    it('should find card footer specific variant', async () => {
        fixture.componentRef.setInput('variant', 'surface-low');

        const card = await loader.getHarness(DsCardFooterHarness.with({ variant: 'surface-low' }));
        expect(await card.hasVariant('surface-low')).toBe(true);
    });

    it('should read card footer correctly with screen reader', async () => {
        fixture.detectChanges();
        await fixture.whenStable();

        await virtual.start({ container: fixture.nativeElement });

        expect(await virtual.lastSpokenPhrase()).toBe('separator, orientated horizontally, max value 100, min value 0');
        await virtual.next();

        expect(await virtual.lastSpokenPhrase()).toBe('button, Flat Button');
    });
});

@Component({
    standalone: true,
    imports: [DsCardFooter, DsDivider, DsBadge, DsButton],
    template: `
        <ds-card-footer>
            <ds-divider slot="divider" />
            <button slot="end" ds-button variant="flat" kind="tertiary" size="small">Flat Button</button>
        </ds-card-footer>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
class DsCardFooterTestContainer {
    @Input() variant = 'surface-highest';
}
