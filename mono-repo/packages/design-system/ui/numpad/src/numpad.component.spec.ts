import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { virtual } from '@guidepup/virtual-screen-reader';

import { DsNumpad } from './numpad.component';
import { DsNumpadHarness } from './testing/src/numpad.harness';

describe('DsNumpadHarness', () => {
    let fixture: ComponentFixture<NumpadTestContainer>;
    let loader: HarnessLoader;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NumpadTestContainer],
        }).compileComponents();

        fixture = TestBed.createComponent(NumpadTestContainer);
        fixture.detectChanges();
        loader = TestbedHarnessEnvironment.loader(fixture);
    });

    it('should be able to create component instance', () => {
        const hostComponent = fixture.componentInstance;
        expect(hostComponent).toBeTruthy();
    });

    it('should contain ds-numpad class', async () => {
        const harness = await loader.getHarness(DsNumpadHarness);
        expect(await harness.getHostClasses()).toContain('ds-numpad');
    });

    it('should contain 3 numpads', async () => {
        const harness = await loader.getAllHarnesses(DsNumpadHarness);
        expect(harness.length).toBe(3);
    });

    it('should find harness with oktext', async () => {
        const harness = await loader.getHarness(DsNumpadHarness.with({ okText: 'Ok123' }));
        expect(await harness.getOkText()).toBe('Ok123');
        expect(await harness.getNumberSeparatorText()).toBe(',');
        expect(await harness.isInverse()).toBeTruthy();
    });

    it('should find harness with number separator', async () => {
        const harness = await loader.getHarness(DsNumpadHarness.with({ numberSeparator: ',' }));
        expect(await harness.getOkText()).toBe('Ok123');
    });

    it('should find inverse harness', async () => {
        const harness = await loader.getHarness(DsNumpadHarness.with({ inverse: true }));
        expect(await harness.getOkText()).toBe('Ok123');
    });

    it('should be able to click all buttons', async () => {
        const harness = await loader.getHarness(DsNumpadHarness);
        expect(fixture.componentRef.instance.stack.length).toBe(0);
        await harness.clickAllButtons();
        expect(fixture.componentRef.instance.stack.length).toBe(13);
    });

    it('click events are correctly handled', async () => {
        const harness = await loader.getHarness(DsNumpadHarness);
        const oneButton = await harness.getButtonWithNumber('1');
        const twoButton = await harness.getButtonWithNumber('2');
        const threeButton = await harness.getButtonWithNumber('3');
        const fourButton = await harness.getButtonWithNumber('4');
        const fiveButton = await harness.getButtonWithNumber('5');
        const sixButton = await harness.getButtonWithNumber('6');
        const sevenButton = await harness.getButtonWithNumber('7');
        const eightButton = await harness.getButtonWithNumber('8');
        const nineButton = await harness.getButtonWithNumber('9');
        const zeroButton = await harness.getButtonWithNumber('0');
        const removeButton = await harness.getRemoveButton();
        const okButton = await harness.getOkButton();
        await fourButton.click();
        await oneButton.click();
        await threeButton.click();
        await eightButton.click();
        await zeroButton.click();
        await nineButton.click();
        await fiveButton.click();
        await sevenButton.click();
        await removeButton.click();
        await sixButton.click();
        await twoButton.click();
        await okButton.click();
        expect(fixture.componentRef.instance.stack.join(',')).toBe([4, 1, 3, 8, 0, 9, 5, 7, '<remove>', 6, 2, '<ok>'].join(','));
        fixture.componentRef.instance.stack.length = 0;
    });

    it('should have inverse class when inverse is true', async () => {
        const numpad = await loader.getHarness(DsNumpadHarness.with({ inverse: false }));
        expect(await numpad.isInverse()).toBe(false);
        fixture.componentRef.setInput('isInverse', true);
        expect(await numpad.isInverse()).toBe(true);
        fixture.componentRef.setInput('isInverse', false);
        expect(await numpad.isInverse()).toBe(false);
    });

    it('should navigate correctly with screenreader', async () => {
        await virtual.start({ container: fixture.nativeElement });
        expect(await virtual.lastSpokenPhrase()).toEqual('button, 1');
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toEqual('button, 2');
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toEqual('button, 3');
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toEqual('button, remove character');
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toEqual('button, 4');
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toEqual('button, 5');
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toEqual('button, 6');
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toEqual('button, Ok');
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toEqual('button, 7');
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toEqual('button, 8');
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toEqual('button, 9');
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toEqual('button, 0');
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toEqual('button, .');
    }, 10_000);
});

@Component({
    standalone: true,
    imports: [DsNumpad],
    template: `<div>
        <ds-numpad
            (ok)="pushToStack('<ok>')"
            (remove)="pushToStack('<remove>')"
            (tap)="pushToStack($event)"
            [inverse]="isInverse"
            [numberSeparator]="numberSeparator"
            [okText]="okText" />
        <ds-numpad [numberSeparator]="numberSeparator" [okText]="okText" />
        <ds-numpad [inverse]="true" numberSeparator="," okText="Ok123" />
    </div> `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
class NumpadTestContainer {
    @Input()
    isInverse = false;

    @Input()
    isDisabled = false;

    @Input()
    numberSeparator = '.';

    @Input()
    okText = 'Ok';

    stack: string[] = [];

    pushToStack(key: string) {
        this.stack.push(key);
    }
}
