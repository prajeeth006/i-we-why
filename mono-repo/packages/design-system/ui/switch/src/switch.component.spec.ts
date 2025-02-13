import { HarnessLoader, TestElement } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DsSwitchHarness } from '@frontend/ui/switch/testing';
import { virtual } from '@guidepup/virtual-screen-reader';

import { DsSwitch } from './switch.component';

describe('DsSwitch', () => {
    let fixture: ComponentFixture<DsSwitchTestContainer>;
    let loader: HarnessLoader;

    beforeEach(() => {
        TestBed.configureTestingModule({ imports: [DsSwitchTestContainer] });

        fixture = TestBed.createComponent(DsSwitchTestContainer);
        fixture.detectChanges();
        loader = TestbedHarnessEnvironment.loader(fixture);
    });

    it('should render ds switch', async () => {
        const dsSwitch = await loader.getAllHarnesses(DsSwitchHarness);
        expect(dsSwitch.length).toBe(1);
    });

    it('should render correct input type - checkbox', async () => {
        const harness = await loader.getHarness(DsSwitchHarness);
        expect(await harness.getSwitchVariant()).toBe('checkbox');
    });

    it('should check switch status', async () => {
        const harness = await loader.getHarness(DsSwitchHarness);
        expect(await harness.getSwitchValue()).toBe(false);
    });

    it('should change on click the check', async () => {
        const dsSwitch = await loader.getHarness(DsSwitchHarness);
        expect(await dsSwitch.getSwitchValue()).toEqual(false);
        await dsSwitch.click();
        expect(await dsSwitch.getSwitchValue()).toBe(true);
    });

    it('should add disable css class when it gets disabled', async () => {
        const harness = await loader.getHarness(DsSwitchHarness);
        fixture.componentRef.setInput('disabled', true);
        expect(await harness.hasDisabledClass()).toBe(true);
    });

    it('should render content in slot', async () => {
        const dsSwitch = await loader.getHarness(DsSwitchHarness);
        const slotElement: TestElement | null = await dsSwitch.getSlotElement('[slot=labelOff]');
        expect(slotElement).toBeTruthy();
        const text = await slotElement?.text();
        expect(text).toBe('LabelOff');
    });

    it('should not change on click the check if switch is disabled', async () => {
        const dsSwitch = await loader.getHarness(DsSwitchHarness);
        fixture.componentRef.setInput('disabled', true);
        expect(await dsSwitch.getSwitchValue()).toBe(false);
        expect(await dsSwitch.isDisabled()).toBe(true);

        await dsSwitch.click();
        expect(await dsSwitch.getSwitchValue()).toBe(false);
    });

    it('should navigate through switch correctly with screen reader', async () => {
        const dsSwitch = await loader.getHarness(DsSwitchHarness);
        await virtual.start({ container: fixture.nativeElement });
        expect(await virtual.lastSpokenPhrase()).toEqual('LabelOff');
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toEqual('switch, LabelOff LabelOn, not checked');
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toEqual('LabelOn');
        await virtual.next();

        fixture.componentRef.setInput('checked', true);
        fixture.detectChanges();

        expect(await dsSwitch.getSwitchValue()).toEqual(true);
        expect(await virtual.lastSpokenPhrase()).toEqual('LabelOff');
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toEqual('switch, LabelOff LabelOn, checked');
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toEqual('LabelOn');
        await virtual.next();

        fixture.componentRef.setInput('disabled', true);
        expect(await dsSwitch.isDisabled()).toBe(true);

        expect(await virtual.lastSpokenPhrase()).toEqual('LabelOff');
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toEqual('switch, LabelOff LabelOn, disabled, checked');
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toEqual('LabelOn');
        await virtual.next();

        fixture.componentRef.setInput('disabled', false);
        expect(await dsSwitch.isDisabled()).toBe(false);
        fixture.componentRef.setInput('checked', false);
        fixture.detectChanges();

        expect(await virtual.lastSpokenPhrase()).toEqual('LabelOff');
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toEqual('switch, LabelOff LabelOn, not checked');
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toEqual('LabelOn');
    });
});

@Component({
    standalone: true,
    imports: [DsSwitch],
    template: `
        <ds-switch [(checked)]="checked" [disabled]="disabled">
            <span slot="labelOff">LabelOff</span>
            <span slot="labelOn">LabelOn</span>
        </ds-switch>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
class DsSwitchTestContainer {
    @Input() checked = false;
    @Input() disabled = false;
}
