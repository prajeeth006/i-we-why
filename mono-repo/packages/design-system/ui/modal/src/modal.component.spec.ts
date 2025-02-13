import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DsModalHarness } from '@frontend/ui/modal/testing';
import { virtual } from '@guidepup/virtual-screen-reader';

import { DsModalContent } from './modal-content.component';
import { DsModalHeader } from './modal-header/modal-header.component';
import { DsModal } from './modal.component';

describe('DsModal', () => {
    let loader: HarnessLoader;
    let hostFixture: ComponentFixture<TestComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({ imports: [TestComponent] });

        hostFixture = TestBed.createComponent(TestComponent);
        loader = TestbedHarnessEnvironment.loader(hostFixture);
    });

    it('should render content inside ds-modal-content', async () => {
        const modal = await loader.getHarness(DsModalHarness);
        const content = await modal.getContentText();
        expect(content).toBe('Content');
    });

    it('should render header inside ds-modal-header', async () => {
        const modal = await loader.getHarness(DsModalHarness);
        const content = await modal.getHeaderText();
        expect(content).toBe('MyTitle');
    });

    it('should navigate through list item correctly with screen reader', async () => {
        await virtual.start({ container: hostFixture.nativeElement });

        const modal = await loader.getHarness(DsModalHarness);
        const contentHeader = await modal.getHeaderText();
        expect(contentHeader).toBe('MyTitle');
        await virtual.next();
        const contentText = await modal.getContentText();
        expect(contentText).toBe('Content');
    });
});

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [DsModal, DsModalContent, DsModalHeader],
    template: `
        <ds-modal>
            <ds-modal-header>
                <div slot="center">MyTitle</div>
            </ds-modal-header>
            <ds-modal-content>Content</ds-modal-content>
        </ds-modal>
    `,
})
class TestComponent {}
