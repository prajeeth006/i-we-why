import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { WINDOW } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { MediaQueryServiceMock } from '../../../core/test/browser/media-query.service.mock';
import { ElementRepositoryServiceMock } from '../../../core/test/browsercommon/element-repository.mock';
import { Renderer2Mock } from '../../../core/test/renderer2.mock';
import { UserServiceMock } from '../../../core/test/user/user.mock';
import { AccountMenuTasksServiceMock } from '../../account-menu/test/account-menu-data.mock';
import { NavigationLayoutComponent } from '../src/navigation-layout.component';
import { NavigationLayoutScrollServiceMock, NavigationLayoutServiceMock } from './navigation-layout.mocks';

describe('NavigationLayoutComponent', () => {
    let fixture: ComponentFixture<NavigationLayoutComponent>;
    let component: NavigationLayoutComponent;
    let navigationLayoutServiceMock: NavigationLayoutServiceMock;
    let navigationLayoutScrollServiceMock: NavigationLayoutScrollServiceMock;

    beforeEach(() => {
        MockContext.useMock(Renderer2Mock);
        MockContext.useMock(UserServiceMock);
        navigationLayoutServiceMock = MockContext.useMock(NavigationLayoutServiceMock);
        navigationLayoutScrollServiceMock = MockContext.useMock(NavigationLayoutScrollServiceMock);
        MockContext.useMock(ElementRepositoryServiceMock);
        MockContext.useMock(MediaQueryServiceMock);
        MockContext.useMock(AccountMenuTasksServiceMock);

        TestBed.overrideComponent(NavigationLayoutComponent, {
            set: {
                imports: [],
                schemas: [NO_ERRORS_SCHEMA],
                providers: [MockContext.providers],
            },
        });

        TestBed.inject(WINDOW);
        navigationLayoutServiceMock.getItem.and.returnValue({});
    });

    function initComponent() {
        fixture = TestBed.createComponent(NavigationLayoutComponent);
        component = fixture.componentInstance;
        component.ngOnInit();
    }

    describe('onScroll', () => {
        it('should send scroll event after 300ms', fakeAsync(() => {
            initComponent();
            component.ngAfterViewInit();

            const event = new Event('scroll');
            component.onScroll(event);

            tick(300);

            expect(navigationLayoutScrollServiceMock.sendScrollEvent).toHaveBeenCalledWith(event.target, component.scrolledToBottomPadding);
        }));
    });
});
