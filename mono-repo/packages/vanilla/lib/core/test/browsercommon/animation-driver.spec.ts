import { AnimationDriver as AngularAnimationDriver, ɵWebAnimationsDriver } from '@angular/animations/browser';
import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { AnimationDriver } from '../../src/browser/animation-driver';
import { AnimationControlServiceMock } from './animation-control.mock';

describe('AnimationDriver', () => {
    let driver: AnimationDriver;
    let animationControlServiceMock: AnimationControlServiceMock;
    let doc: Document;

    beforeEach(() => {
        animationControlServiceMock = MockContext.useMock(AnimationControlServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, AnimationDriver],
        });

        doc = TestBed.inject(DOCUMENT);
        driver = TestBed.inject(AnimationDriver);
    });

    describe('animate()', () => {
        it('should run animation if control service allows it', () => {
            const spy = spyOn(ɵWebAnimationsDriver.prototype, 'animate');
            const element = doc.createElement('div');
            const keyFrames = <any>[{ frame: 1 }];
            const prevPlayers = <any>[{ player: 1 }];

            animationControlServiceMock.shouldAnimate.and.returnValue(true);

            driver.animate(element, keyFrames, 5, 10, 'lul', prevPlayers);

            expect(spy).toHaveBeenCalledWith(element, keyFrames, 5, 10, 'lul', prevPlayers);
        });

        it('should not run animation if control service doesnt allows it', () => {
            const spy = spyOn(AngularAnimationDriver.NOOP, 'animate');
            const element = doc.createElement('div');
            const keyFrames = new Map<string, number>([['frame', 1]]);
            const prevPlayers = [{ player: 1 }];

            animationControlServiceMock.shouldAnimate.and.returnValue(false);

            driver.animate(element, [keyFrames], 5, 10, 'lul', prevPlayers as any);

            expect(spy).toHaveBeenCalledWith(element, [keyFrames], 5, 10, 'lul', prevPlayers);
        });
    });
});
