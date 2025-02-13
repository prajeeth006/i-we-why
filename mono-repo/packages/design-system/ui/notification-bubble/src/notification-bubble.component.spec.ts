import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { virtual } from '@guidepup/virtual-screen-reader';

import { DsNotificationBubble } from './notification-bubble.component';
import { DsNotificationBubbleHarness } from './testing/src/notification-bubble.harness';

describe('DsNotificationBubbleHarness', () => {
    let fixture: ComponentFixture<NotificationBubbleTestContainer>;
    let loader: HarnessLoader;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NotificationBubbleTestContainer],
        }).compileComponents();

        fixture = TestBed.createComponent(NotificationBubbleTestContainer);
        fixture.detectChanges();
        loader = TestbedHarnessEnvironment.loader(fixture);
    });

    it('should find notification bubble with specific size and variant', async () => {
        fixture.componentRef.setInput('size', 'small');
        fixture.componentRef.setInput('variant', 'utility');

        const notificationBubbles = await loader.getAllHarnesses(DsNotificationBubbleHarness.with({ size: 'small', variant: 'utility' }));
        expect(notificationBubbles.length).toBe(1);
    });

    it('should react to size changes', async () => {
        fixture.componentRef.setInput('size', 'large');

        const notificationBubble = await loader.getHarness(DsNotificationBubbleHarness.with({ size: 'large' }));
        expect(await notificationBubble.hasSize('large')).toBe(true);
    });

    it('should test content', async () => {
        fixture.componentRef.setInput('injectContent', true);

        const notificationBubble = await loader.getHarness(DsNotificationBubbleHarness);
        const hostElement = await notificationBubble.host();
        const text = await hostElement.text();
        expect(text).toBe('Some Text');
    });

    it('should update classes when size changes', async () => {
        const notificationBubble = await loader.getHarness(DsNotificationBubbleHarness);
        expect(await notificationBubble.hasSize('medium')).toBe(true);

        fixture.componentRef.setInput('size', 'large');

        expect(await notificationBubble.hasSize('large')).toBe(true);
        expect(await notificationBubble.hasSize('medium')).toBe(false); // Check that the old size class is removed
    });

    it('should not find notification bubble with variant that is not present', async () => {
        const notificationBubbles = await loader.getAllHarnesses(DsNotificationBubbleHarness.with({ variant: 'live' }));
        expect(notificationBubbles.length).toBe(0);
    });

    it('should have inverse class when inverse is true', async () => {
        const harness = await loader.getHarness(DsNotificationBubbleHarness);
        expect(await harness.isInverse()).toBeFalsy();
        fixture.componentRef.setInput('inverse', true);
        expect(await harness.isInverse()).toBeTruthy();
        fixture.componentRef.setInput('inverse', false);
        expect(await harness.isInverse()).toBeFalsy();
    });

    it('should read notification bubble content correctly with screen reader', async () => {
        fixture.componentRef.setInput('size', 'small');
        fixture.componentRef.setInput('variant', 'utility');
        fixture.componentRef.setInput('injectContent', true);
        fixture.detectChanges();

        await virtual.start({ container: fixture.nativeElement });
        expect(await virtual.lastSpokenPhrase()).toEqual('status, Notification Some Text');
        await virtual.stop();
    }, 10000);
});

@Component({
    standalone: true,
    imports: [DsNotificationBubble],
    template: `
        <ds-notification-bubble [size]="size" [variant]="variant" [inverse]="inverse">
            @if (injectContent) {
                <span> Some Text</span>
            }
        </ds-notification-bubble>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
class NotificationBubbleTestContainer {
    @Input()
    label = 'Initial Label';
    @Input()
    size = 'medium'; // Default size
    @Input()
    variant = 'primary'; // Default variant
    @Input()
    inverse = false;
    @Input()
    injectContent = false; // Controls whether text is shown in the slot
}
