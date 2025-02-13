import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DsButtonHarness } from '@frontend/ui/button/testing';
import { virtual } from '@guidepup/virtual-screen-reader';

import { DsButton } from './button.component';

describe('DsButtonHarness', () => {
    let fixture: ComponentFixture<ButtonTestContainer>;
    let loader: HarnessLoader;

    beforeEach(() => {
        TestBed.configureTestingModule({ imports: [ButtonTestContainer] });

        fixture = TestBed.createComponent(ButtonTestContainer);
        fixture.detectChanges();
        loader = TestbedHarnessEnvironment.loader(fixture);
    });

    it('should load all button harnesses', async () => {
        const buttons = await loader.getAllHarnesses(DsButtonHarness);
        expect(buttons.length).toBe(4);
    });

    it('should load large button with exact text', async () => {
        const buttons = await loader.getAllHarnesses(DsButtonHarness.with({ text: 'Submit button' }));
        expect(buttons.length).toBe(1);
        expect(await buttons[0].getText()).toBe('Submit button');
        expect(await buttons[0].getSubText()).toBe('Additional Text');
    });

    it('should hide subtext if the button is not large', async () => {
        fixture.componentRef.setInput('size', 'small');
        fixture.detectChanges();
        const buttons = await loader.getAllHarnesses(DsButtonHarness.with({ text: 'Submit button' }));
        expect(buttons.length).toBe(1);
        expect(await buttons[0].getText()).toBe('Submit button');
        expect(await buttons[0].getSubText()).toBeFalsy();
    });

    it('should load button with exact sub text', async () => {
        const buttons = await loader.getAllHarnesses(DsButtonHarness.with({ subText: 'Additional Text' }));
        expect(buttons.length).toBe(1);
        expect(await buttons[0].getText()).toBe('Submit button');
    });

    it('should load button with regex label match', async () => {
        const buttons = await loader.getAllHarnesses(DsButtonHarness.with({ text: /button/i }));
        expect(buttons.length).toBe(3);
        expect(await buttons[0].getText()).toBe('Text button');
        expect(await buttons[1].getText()).toBe('Submit button');
        expect(await buttons[2].getText()).toBe('Disabled button');
    });

    it('should be able to click a button', async () => {
        const button = await loader.getHarness(DsButtonHarness.with({ text: 'Text button' }));
        expect(await button.getText()).toBe('Text button');
        expect(fixture.componentInstance.isClicked).toBe(false);
        fixture.detectChanges();
        await button.click();
        expect(fixture.componentInstance.isClicked).toBe(true);
    });

    it('should load disabled button', async () => {
        const disabledButtons = await loader.getAllHarnesses(DsButtonHarness.with({ disabled: true }));
        const notDisabledButtons = await loader.getAllHarnesses(DsButtonHarness.with({ disabled: false }));
        expect(disabledButtons.length).toBe(1);
        expect(notDisabledButtons.length).toBe(3);
        expect(await disabledButtons[0].getText()).toBe('Disabled button');
    });

    it('should get button text', async () => {
        const [firstButton, secondButton] = await loader.getAllHarnesses(DsButtonHarness);
        expect(await firstButton.getText()).toBe('Text button');
        expect(await secondButton.getText()).toBe('Submit button');
    });

    it('should disable and enable a button', async () => {
        const spyOnClickEventHandler = jest.spyOn(fixture.componentInstance, 'clickEventHandler');
        const button = await loader.getHarness(DsButtonHarness);
        expect(await button.isDisabled()).toBe(false);
        fixture.componentRef.setInput('isDisabled', true);
        expect(await button.isDisabled()).toBe(true);
        await button.click();
        expect(spyOnClickEventHandler).not.toHaveBeenCalled();
        fixture.componentRef.setInput('isDisabled', false);
        expect(await button.isDisabled()).toBe(false);
        await button.click();
        setTimeout(() => {
            expect(spyOnClickEventHandler).toHaveBeenCalled();
        });
    });

    it('should focus and blur a button', async () => {
        const button = await loader.getHarness(DsButtonHarness.with({ variant: 'filled' }));
        expect(await button.isFocused()).toBe(false);
        await button.focus();
        expect(await button.isFocused()).toBe(true);
        await button.blur();
        expect(await button.isFocused()).toBe(false);
    });

    it('should be able to filter buttons based on their type', async () => {
        const button = await loader.getHarness(DsButtonHarness.with({ type: 'submit' }));
        expect(await button.getText()).toBe('Submit button');
    });

    it('should be able to filter buttons by there size', async () => {
        const button = await loader.getHarness(DsButtonHarness.with({ size: 'small' }));
        expect(await button.getText()).toBe('Text button');
        expect(await button.hasSize('small')).toBeTruthy();
        expect(await button.hasSize('large')).toBeFalsy();
    });

    it('should be able to filter buttons by there variant', async () => {
        const button = await loader.getAllHarnesses(DsButtonHarness.with({ variant: 'filled' }));
        expect(button.length).toBe(4);
        expect(await button[0].hasVariant('filled')).toBeTruthy();
        expect(await button[0].hasVariant('flat')).toBeFalsy();
    });

    it('should be able to inject start and end text', async () => {
        const button = await loader.getHarness(DsButtonHarness.with({ type: 'submit' }));
        expect(await (await button.getStartSlotElement())?.text()).toBe('Some Start Text');
        expect(await (await button.getEndSlotElement())?.text()).toBe('Some End Text');
    });

    it('should have ds-button-loader class when loading is true', async () => {
        const button = await loader.getHarness(DsButtonHarness);
        expect(await button.isLoading()).toBe(false);
        fixture.componentRef.setInput('loading', true);
        expect(await button.isLoading()).toBe(true);
        fixture.componentRef.setInput('loading', false);
        expect(await button.isLoading()).toBe(false);
    });

    it('should navigate through buttons correctly with screen reader', async () => {
        await virtual.start({ container: fixture.nativeElement });
        expect(await virtual.lastSpokenPhrase()).toEqual('button, Text button');
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toEqual('button, Some Start Text Submit button Some End Text Additional Text');
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toEqual('Some Start Text');
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toEqual('Submit button');
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toEqual('Some End Text');
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toEqual('Additional Text');
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toEqual('end of button, Some Start Text Submit button Some End Text Additional Text');
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toEqual('button, Disabled button, disabled');
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toEqual('Text anchor');
    }, 10_000);

    it('should have inverse class when inverse is true', async () => {
        const button = await loader.getHarness(DsButtonHarness);
        expect(await button.getInverse()).toBe(false);
        fixture.componentInstance.isInverse = true;
        fixture.componentRef.injector.get(ChangeDetectorRef).detectChanges();
        expect(await button.getInverse()).toBe(true);
        fixture.componentInstance.isInverse = false;
        fixture.componentRef.injector.get(ChangeDetectorRef).detectChanges();
        expect(await button.getInverse()).toBe(false);
    });
});

@Component({
    template: `
        <button
            (click)="clickEventHandler()"
            [disabled]="isDisabled"
            type="button"
            [loading]="loading"
            [inverse]="isInverse"
            ds-button
            size="small"
            kind="tertiary">
            Text button
        </button>
        <button ds-button type="submit" [size]="size" variant="filled" [loading]="loading" [inverse]="isInverse">
            Submit button
            <span slot="start">Some Start Text</span>
            <span slot="end">Some End Text</span>
            <span slot="subtext">Additional Text</span>
        </button>
        <button type="button" [disabled]="true" ds-button size="large" kind="secondary" [loading]="loading" [inverse]="isInverse">
            Disabled button
        </button>
        <a ds-button size="small" kind="primary" [inverse]="isInverse">Text anchor</a>
    `,
    standalone: true,
    imports: [DsButton],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
class ButtonTestContainer {
    isClicked = false;
    isInverse = false;

    @Input()
    isDisabled = false;

    @Input() loading = false;
    @Input() size = 'large';

    clickEventHandler() {
        this.isClicked = true;
    }
}
