import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';
import { MockComponent } from 'ng-mocks';

import { IconCustomComponent } from '../../icons/src/icon-fast.component';
import { SmartBannerStarsComponent } from '../src/smart-banner-stars.component';

describe('SmartBannerStarsComponent', () => {
    let fixture: ComponentFixture<SmartBannerStarsComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [MockContext.providers],
            schemas: [NO_ERRORS_SCHEMA],
        });

        TestBed.overrideComponent(SmartBannerStarsComponent, {
            remove: {
                imports: [IconCustomComponent],
            },
            add: {
                imports: [MockComponent(IconCustomComponent)],
            },
        });

        fixture = TestBed.createComponent(SmartBannerStarsComponent);
    });

    describe('init', () => {
        it('should set four and a half stars if rating is 4.45', () => {
            fixture.componentRef.setInput('rating', 4.45);

            fixture.detectChanges();

            expect(fixture.componentInstance.starClass()).toEqual([
                'theme-rating-star-full',
                'theme-rating-star-full',
                'theme-rating-star-full',
                'theme-rating-star-full',
                'theme-rating-star-half',
            ]);
        });

        it('should set four stars if rating is 4.00', () => {
            fixture.componentRef.setInput('rating', 4);

            fixture.detectChanges();

            expect(fixture.componentInstance.starClass()).toEqual([
                'theme-rating-star-full',
                'theme-rating-star-full',
                'theme-rating-star-full',
                'theme-rating-star-full',
                'theme-rating-star-empty',
            ]);
        });
    });
});
