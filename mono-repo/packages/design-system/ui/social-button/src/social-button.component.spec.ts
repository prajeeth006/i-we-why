import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DsSocialButtonHarness } from '@frontend/ui/social-button/testing';
import { virtual } from '@guidepup/virtual-screen-reader';

import { DsSocialButton } from './social-button.component';

describe('DsSocialButtonHarness', () => {
    let fixture: ComponentFixture<ButtonTestContainer>;
    let loader: HarnessLoader;

    beforeEach(() => {
        TestBed.configureTestingModule({ imports: [ButtonTestContainer] });

        fixture = TestBed.createComponent(ButtonTestContainer);
        fixture.detectChanges();
        loader = TestbedHarnessEnvironment.loader(fixture);
    });

    it('should load all button harnesses', async () => {
        const buttons = await loader.getAllHarnesses(DsSocialButtonHarness);
        expect(buttons.length).toBe(4);
    });

    it('should load button with exact text', async () => {
        const buttons = await loader.getAllHarnesses(DsSocialButtonHarness.with({ text: 'Submit button' }));
        expect(buttons.length).toBe(1);
        expect(await buttons[0].getText()).toBe('Submit button');
    });

    it('should load button with regex label match', async () => {
        const buttons = await loader.getAllHarnesses(DsSocialButtonHarness.with({ text: /button/i }));
        expect(buttons.length).toBe(3);
        expect(await buttons[0].getText()).toBe('Text button');
        expect(await buttons[1].getText()).toBe('Submit button');
        expect(await buttons[2].getText()).toBe('Disabled button');
    });

    it('should load disabled button', async () => {
        const buttons = await loader.getAllHarnesses(DsSocialButtonHarness.with({ disabled: true }));
        expect(buttons.length).toBe(1);
        expect(await buttons[0].getText()).toBe('Disabled button');
    });

    it('should get button text', async () => {
        const [firstButton, secondButton] = await loader.getAllHarnesses(DsSocialButtonHarness);
        expect(await firstButton.getText()).toBe('Text button');
        expect(await secondButton.getText()).toBe('Submit button');
    });

    it('should disable and enable a button', async () => {
        const button = await loader.getHarness(DsSocialButtonHarness);
        expect(await button.isDisabled()).toBe(false);
        fixture.componentRef.setInput('isDisabled', true);
        expect(await button.isDisabled()).toBe(true);
        fixture.componentRef.setInput('isDisabled', false);
        expect(await button.isDisabled()).toBe(false);
    });

    it('should focus and blur a button', async () => {
        const button = await loader.getHarness(DsSocialButtonHarness);
        expect(await button.isFocused()).toBe(false);
        await button.focus();
        expect(await button.isFocused()).toBe(true);
        await button.blur();
        expect(await button.isFocused()).toBe(false);
    });

    it('should be able to filter buttons based on their type', async () => {
        const button = await loader.getHarness(DsSocialButtonHarness.with({ type: 'submit' }));
        expect(await button.getText()).toBe('Submit button');
    });

    it('should be able to filter buttons by there size', async () => {
        const button = await loader.getHarness(DsSocialButtonHarness.with({ size: 'medium' }));
        expect(await button.getText()).toBe('Submit button');
        expect(await button.hasSize('medium')).toBeTruthy();
        expect(await button.hasSize('large')).toBeFalsy();
    });

    it('should be able to filter buttons by there variant', async () => {
        const button = await loader.getAllHarnesses(DsSocialButtonHarness.with({ socialApp: 'facebook' }));
        expect(button.length).toBe(3);
        expect(await button[0].hasSocialApp('facebook')).toBeTruthy();
        expect(await button[0].hasSocialApp('entain')).toBeFalsy();
    });

    it('should be able to click a button', async () => {
        const button = await loader.getHarness(DsSocialButtonHarness.with({ type: 'button' }));
        expect(fixture.componentInstance.isClicked).toBeFalsy();
        await button.click();
        expect(fixture.componentInstance.isClicked).toBeTruthy();
    });

    it('should be able to inject content', async () => {
        const button = await loader.getHarness(DsSocialButtonHarness.with({ type: 'submit' }));
        expect(await (await button.getStartSlotElement())?.text()).toBe('Some Start Text');
    });

    it('should navigate through social buttons correctly with screen reader', async () => {
        await virtual.start({ container: fixture.nativeElement });
        expect(await virtual.lastSpokenPhrase()).toEqual('button, Text button');
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toEqual('button, Some Start Text Submit button');
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toEqual('button, Disabled button, disabled');
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toEqual('Text anchor');
    });
});

@Component({
    template: `
        <button (click)="isClicked = true" [disabled]="isDisabled" type="button" ds-social-button size="small" socialApp="google">Text button</button>
        <button type="submit" ds-social-button size="medium" variant="filled" socialApp="facebook">
            Submit button
            <span slot="start">Some Start Text</span>
        </button>
        <button type="button" disabled ds-social-button size="large" variant="filled" socialApp="facebook">Disabled button</button>
        <a ds-social-button size="small" socialApp="facebook">Text anchor</a>
    `,
    standalone: true,
    imports: [DsSocialButton],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
class ButtonTestContainer {
    isClicked = false;
    @Input()
    isDisabled = false;
}
