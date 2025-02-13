import { TestBed } from '@angular/core/testing';

import { WINDOW } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { MenuActionsServiceMock } from '../../../core/test/menu-actions/menu-actions.mock';
import { NativeAppServiceMock } from '../../../core/test/native-app/native-app.mock';
import { NavigationServiceMock } from '../../../core/test/navigation/navigation.mock';
import { UrlServiceMock } from '../../../core/test/navigation/url.mock';
import { ZendeskBootstrapService } from '../src/zendesk-bootstrap.service';

describe('ZendeskBootstrapService', () => {
    let service: ZendeskBootstrapService;
    let menuActionServiceMock: MenuActionsServiceMock;

    beforeEach(() => {
        MockContext.useMock(NavigationServiceMock);
        MockContext.useMock(UrlServiceMock);
        MockContext.useMock(NativeAppServiceMock);
        menuActionServiceMock = MockContext.useMock(MenuActionsServiceMock);

        TestBed.configureTestingModule({
            providers: [ZendeskBootstrapService, MockContext.providers],
        });

        TestBed.inject(WINDOW);
        service = TestBed.inject(ZendeskBootstrapService);
    });

    describe('OnFeatureInit', () => {
        it('should register menu action', () => {
            service.onFeatureInit();

            expect(menuActionServiceMock.register).toHaveBeenCalledWith('openZendeskChat', jasmine.anything());
        });
    });
});
