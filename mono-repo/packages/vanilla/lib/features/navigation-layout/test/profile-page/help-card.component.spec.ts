import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { TrackingServiceMock } from '../../../../core/src/tracking/test/tracking.mock';
import { MenuActionsServiceMock } from '../../../../core/test/menu-actions/menu-actions.mock';
import { HelpCardComponent } from '../../src/profile-page/help-card.component';

describe('HelpCardComponent', () => {
    let fixture: ComponentFixture<HelpCardComponent>;
    let component: HelpCardComponent;
    let menuActionsServiceMock: MenuActionsServiceMock;

    beforeEach(() => {
        menuActionsServiceMock = MockContext.useMock(MenuActionsServiceMock);
        MockContext.useMock(TrackingServiceMock);

        TestBed.overrideComponent(HelpCardComponent, {
            set: {
                imports: [],
                schemas: [NO_ERRORS_SCHEMA],
                providers: [MockContext.providers],
            },
        });

        fixture = TestBed.createComponent(HelpCardComponent);
        component = fixture.componentInstance;
    });

    it('should init successfully', () => {
        const event = new Event('click');
        const item = <any>{ name: 'item' };

        component.itemClick(event, item, 'test');
        expect(menuActionsServiceMock.processClick).toHaveBeenCalledWith(event, item, 'test');
    });
});
