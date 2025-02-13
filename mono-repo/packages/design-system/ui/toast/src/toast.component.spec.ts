/* eslint-disable @typescript-eslint/no-unsafe-call */
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DsButton } from '@frontend/ui/button';
import { DsToastHarness } from '@frontend/ui/toast/testing';
import { virtual } from '@guidepup/virtual-screen-reader';

import { DsToast } from './toast.component';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [DsToast, DsButton],
    template: `
        <ds-toast>
            <span slot="statusIcon">Icon</span>
            Description Content
            <button ds-button slot="action" variant="outline" size="small">Online Button</button>
            <span slot="close">Icon</span>
        </ds-toast>
    `,
})
class TestHostComponent {}

describe('DsToastHarness', () => {
    let loader: HarnessLoader;
    let hostFixture: ComponentFixture<TestHostComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestHostComponent],
        }).compileComponents();

        hostFixture = TestBed.createComponent(TestHostComponent);
        loader = TestbedHarnessEnvironment.loader(hostFixture);
        hostFixture.detectChanges();
    });

    it('should create the TestHostComponent', () => {
        const hostComponent = hostFixture.componentInstance;
        expect(hostComponent).toBeTruthy();
    });

    it('should render status icon', async () => {
        const toast = await loader.getHarness(DsToastHarness);
        const hasStatusIcon = await toast.hasStatusIcon();
        expect(hasStatusIcon).toBeTruthy();
    });

    it('should render description content', async () => {
        const toast = await loader.getHarness(DsToastHarness);
        const descriptionText = await toast.getDescriptionText();
        expect(descriptionText).toBe('Description Content');
    });

    it('should render action button', async () => {
        const toast = await loader.getHarness(DsToastHarness);
        const hasActionButton = await toast.hasActionButton();
        expect(hasActionButton).toBeTruthy();
    });

    it('should render close icon', async () => {
        const toast = await loader.getHarness(DsToastHarness);
        const hasCloseIcon = await toast.hasCloseIcon();
        expect(hasCloseIcon).toBeTruthy();
    });

    it('should navigate through toast correctly with screen reader', async () => {
        hostFixture.detectChanges();
        await hostFixture.whenStable();
        await virtual.start({ container: hostFixture.nativeElement });
        expect(await virtual.lastSpokenPhrase()).toBe('status, [Input Signal: info] toast');
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toEqual('Icon');
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toEqual('Description Content');
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toEqual('button, Online Button');
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toEqual('Icon');
    });
});
