import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DsNotificationBubble } from '@frontend/ui/notification-bubble';
import { DsPillHarness } from '@frontend/ui/pill/testing';
import { virtual } from '@guidepup/virtual-screen-reader';

import { DsPill } from './pill.component';

describe('DsPillHarness', () => {
    let fixture: ComponentFixture<PillTestContainer>;
    let loader: HarnessLoader;

    beforeEach(() => {
        TestBed.configureTestingModule({ imports: [PillTestContainer] });

        fixture = TestBed.createComponent(PillTestContainer);
        fixture.detectChanges();
        loader = TestbedHarnessEnvironment.loader(fixture);
    });

    it('should load all pill harnesses', async () => {
        const pills = await loader.getAllHarnesses(DsPillHarness);
        expect(pills.length).toBe(5);
    });

    it('should load pill with exact text', async () => {
        const pills = await loader.getAllHarnesses(DsPillHarness.with({ text: 'Pill2' }));
        expect(pills.length).toBe(1);
        expect(await pills[0].getText()).toBe('Pill2');
    });

    it('should load pill with regex label match', async () => {
        const pills = await loader.getAllHarnesses(DsPillHarness.with({ text: /pill/i }));
        expect(pills.length).toBe(4);
        expect(await pills[0].getText()).toBe('Text pill');
        expect(await pills[1].getText()).toBe('Pill2');
        expect(await pills[2].getText()).toBe('Disabled pill');
        expect(await pills[3].getText()).toBe('Pill4');
    });

    it('should load disabled pill', async () => {
        const pills = await loader.getAllHarnesses(DsPillHarness.with({ disabled: true }));
        expect(pills.length).toBe(1);
        expect(await pills[0].getText()).toBe('Disabled pill');
    });

    it('should load selected pill', async () => {
        const pills = await loader.getAllHarnesses(DsPillHarness.with({ selected: true }));
        expect(pills.length).toBe(1);
        expect(await pills[0].getText()).toBe('Pill2');
    });

    it('should get pill text', async () => {
        const [firstPill, secondPill] = await loader.getAllHarnesses(DsPillHarness);
        expect(await firstPill.getText()).toBe('Text pill');
        expect(await secondPill.getText()).toBe('Pill2');
    });

    it('should disable and enable a pill', async () => {
        const pill = await loader.getHarness(DsPillHarness.with({ text: 'Text pill' }));
        expect(await pill.isDisabled()).toBe(false);
        fixture.componentRef.setInput('isDisabled', true);
        expect(await pill.isDisabled()).toBe(true);
        fixture.componentRef.setInput('isDisabled', false);
        expect(await pill.isDisabled()).toBe(false);
    });

    it('should select and unselect a pill', async () => {
        const pill = await loader.getHarness(DsPillHarness.with({ text: 'Text pill' }));
        expect(await pill.isSelected()).toBe(false);
        fixture.componentRef.setInput('isSelected', true);
        expect(await pill.isSelected()).toBe(true);
        fixture.componentRef.setInput('isSelected', false);
        expect(await pill.isSelected()).toBe(false);
    });

    it('should focus and blur a pill', async () => {
        const pill = await loader.getHarness(DsPillHarness);
        expect(await pill.isFocused()).toBe(false);
        await pill.focus();
        expect(await pill.isFocused()).toBe(true);
        await pill.blur();
        expect(await pill.isFocused()).toBe(false);
    });

    it('should be able to filter pills by there size', async () => {
        const pill = await loader.getHarness(DsPillHarness.with({ size: 'medium' }));
        expect(await pill.getText()).toBe('Pill2');
        expect(await pill.hasSize('medium')).toBeTruthy();
        expect(await pill.hasSize('small')).toBeFalsy();
    });

    it('should load pill with specific variant', async () => {
        const pill = await loader.getHarness(DsPillHarness.with({ variant: 'current' }));
        expect(await pill.hasVariant('current')).toBeTruthy();

        const subtlePill = await loader.getHarness(DsPillHarness.with({ variant: 'subtle' }));
        expect(await subtlePill.hasVariant('subtle')).toBeTruthy();

        const strongPill = await loader.getHarness(DsPillHarness.with({ variant: 'strong' }));
        expect(await strongPill.hasVariant('strong')).toBeTruthy();
    });

    it('should be able to click a pill', async () => {
        const pill = await loader.getHarness(DsPillHarness.with({ text: 'Text pill' }));
        expect(fixture.componentInstance.isClicked).toBeFalsy();
        await pill.click();
        expect(fixture.componentInstance.isClicked).toBeTruthy();
    });

    it('should be able to inject start, end and chevron', async () => {
        const pill = await loader.getHarness(DsPillHarness.with({ text: 'Pill2' }));
        expect(await (await pill.getStartSlotElement())?.text()).toBe('Some Start Text');
        expect(await (await pill.getEndSlotElement())?.text()).toBe('Some End Text');
    });

    it('should have rounded padding when large content is projected', async () => {
        fixture.componentRef.setInput('injectContent', true);
        fixture.detectChanges();
        const pill = await loader.getHarness(DsPillHarness.with({ text: 'Pill4' }));
        expect(await (await pill.getEndSlotElement())?.text()).toBe('60');
        expect(await pill.isRoundedPadding()).toBe(true);
    });

    it('should have inverse class when inverse is true', async () => {
        const harness = await loader.getHarness(DsPillHarness);
        expect(await harness.isInverse()).toBeFalsy();
        fixture.componentRef.setInput('inverse', true);
        expect(await harness.isInverse()).toBeTruthy();
        fixture.componentRef.setInput('inverse', false);
        expect(await harness.isInverse()).toBeFalsy();
    });

    it('should navigate through pills correctly with screen reader', async () => {
        fixture.componentRef.setInput('injectContent', true);
        fixture.detectChanges();
        await virtual.start({ container: fixture.nativeElement });

        await fixture.whenStable().then(async () => {
            expect(await virtual.lastSpokenPhrase()).toEqual('button, Text pill, not disabled');
            await virtual.next();
            expect(await virtual.lastSpokenPhrase()).toEqual('Some Start Text');
            await virtual.next();
            expect(await virtual.lastSpokenPhrase()).toEqual('Pill2');
            await virtual.next();
            expect(await virtual.lastSpokenPhrase()).toEqual('Some End Text');
            await virtual.next();
            expect(await virtual.lastSpokenPhrase()).toEqual('button, Disabled pill, disabled');
            await virtual.next();
            expect(await virtual.lastSpokenPhrase()).toEqual('Text anchor');
            await virtual.next();
            expect(await virtual.lastSpokenPhrase()).toEqual('button, Pill4 Notification 60, not disabled');
        });
        await virtual.stop();
    }, 10000);
});

@Component({
    template: `
        <button ds-pill (click)="isClicked = true" [disabled]="isDisabled" [inverse]="inverse" [selected]="isSelected" size="small" variant="current">
            Text pill
        </button>
        <div ds-pill size="medium" variant="subtle" selected>
            Pill2
            <span slot="start">Some Start Text</span>
            <span slot="end">Some End Text</span>
        </div>
        <button disabled ds-pill size="medium" variant="strong">Disabled pill</button>
        <a ds-pill size="small" variant="current">Text anchor</a>

        <button ds-pill size="medium" variant="subtle">
            Pill4
            <ds-notification-bubble variant="primary" slot="end" size="large">
                @if (injectContent) {
                    60
                }
            </ds-notification-bubble>
        </button>
    `,
    standalone: true,
    imports: [DsPill, DsNotificationBubble],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
class PillTestContainer {
    isClicked = false;
    @Input()
    isDisabled = false;
    @Input()
    inverse = false;
    @Input()
    isSelected = false;
    @Input()
    injectContent = false; // Controls whether text is shown in the slot
}
