import { ChangeDetectionStrategy, Component, ViewChild, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { jest } from '@jest/globals';

import { DsRipple } from './ripple.directive';

const pxStringToFloat = (s: string | null) => (s ? parseFloat(s) : 0);

const TARGET_WIDTH = 300;
const TARGET_HEIGHT = 250;
const CLICK_X = 100;
const CLICK_Y = 100;

describe('DsRipple', () => {
    let fixture: ComponentFixture<DsRippleTestContainer>;
    let rippleTarget: HTMLElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DsRipple, DsRippleTestContainer],
        }).compileComponents();

        fixture = TestBed.createComponent(DsRippleTestContainer);
        fixture.detectChanges();
        // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
        rippleTarget = (fixture.nativeElement as HTMLElement).querySelector('.ds-ripple') as HTMLElement;
        jest.spyOn(rippleTarget, 'getBoundingClientRect').mockReturnValue({
            top: 0,
            left: 0,
            right: TARGET_WIDTH,
            bottom: TARGET_HEIGHT,
            width: TARGET_WIDTH,
            height: TARGET_HEIGHT,
        } as DOMRect);
    });

    it('Basic ripple test', async () => {
        rippleTarget.dispatchEvent(
            new MouseEvent('pointerdown', {
                clientX: CLICK_X,
                screenX: CLICK_X,
                clientY: CLICK_Y,
                screenY: CLICK_Y,
            }),
        );
        const rippleElement: HTMLElement | null = rippleTarget.querySelector('.ds-ripple-element');
        expect(rippleElement).toBeTruthy();
        if (rippleElement == null) {
            throw new Error('invalid ripple element');
        }

        const targetRect = rippleTarget.getBoundingClientRect();

        let maxDistanceX = TARGET_WIDTH - CLICK_X;
        let maxDistanceY = TARGET_HEIGHT - CLICK_Y;
        let expectedRadius = Math.hypot(maxDistanceX, maxDistanceY);
        let expectedLeft = CLICK_X - targetRect.left - expectedRadius;
        let expectedTop = CLICK_Y - targetRect.top - expectedRadius;

        expect(pxStringToFloat(rippleElement.style.left)).toBeCloseTo(expectedLeft, 1);
        expect(pxStringToFloat(rippleElement.style.top)).toBeCloseTo(expectedTop, 1);
        expect(pxStringToFloat(rippleElement.style.width)).toBeCloseTo(2 * expectedRadius, 1);
        expect(pxStringToFloat(rippleElement.style.height)).toBeCloseTo(2 * expectedRadius, 1);

        expect(rippleTarget.querySelector('.ds-ripple-element')).toBeTruthy();
        expect(rippleElement.style.transform).not.toBe('scale3d(0, 0, 0)');
        rippleTarget.dispatchEvent(new MouseEvent('pointerup'));
        // It should still exist, but have scale 0
        expect(rippleTarget.querySelector('.ds-ripple-element')).toBeTruthy();
        expect(rippleElement.style.transform).toBe('scale3d(0, 0, 0)');
    });

    it('centered ripple test', () => {
        fixture.componentRef.setInput('centered', true);
        fixture.detectChanges();
        rippleTarget.dispatchEvent(
            new MouseEvent('pointerdown', {
                clientX: CLICK_X,
                screenX: CLICK_X,
                clientY: CLICK_Y,
                screenY: CLICK_Y,
            }),
        );
        const rippleElement: HTMLElement | null = rippleTarget.querySelector('.ds-ripple-element');
        expect(rippleElement).toBeTruthy();
        if (rippleElement == null) {
            throw new Error('invalid ripple element');
        }

        let maxDistanceX = TARGET_WIDTH / 2;
        let maxDistanceY = TARGET_HEIGHT / 2;
        let expectedRadius = Math.hypot(maxDistanceX, maxDistanceY);
        let expectedLeft = TARGET_WIDTH / 2 - expectedRadius;
        let expectedTop = TARGET_HEIGHT / 2 - expectedRadius;

        expect(pxStringToFloat(rippleElement.style.left)).toBeCloseTo(expectedLeft, 1);
        expect(pxStringToFloat(rippleElement.style.top)).toBeCloseTo(expectedTop, 1);
        expect(pxStringToFloat(rippleElement.style.width)).toBeCloseTo(2 * expectedRadius, 1);
        expect(pxStringToFloat(rippleElement.style.height)).toBeCloseTo(2 * expectedRadius, 1);
    });

    it('custom radius test', () => {
        const radius = 5;
        fixture.componentRef.setInput('radius', radius);
        fixture.detectChanges();
        rippleTarget.dispatchEvent(
            new MouseEvent('pointerdown', {
                clientX: CLICK_X,
                screenX: CLICK_X,
                clientY: CLICK_Y,
                screenY: CLICK_Y,
            }),
        );
        const rippleElement: HTMLElement | null = rippleTarget.querySelector('.ds-ripple-element');
        expect(rippleElement).toBeTruthy();
        if (rippleElement == null) {
            throw new Error('invalid ripple element');
        }

        const targetRect = rippleTarget.getBoundingClientRect();
        let expectedLeft = CLICK_X - targetRect.left - radius;
        let expectedTop = CLICK_Y - targetRect.top - radius;

        expect(pxStringToFloat(rippleElement.style.left)).toBeCloseTo(expectedLeft, 1);
        expect(pxStringToFloat(rippleElement.style.top)).toBeCloseTo(expectedTop, 1);
        expect(pxStringToFloat(rippleElement.style.width)).toBeCloseTo(2 * radius, 1);
        expect(pxStringToFloat(rippleElement.style.height)).toBeCloseTo(2 * radius, 1);
    });

    it('launch multiple ripples, only create 1', () => {
        rippleTarget.dispatchEvent(
            new MouseEvent('pointerdown', {
                clientX: CLICK_X,
                screenX: CLICK_X,
                clientY: CLICK_Y,
                screenY: CLICK_Y,
            }),
        );
        rippleTarget.dispatchEvent(
            new MouseEvent('pointerdown', {
                clientX: CLICK_X,
                screenX: CLICK_X,
                clientY: CLICK_Y,
                screenY: CLICK_Y,
            }),
        );
        rippleTarget.dispatchEvent(
            new MouseEvent('pointerdown', {
                clientX: CLICK_X,
                screenX: CLICK_X,
                clientY: CLICK_Y,
                screenY: CLICK_Y,
            }),
        );
        const rippleElements = rippleTarget.querySelectorAll('.ds-ripple-element');
        expect(rippleElements.length).toBe(1);
    });

    it('disabled ripples should not create', () => {
        fixture.componentRef.setInput('disabled', true);
        fixture.detectChanges();
        rippleTarget.dispatchEvent(
            new MouseEvent('pointerdown', {
                clientX: CLICK_X,
                screenX: CLICK_X,
                clientY: CLICK_Y,
                screenY: CLICK_Y,
            }),
        );
        const rippleElements = rippleTarget.querySelectorAll('.ds-ripple-element');
        expect(rippleElements.length).toBe(0);
    });
});

@Component({
    standalone: true,
    imports: [DsRipple],
    template: ` <div [dsRipple]="{ centered: centered(), disabled: disabled(), radius: radius() }" #ripple="dsRipple" class="wh">Ripple</div> `,
    styles: [
        `
            .wh {
                width: 300px;
                height: 250px;
            }
        `,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
class DsRippleTestContainer {
    @ViewChild('ripple') ripple!: DsRipple;

    centered = input<boolean>(false);
    disabled = input<boolean>(false);
    radius = input<number>(0);
}
