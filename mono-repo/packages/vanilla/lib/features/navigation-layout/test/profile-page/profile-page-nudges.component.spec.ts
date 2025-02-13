import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { TrackingServiceMock } from '../../../../core/src/tracking/test/tracking.mock';
import { ProfilePageNudgesComponent } from '../../src/profile-page/profile-page-nudges.component';
import { ProfilePageNudgesServiceMock } from '../navigation-layout.mocks';

describe('ProfilePageNudgesComponent', () => {
    let fixture: ComponentFixture<ProfilePageNudgesComponent>;
    let component: ProfilePageNudgesComponent;
    let profilePageNudgesServiceMock: ProfilePageNudgesServiceMock;

    beforeEach(() => {
        profilePageNudgesServiceMock = MockContext.useMock(ProfilePageNudgesServiceMock);
        MockContext.useMock(TrackingServiceMock);

        TestBed.configureTestingModule({
            schemas: [NO_ERRORS_SCHEMA],
            providers: [MockContext.providers],
        });

        fixture = TestBed.createComponent(ProfilePageNudgesComponent);
        component = fixture.componentInstance;
    });

    it('should init items', () => {
        const items = [<any>{ name: 'item1' }, <any>{ name: 'item2' }];

        fixture.detectChanges();
        profilePageNudgesServiceMock.displayItems.next(items);

        expect(component.items).toBe(items);
    });

    it('should hide item', () => {
        const item = <any>{ name: 'item1' };

        component.hide(item);

        expect(profilePageNudgesServiceMock.hide).toHaveBeenCalledWith(item);
    });
});
