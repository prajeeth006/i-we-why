import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DsBonusButtonHarness } from '@frontend/ui/bonus-button/testing';
import { virtual } from '@guidepup/virtual-screen-reader';

import { DsBonusButton } from './bonus-button.component';

describe('DsBonusButtonHarness', () => {
    let fixture: ComponentFixture<ButtonTestContainer>;
    let loader: HarnessLoader;

    beforeEach(() => {
        TestBed.configureTestingModule({ imports: [ButtonTestContainer] });

        fixture = TestBed.createComponent(ButtonTestContainer);
        fixture.detectChanges();
        loader = TestbedHarnessEnvironment.loader(fixture);
    });

    it('should load all button harnesses', async () => {
        const buttons = await loader.getAllHarnesses(DsBonusButtonHarness);
        expect(buttons.length).toBe(5);
    });

    it('should load button with exact text', async () => {
        const buttons = await loader.getAllHarnesses(DsBonusButtonHarness.with({ labelText: 'Submit button' }));
        expect(buttons.length).toBe(1);
        expect(await buttons[0].getTextLabel()).toBe('Submit button');
        expect(await buttons[0].getTextValue()).toBe('200');
    });

    it('should load button with exact value', async () => {
        const buttons = await loader.getAllHarnesses(DsBonusButtonHarness.with({ valueText: '200' }));
        expect(buttons.length).toBe(5);
        expect(await buttons[0].getTextLabel()).toBe('Text button');
        expect(await buttons[2].getTextLabel()).toBe('Disabled button');
    });

    it('should load button with regex label match', async () => {
        const buttons = await loader.getAllHarnesses(DsBonusButtonHarness.with({ labelText: /button/i }));
        expect(buttons.length).toBe(4);
        expect(await buttons[0].getTextLabel()).toBe('Text button');
        expect(await buttons[1].getTextLabel()).toBe('Submit button');
        expect(await buttons[2].getTextLabel()).toBe('Disabled button');
    });

    it('should load disabled button', async () => {
        const buttons = await loader.getAllHarnesses(DsBonusButtonHarness.with({ disabled: true }));
        expect(buttons.length).toBe(2);
        expect(await buttons[0].getTextLabel()).toBe('Disabled button');
    });

    it('should get button text', async () => {
        const [firstButton, secondButton] = await loader.getAllHarnesses(DsBonusButtonHarness);
        expect(await firstButton.getTextLabel()).toBe('Text button');
        expect(await secondButton.getTextLabel()).toBe('Submit button');
    });

    it('should disable and enable a button', async () => {
        const spyOnClickEventHandler = jest.spyOn(fixture.componentInstance, 'clickEventHandler');
        const button = await loader.getHarness(DsBonusButtonHarness);
        expect(await button.isDisabled()).toBe(false);
        fixture.componentRef.setInput('isDisabled', true);
        expect(await button.isDisabled()).toBe(true);
        await button.click();
        expect(spyOnClickEventHandler).not.toHaveBeenCalled();
        fixture.componentRef.setInput('isDisabled', false);
        expect(await button.isDisabled()).toBe(false);
        await button.click();
        expect(spyOnClickEventHandler).toHaveBeenCalled();
    });

    it('should focus and blur a button', async () => {
        const button = await loader.getHarness(DsBonusButtonHarness);
        expect(await button.isFocused()).toBe(false);
        await button.focus();
        expect(await button.isFocused()).toBe(true);
        await button.blur();
        expect(await button.isFocused()).toBe(false);
    });

    it('should be able to filter buttons based on their type', async () => {
        const button = await loader.getHarness(DsBonusButtonHarness.with({ type: 'submit' }));
        expect(await button.getTextLabel()).toBe('Submit button');
    });

    it('should be able to click a button', async () => {
        const button = await loader.getHarness(DsBonusButtonHarness.with({ type: 'button' }));
        expect(fixture.componentInstance.isClicked).toBeFalsy();
        await button.click();
        expect(fixture.componentInstance.isClicked).toBeTruthy();
    });

    it('should navigate through bonus buttons correctly with screen reader', async () => {
        await virtual.start({ container: fixture.nativeElement });
        expect(await virtual.lastSpokenPhrase()).toEqual('button, Text button 200');
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toEqual('button, Submit button 200');
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toEqual('button, Disabled button 200, disabled');
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toEqual('button, Disabled button 200, disabled');
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toEqual('Text anchor');
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toEqual('200');
    });

    it('should have inverse class when inverse is true', async () => {
        const button = await loader.getHarness(DsBonusButtonHarness);
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
        <button (click)="clickEventHandler()" [disabled]="isDisabled" type="button" [inverse]="isInverse" ds-bonus-button>
            Text button
            <span slot="value">200</span>
        </button>
        <button type="submit" ds-bonus-button kind="primary" [inverse]="isInverse">
            Submit button
            <span slot="value">200</span>
        </button>
        <button type="button" disabled ds-bonus-button [inverse]="isInverse">
            Disabled button
            <span slot="value">200</span>
        </button>
        <button type="button" disabled ds-bonus-button [inverse]="isInverse">
            Disabled button
            <span slot="value">200</span>
        </button>
        <a ds-bonus-button [inverse]="isInverse">
            Text anchor
            <span slot="value">200</span>
        </a>
    `,
    standalone: true,
    imports: [DsBonusButton],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
class ButtonTestContainer {
    isClicked = false;
    isInverse = false;
    @Input()
    isDisabled = false;

    clickEventHandler() {
        this.isClicked = true;
    }
}
