import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { MockContext } from 'moxxi';

import { NativeAppConfigMock } from '../../../core/test/native-app/native-app.mock';
import { getBaseUrl } from '../../../test/test-utils';
import { ThirdPartyTrackerComponent } from '../src/third-party-tracker.component';
import { ThirdPartyTrackingServiceMock } from './third-party-tracking.mock';

@Component({
    imports: [ThirdPartyTrackerComponent],
    template: '<vn-third-party-tracker />',
})
class TestHostComponent {
    component: string;
    attr: any;
}

describe('ThirdPartyTrackerComponent', () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let thirdPartyTrackingServiceMock: ThirdPartyTrackingServiceMock;

    beforeEach(() => {
        thirdPartyTrackingServiceMock = MockContext.useMock(ThirdPartyTrackingServiceMock);
        MockContext.useMock(NativeAppConfigMock);

        TestBed.configureTestingModule({
            declarations: [TestHostComponent],
            providers: [MockContext.providers],
            imports: [ThirdPartyTrackerComponent],
        });
        TestBed.overrideComponent(TestHostComponent, { set: { imports: [], providers: [MockContext.providers] } });
        fixture = TestBed.createComponent(TestHostComponent);
        fixture.detectChanges();
    });

    it('should be empty by default', () => {
        expect(fixture.debugElement.query(By.css('img'))).toBeNull();
        expect(fixture.debugElement.query(By.css('div'))).toBeNull();
    });

    it('should contain custom element if trackingContent returns custom element', () => {
        const customElement = '<div><img src="images/tracker.gif"></div>';

        thirdPartyTrackingServiceMock.trackingContent.next(customElement);
        fixture.detectChanges();

        expect(fixture.debugElement.query(By.directive(ThirdPartyTrackerComponent)).query(By.css('div')).nativeElement.innerHTML).toBe(customElement);
    });

    it('should contain Vanilla provided img element if trackingContent returns URL that starts with "http"', () => {
        const imagePath = getBaseUrl() + '/images/tracker.gif';

        thirdPartyTrackingServiceMock.trackingContent.next(imagePath);
        fixture.detectChanges();

        const image: HTMLElement = fixture.debugElement.query(By.css('img')).nativeElement;

        expect(image.getAttribute('src')).toBe(imagePath);
        expect(image.getAttribute('width')).toBe('1');
        expect(image.getAttribute('height')).toBe('1');
    });
});
