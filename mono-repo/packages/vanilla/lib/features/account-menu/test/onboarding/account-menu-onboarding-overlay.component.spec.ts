import { CommonModule } from '@angular/common';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuContentItem } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { MockDslPipe2 } from '../../../../core/test/browser/dsl.pipe.mock';
import { OverlayRefMock } from '../../../../shared/overlay-factory/test/cdk-overlay.mock';
import { AccountMenuOnboardingOverlayComponent } from '../../src/onboarding/account-menu-onboarding-overlay.component';
import { AccountMenuOnboardingServiceMock } from '../account-menu-data.mock';
import { AccountMenuTrackingServiceMock } from '../account-menu-tracking.mock';
import { AccountMenuConfigMock } from '../menu-content.mock';

@Component({
    selector: 'vn-carousel',
    template: '',
})
export class TestCarouselComponent {
    swiper = {
        activeIndex: 0,
        slidePrev: jasmine.createSpy('slidePrev'),
        slideNext: jasmine.createSpy('slideNext'),
        slides: [1, 2, 3, 4, 5],
    };
}

describe('AccountMenuOnboardingOverlayComponent', () => {
    let fixture: ComponentFixture<AccountMenuOnboardingOverlayComponent>;
    let component: AccountMenuOnboardingOverlayComponent;
    let menuContentMock: AccountMenuConfigMock;
    let overlayRefMock: OverlayRefMock;
    let accountMenuOnboardingServiceMock: AccountMenuOnboardingServiceMock;

    beforeEach(() => {
        menuContentMock = MockContext.useMock(AccountMenuConfigMock);
        overlayRefMock = MockContext.useMock(OverlayRefMock);
        MockContext.useMock(AccountMenuTrackingServiceMock);
        accountMenuOnboardingServiceMock = MockContext.useMock(AccountMenuOnboardingServiceMock);

        TestBed.overrideComponent(AccountMenuOnboardingOverlayComponent, {
            set: {
                imports: [CommonModule, MockDslPipe2],
                providers: [MockContext.providers],
                schemas: [NO_ERRORS_SCHEMA],
            },
        });

        menuContentMock.onBoarding = {
            startTourScreen: {
                text: 'start',
                resources: {},
            },
            tourItems: [],
        };

        fixture = TestBed.createComponent(AccountMenuOnboardingOverlayComponent);
        component = fixture.componentInstance;
    });

    it('init', () => {
        component.ngOnInit();

        expect(component.content).toEqual({ text: 'start', resources: {} } as MenuContentItem);
        expect(component.tourItems).toEqual([]);
    });

    it('startTour', () => {
        component.startTour();

        expect(component.showStartScreen).toBeFalse();
    });

    it('close', () => {
        component.close(true);

        expect(overlayRefMock.detach).toHaveBeenCalled();
        expect(accountMenuOnboardingServiceMock.saveTourCompleted).toHaveBeenCalled();
    });

    describe('carousel', () => {
        beforeEach(() => {
            component.startTour();
            fixture.detectChanges();
            component.carousel = TestBed.createComponent(TestCarouselComponent).componentInstance as any;
        });

        it('next', () => {
            component.next();

            expect(component.carousel.swiper.slideNext).toHaveBeenCalled();
        });

        it('previous', () => {
            component.previous();

            expect(component.carousel.swiper.slidePrev).toHaveBeenCalled();
        });

        describe('indexChanged', () => {
            it('should not show it got it button', () => {
                component.carousel.swiper.activeIndex = 3;
                component.carousel.swiper.slideNext();
                expect(component.showGotItButton).toBeFalse();
            });

            it('should show got it button', () => {
                component.carousel.swiper.activeIndex = 4;
                component.carousel.swiper.slideNext();
                component.indexChanged(component.carousel.swiper);
                expect(component.showGotItButton).toBeTrue();
            });
        });
    });
});
