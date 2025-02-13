import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DsSegmentedControlHarness } from '@frontend/ui/segmented-control/testing';
import { virtual } from '@guidepup/virtual-screen-reader';

import { DsSegmentedControl, DsSegmentedOption } from './segmented-control.component';

describe('DsSegmentedControlHarness', () => {
    let fixture: ComponentFixture<SegmentedControlTestContainer>;
    let loader: HarnessLoader;

    beforeEach(() => {
        TestBed.configureTestingModule({ imports: [SegmentedControlTestContainer, DsSegmentedOption] });

        fixture = TestBed.createComponent(SegmentedControlTestContainer);

        fixture.detectChanges();
        loader = TestbedHarnessEnvironment.loader(fixture);
    });

    it('should load all segmentedControl harnesses', async () => {
        const segmentedControl = await loader.getAllHarnesses(DsSegmentedControlHarness);
        expect(segmentedControl.length).toBe(1);
    });

    it('should be able to get options of segmented control', async () => {
        const segmentedControl = await loader.getAllHarnesses(DsSegmentedControlHarness);
        const segments = await segmentedControl[0].getTabs();
        expect(segments.length).toBe(3);
    });

    it('should have fullwidth class when fullwidth is true', async () => {
        const segmentControl = await loader.getHarness(DsSegmentedControlHarness);
        expect(await segmentControl.isFullWidth()).toBe(false);
        fixture.componentInstance.fullWidth = true;
        fixture.componentRef.injector.get(ChangeDetectorRef).detectChanges();
        expect(await segmentControl.isFullWidth()).toBe(true);
        fixture.componentInstance.fullWidth = false;
        fixture.componentRef.injector.get(ChangeDetectorRef).detectChanges();
        expect(await segmentControl.isFullWidth()).toBe(false);
    });

    it('should select tab', async () => {
        const segmentedControl = await loader.getHarness(DsSegmentedControlHarness);
        expect(segmentedControl).toBeTruthy();

        expect(await (await segmentedControl.getSelectedTab()).getText()).toBe('Label1');

        await segmentedControl.selectOption({ text: 'Label2' });
        expect(await (await segmentedControl.getSelectedTab()).getText()).toBe('Label2');

        await segmentedControl.selectOption({ text: 'Label3' });
        expect(await (await segmentedControl.getSelectedTab()).getText()).toBe('Label3');
    });

    it('should select tab by text', async () => {
        const segmentedControl = await loader.getHarness(DsSegmentedControlHarness);
        await segmentedControl.selectTabByText('Label1');
        expect(await (await segmentedControl.getSelectedTab()).getText()).toBe('Label1');
    });

    it('should select tab by name', async () => {
        const segmentedControl = await loader.getHarness(DsSegmentedControlHarness);
        await segmentedControl.selectTabByName('1');
        expect(await (await segmentedControl.getSelectedTab()).getText()).toBe('Label1');
    });

    it('should have inverse class when inverse is true', async () => {
        const segmentControl = await loader.getHarness(DsSegmentedControlHarness);
        expect(await segmentControl.getInverse()).toBe(false);
        fixture.componentInstance.isInverse = true;
        fixture.componentRef.injector.get(ChangeDetectorRef).detectChanges();
        expect(await segmentControl.getInverse()).toBe(true);
        fixture.componentInstance.isInverse = false;
        fixture.componentRef.injector.get(ChangeDetectorRef).detectChanges();
        expect(await segmentControl.getInverse()).toBe(false);
    });

    it('should select specific option based on role (tab or radio)', async () => {
        const segmentControl = await loader.getAllHarnesses(DsSegmentedControlHarness);
        const role = await segmentControl[0].getRole();

        const tabs = await segmentControl[0].getTabs();

        if (role === 'tab') {
            // Test case for role="tab"
            expect(await tabs[0].isSelected()).toBe(true);
            expect(await tabs[1].isSelected()).toBe(false);
            expect(await tabs[2].isSelected()).toBe(false);

            await tabs[1].select();
            expect(await tabs[0].isSelected()).toBe(false);
            expect(await tabs[1].isSelected()).toBe(true);
            expect(await tabs[2].isSelected()).toBe(false);
        } else if (role === 'radio') {
            // Test case for role="radio"
            expect(await tabs[0].isChecked()).toBe(true);
            expect(await tabs[1].isChecked()).toBe(false);
            expect(await tabs[2].isChecked()).toBe(false);

            await tabs[1].select();
            expect(await tabs[0].isChecked()).toBe(false);
            expect(await tabs[1].isChecked()).toBe(true);
            expect(await tabs[2].isChecked()).toBe(false);
        }
    });

    it('should navigate through segmented controls correctly with screen reader', async () => {
        // Start the virtual screen reader
        await virtual.start({ container: fixture.nativeElement });

        // Get the role of the segmented control
        const role = await (await loader.getHarness(DsSegmentedControlHarness)).getRole();

        if (role === 'tablist') {
            // Screen reader expectations when role is "tablist"
            expect(await virtual.lastSpokenPhrase()).toEqual('tablist, orientated horizontally');
            await virtual.next();
            expect(await virtual.lastSpokenPhrase()).toEqual('tab, Label1, position 1, set size 3, selected');
            await virtual.next();
            expect(await virtual.lastSpokenPhrase()).toEqual('tab, Label2, position 2, set size 3, not selected');
            await virtual.next();
            expect(await virtual.lastSpokenPhrase()).toEqual('tab, Label3, position 3, set size 3, not selected');
            await virtual.next();
            expect(await virtual.lastSpokenPhrase()).toEqual('end of tablist, orientated horizontally');

            await virtual.next();

            const segmentedControl = await loader.getHarness(DsSegmentedControlHarness);
            expect(segmentedControl).toBeTruthy();
            await segmentedControl.selectOption({ text: 'Label2' });
            expect(await (await segmentedControl.getSelectedTab()).getText()).toBe('Label2');

            expect(await virtual.lastSpokenPhrase()).toEqual('tablist, orientated horizontally');
            await virtual.next();
            expect(await virtual.lastSpokenPhrase()).toEqual('tab, Label1, position 1, set size 3, not selected');
            await virtual.next();
            expect(await virtual.lastSpokenPhrase()).toEqual('tab, Label2, position 2, set size 3, not selected');
            await virtual.next();
            expect(await virtual.lastSpokenPhrase()).toEqual('tab, Label3, position 3, set size 3, not selected');
            await virtual.next();
            expect(await virtual.lastSpokenPhrase()).toEqual('end of tablist, orientated horizontally');
        } else if (role === 'radiogroup') {
            // Screen reader expectations when role is "radiogroup"
            expect(await virtual.lastSpokenPhrase()).toEqual('radiogroup');
            await virtual.next();
            expect(await virtual.lastSpokenPhrase()).toEqual('radio, Label1, checked, position 1, set size 3');
            await virtual.next();
            expect(await virtual.lastSpokenPhrase()).toEqual('radio, Label2, not checked, position 2, set size 3');
            await virtual.next();
            expect(await virtual.lastSpokenPhrase()).toEqual('radio, Label3, not checked, position 3, set size 3');
            await virtual.next();
            expect(await virtual.lastSpokenPhrase()).toEqual('end of radiogroup');
        }
    }, 10000);
});

@Component({
    template: `
        <ds-segmented-control [inverse]="isInverse" [fullWidth]="fullWidth" [roleType]="roleType">
            <ds-segmented-option name="1" title="Label1" />
            <ds-segmented-option name="2" title="Label2" />
            <ds-segmented-option name="3" title="Label3" />
        </ds-segmented-control>
    `,
    standalone: true,
    imports: [DsSegmentedControl, DsSegmentedOption],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
class SegmentedControlTestContainer {
    isInverse = false;
    fullWidth = false;
    roleType = 'tablist';
}
