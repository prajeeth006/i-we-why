import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ChangeDetectionStrategy, Component, booleanAttribute, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { virtual } from '@guidepup/virtual-screen-reader';

import { DsHelpGroup } from './help-group.component';
import { DsHelpItem } from './help-item.component';
import { DsHelpGroupHarness } from './testing/src/help-group.harness';
import { DsHelpItemHarness } from './testing/src/help-item.harness';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [DsHelpGroup, DsHelpItem],
    template: `
        <ds-help-group [inverse]="isInverse()">
            <div slot="header">My Header</div>
            <ds-help-item slot="item" type="success" [inverse]="isInverse()">
                <div slot="text">Supporting text 1</div>
            </ds-help-item>
            <ds-help-item slot="item" type="info" isRightAligned="true" [inverse]="isInverse()">
                <div slot="text">Supporting text 2</div>
            </ds-help-item>
            <ds-help-item slot="item" type="caution" inverse="true">
                <div slot="text">Supporting text 3</div>
            </ds-help-item>
        </ds-help-group>
    `,
})
class HelpGroupTestContainer {
    isInverse = input(false, { transform: booleanAttribute });
}

describe('HelpGroupComponent', () => {
    let loader: HarnessLoader;
    let fixture: ComponentFixture<HelpGroupTestContainer>;

    beforeEach(async () => {
        globalThis.fetch = jest.fn().mockResolvedValue({
            ok: true,
            text: () => Promise.resolve('<svg>Mocked SVG Content</svg>'),
        });

        await TestBed.configureTestingModule({
            imports: [HelpGroupTestContainer],
        }).compileComponents();

        fixture = TestBed.createComponent(HelpGroupTestContainer);
        fixture.detectChanges();
        loader = TestbedHarnessEnvironment.loader(fixture);
    });

    it('should be able to create component instance', () => {
        const hostComponent = fixture.componentInstance;
        expect(hostComponent).toBeTruthy();
    });

    it('should render the header with correct text', async () => {
        const help = await loader.getHarness(DsHelpGroupHarness);
        const descriptionText = await help.getHeaderText();
        expect(descriptionText).toBe('My Header');
    });

    it('should render the paragraph', async () => {
        const help = await loader.getHarness(DsHelpGroupHarness);
        const content = await help.getContent();
        expect(content).toContain('Supporting text');
    });

    it('should render the correct text for each help item', async () => {
        const help = await loader.getHarness(DsHelpGroupHarness);
        const items = await help.getHelpItems();
        const result: Record<string, string> = {
            success: 'Supporting text 1',
            info: 'Supporting text 2',
            caution: 'Supporting text 3',
        };

        for (const item of items) {
            const itemType = await item.getType();
            expect(await item.getTextContent()).toBe(result[itemType]);
        }
    });

    it('should check the presence of icons in help items', async () => {
        const helpItems = await loader.getAllHarnesses(DsHelpItemHarness);

        for (const item of helpItems) {
            const hasIcon = await item.hasIcon();
            expect(hasIcon).toBeTruthy();
        }
    });

    it('should find by inverse flag', async () => {
        const helpItem = await loader.getHarness(DsHelpItemHarness.with({ inverse: true }));
        expect(await helpItem.getType()).toBe('caution');
    });

    it('should find by input type', async () => {
        const helpItem = await loader.getHarness(DsHelpItemHarness.with({ isRightAligned: true }));
        expect(await helpItem.getType()).toBe('info');
    });

    it('should find by type', async () => {
        const helpItem = await loader.getHarness(DsHelpItemHarness.with({ type: 'success' }));
        expect(await helpItem.getTextContent()).toBe('Supporting text 1');
    });

    it('should find by text', async () => {
        const helpItem = await loader.getHarness(DsHelpItemHarness.with({ text: 'Supporting text 2' }));
        expect(await helpItem.getType()).toBe('info');
    });

    it('should find group by inverse', async () => {
        const helpItems = await loader.getAllHarnesses(DsHelpGroupHarness.with({ inverse: true }));
        expect(helpItems.length).toBe(0);
        fixture.componentRef.setInput('isInverse', true);
        const helpItems2 = await loader.getAllHarnesses(DsHelpGroupHarness.with({ inverse: true }));
        expect(helpItems2.length).toBe(1);
    });

    it('should find group by header text', async () => {
        const helpItems = await loader.getAllHarnesses(DsHelpGroupHarness.with({ headerText: 'My Header' }));
        expect(helpItems.length).toBe(1);
    });

    it('should have inverse class when help group inverse is true', async () => {
        const helpGroup = await loader.getHarness(DsHelpGroupHarness.with({ inverse: false }));
        expect(await helpGroup.isInverse()).toBe(false);
        fixture.componentRef.setInput('isInverse', true);
        expect(await helpGroup.isInverse()).toBe(true);
        fixture.componentRef.setInput('isInverse', false);
        expect(await helpGroup.isInverse()).toBe(false);
    });

    it('should have inverse class when help item inverse is true', async () => {
        const helpItem = await loader.getHarness(DsHelpItemHarness.with({ inverse: false }));
        expect(await helpItem.isInverse()).toBe(false);
        fixture.componentRef.setInput('isInverse', true);
        expect(await helpItem.isInverse()).toBe(true);
        fixture.componentRef.setInput('isInverse', false);
        expect(await helpItem.isInverse()).toBe(false);
    });

    it('should read help group states correctly with screen reader', async () => {
        fixture.detectChanges();
        await fixture.whenStable();

        await virtual.start({ container: fixture.nativeElement });

        expect(await virtual.lastSpokenPhrase()).toBe('My Header');
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toBe('Supporting text 1');
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toBe('Supporting text 2');
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toBe('Supporting text 3');
    }, 30000);

    afterEach(() => {
        delete (globalThis as any).fetch;
    });
});
