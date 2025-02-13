import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DsModalHeaderHarness } from '../testing/src/public_api';
import { DsModalHeader, DsModalHeaderVariant } from './modal-header.component';

describe('DsModalHeader', () => {
    let loader: HarnessLoader;
    let hostFixture: ComponentFixture<TestComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({ imports: [TestComponent] });

        hostFixture = TestBed.createComponent(TestComponent);
        loader = TestbedHarnessEnvironment.loader(hostFixture);
    });

    it('should render default variant', async () => {
        const modal = await loader.getHarness(DsModalHeaderHarness);
        expect(await modal.hasVariant('surface')).toBe(true);
    });

    it('should render correct variant', async () => {
        hostFixture.componentRef.setInput('variant', 'surface-high');
        await hostFixture.whenStable();

        const modal = await loader.getHarness(DsModalHeaderHarness);

        expect(await modal.hasVariant('surface-high')).toBe(true);

        hostFixture.componentRef.setInput('variant', 'surface-low');
        await hostFixture.whenStable();
        expect(await modal.hasVariant('surface-low')).toBe(true);
    });
});

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [DsModalHeader],
    template: `
        @if (variant()) {
            <ds-modal-header [variant]="variant()!"> Hello world! </ds-modal-header>
        } @else {
            <ds-modal-header> Hello world! </ds-modal-header>
        }
    `,
})
class TestComponent {
    variant = input<DsModalHeaderVariant>();
}
