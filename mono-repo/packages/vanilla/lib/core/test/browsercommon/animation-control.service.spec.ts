import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';

import { AnimationControl, AnimationControlService } from '@frontend/vanilla/core';

describe('AnimationControlService', () => {
    let service: AnimationControlService;
    let element: HTMLElement;
    let doc: Document;

    beforeEach(() => {
        doc = TestBed.inject(DOCUMENT);
        service = new AnimationControlService();

        service.addCondition((e) => {
            if (e.classList.contains('aa')) {
                return AnimationControl.Disable;
            }
            return;
        });

        element = doc.createElement('div');
    });

    describe('shouldAnimate()', () => {
        it('return true if conditions dont disable the animation', () => {
            expect(service.shouldAnimate(element)).toBeTrue();
        });

        it('return false if conditions disable the animation', () => {
            element.classList.add('aa');

            expect(service.shouldAnimate(element)).toBeFalse();
        });
    });

    describe('clear()', () => {
        it('should remove all conditions', () => {
            service.clear();

            element.classList.add('aa');

            expect(service.shouldAnimate(element)).toBeTrue();
        });
    });
});
