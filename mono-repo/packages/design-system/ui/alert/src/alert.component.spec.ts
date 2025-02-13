import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ChangeDetectionStrategy, Component, Input, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DsButton } from '@frontend/ui/button';
import { virtual } from '@guidepup/virtual-screen-reader';

import { DsAlert } from './alert.component';
import { DsAlertHarness } from './testing/src/alert.harness';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [DsButton, DsAlert],
    template: `
        <ds-alert type="success" [inverse]="inverse">
            <span slot="header">Header</span>
            Content of Alert
            <span slot="closeIcon"
                ><svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 0 24 24" width="16">
                    <path d="M0 0h24v24H0z" fill="none" />
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" fill="currentColor" stroke-width="2" />
                </svg>
            </span>
            <span slot="footer">
                <button ds-button variant="flat-reduced" kind="tertiary" size="small">Button</button>
            </span>
        </ds-alert>
    `,
})
class TestHostComponent {
    @Input() inverse = false;
}

describe('AlertInPageComponent', () => {
    let loader: HarnessLoader;
    let fixture: ComponentFixture<TestHostComponent>;
    beforeEach(() => {
        globalThis.fetch = jest.fn().mockResolvedValue({
            ok: true,
            text: () => Promise.resolve('<svg aria-hidden="true">Mocked SVG Content</svg>'),
        });

        TestBed.configureTestingModule({
            schemas: [NO_ERRORS_SCHEMA],
            providers: [],
            imports: [TestHostComponent],
        });

        fixture = TestBed.createComponent(TestHostComponent);
        loader = TestbedHarnessEnvironment.loader(fixture);
        fixture.detectChanges();
    });

    it('should be able to create component instance', () => {
        const hostComponent = fixture.componentInstance;
        expect(hostComponent).toBeTruthy();
    });

    it('should render the header with correct text', async () => {
        const alert = await loader.getHarness(DsAlertHarness);
        const descriptionText = await alert.getHeaderText();
        expect(descriptionText).toBe('Header');
    });

    it('should render the paragraph', async () => {
        const alert = await loader.getHarness(DsAlertHarness);
        const content = await alert.getContent();
        expect(content).toContain('Content of Alert');
    });

    it('should have inverse class when inverse is true', async () => {
        const harness = await loader.getHarness(DsAlertHarness);
        expect(await harness.isInverse()).toBeFalsy();
        fixture.componentRef.setInput('inverse', true);
        expect(await harness.isInverse()).toBeTruthy();
        fixture.componentRef.setInput('inverse', false);
        expect(await harness.isInverse()).toBeFalsy();
    });

    afterEach(() => {
        delete (globalThis as any).fetch;
    });

    it('should read alert content correctly with screen reader', async () => {
        fixture.detectChanges();
        await fixture.whenStable();

        await virtual.start({ container: fixture.nativeElement });

        expect(await virtual.lastSpokenPhrase()).toBe('alert, success alert');
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toBe('Header');
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toBe('Content of Alert');
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toBe('button, Button');
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toBe('end of alert, success alert');
    }, 30000);
});
