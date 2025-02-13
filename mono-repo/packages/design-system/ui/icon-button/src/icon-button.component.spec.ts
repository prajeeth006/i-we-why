import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DsIconButtonHarness } from '@frontend/ui/icon-button/testing';
import { virtual } from '@guidepup/virtual-screen-reader';

import { DsIconButton } from './icon-button.component';

describe('DsIconButtonHarness', () => {
    let fixture: ComponentFixture<ButtonTestContainer>;
    let loader: HarnessLoader;

    beforeEach(() => {
        TestBed.configureTestingModule({ imports: [ButtonTestContainer] });

        fixture = TestBed.createComponent(ButtonTestContainer);
        fixture.detectChanges();
        loader = TestbedHarnessEnvironment.loader(fixture);
    });

    it('should load all button harnesses', async () => {
        const buttons = await loader.getAllHarnesses(DsIconButtonHarness);
        expect(buttons.length).toBe(4);
    });

    it('should load disabled button', async () => {
        const buttons = await loader.getAllHarnesses(DsIconButtonHarness.with({ disabled: true }));
        expect(buttons.length).toBe(1);

        expect(await buttons[0].isDisabled()).toBeTruthy();
    });

    it('should disable and enable a button', async () => {
        const button = await loader.getHarness(DsIconButtonHarness);
        expect(await button.isDisabled()).toBe(false);
        fixture.componentInstance.isDisabled = true;
        fixture.componentRef.injector.get(ChangeDetectorRef).detectChanges();
        expect(await button.isDisabled()).toBe(true);
        fixture.componentInstance.isDisabled = false;
        fixture.componentRef.injector.get(ChangeDetectorRef).detectChanges();
        expect(await button.isDisabled()).toBe(false);
    });

    it('should focus and blur a button', async () => {
        const button = await loader.getHarness(DsIconButtonHarness);
        expect(await button.isFocused()).toBe(false);
        await button.focus();
        expect(await button.isFocused()).toBe(true);
        await button.blur();
        expect(await button.isFocused()).toBe(false);
    });

    it('should be able to filter buttons by there size', async () => {
        const button = await loader.getHarness(DsIconButtonHarness.with({ size: 'medium' }));
        expect(await button.hasSize('medium')).toBeTruthy();
        expect(await button.hasSize('large')).toBeFalsy();
    });

    it('should be able to filter buttons by there type', async () => {
        const button = await loader.getAllHarnesses(DsIconButtonHarness.with({ kind: 'primary' }));
        expect(button.length).toBe(2);
        expect(await button[0].hasKind('primary')).toBeTruthy();
        expect(await button[0].hasKind('secondary')).toBeFalsy();
    });

    it('should be able to click a button', async () => {
        const button = await loader.getHarness(DsIconButtonHarness.with({ kind: 'tertiary' }));
        expect(fixture.componentInstance.isClicked).toBeFalsy();
        await button.click();
        expect(fixture.componentInstance.isClicked).toBeTruthy();
    });

    it('should navigate through icon buttons correctly with screen reader', async () => {
        await virtual.start({ container: fixture.nativeElement });
        expect(await virtual.lastSpokenPhrase()).toEqual('button, Icon button');
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toEqual('A');
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toEqual('end of button, Icon button');
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toEqual('button, Icon button');
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toEqual('Content');
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toEqual('end of button, Icon button');
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toEqual('button, Icon button, disabled');
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toEqual('C');
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toEqual('end of button, Icon button, disabled');
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toEqual('Icon button');
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toEqual('Text anchor');
    });

    it('should have inverse class when inverse is true', async () => {
        const button = await loader.getHarness(DsIconButtonHarness);
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
        <button (click)="isClicked = true" [disabled]="isDisabled" ds-icon-button size="small" kind="tertiary" [inverse]="isInverse">A</button>
        <button ds-icon-button size="medium" kind="primary" [inverse]="isInverse">
            <span>Content</span>
        </button>
        <button disabled ds-icon-button size="large" kind="secondary" [inverse]="isInverse">C</button>
        <a ds-icon-button size="small" kind="primary" [inverse]="isInverse">Text anchor</a>
    `,
    standalone: true,
    imports: [DsIconButton],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
class ButtonTestContainer {
    isClicked = false;
    isDisabled = false;
    isInverse = false;
}
