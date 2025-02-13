import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { UserUpdateEvent } from '@frontend/vanilla/core';
import { AuthstateDirective, AuthstateOptions } from '@frontend/vanilla/shared/auth';
import { MockContext } from 'moxxi';

import { UserServiceMock } from '../../../core/test/user/user.mock';

@Component({
    template: '<div><a href="#" *vnAuthstate="authOptions">foo</a>bar</div>',
})
class TestHostComponent {
    authOptions: AuthstateOptions = {};
}

describe('AuthstateDirective', () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let userMock: UserServiceMock;

    beforeEach(() => {
        userMock = MockContext.useMock(UserServiceMock);

        TestBed.configureTestingModule({
            imports: [AuthstateDirective],
            declarations: [TestHostComponent],
            providers: [MockContext.providers],
        });
    });

    function initDirective() {
        fixture = TestBed.createComponent(TestHostComponent);

        fixture.detectChanges();
    }

    it('should show the element by default', () => {
        initDirective();

        expect(getDirectiveElement()).toExist();
    });

    it('should update when user state changes', () => {
        initDirective();

        fixture.componentInstance.authOptions = { authenticated: 'hide', unauthenticated: 'show', workflow: 'disabled' };
        userMock.workflowType = 0;
        userMock.isAuthenticated = false;
        userMock.triggerEvent(new UserUpdateEvent(new Map()));
        fixture.detectChanges();

        expect(getDirectiveElement()).toExist();

        userMock.isAuthenticated = true;
        userMock.triggerEvent(new UserUpdateEvent(new Map()));
        fixture.detectChanges();

        expect(getDirectiveElement()).toBeUndefined();

        userMock.workflowType = 1;
        userMock.triggerEvent(new UserUpdateEvent(new Map()));
        fixture.detectChanges();

        expect(getDirectiveElement()).toExist();
        expect(getDirectiveElement()).toHaveClass('disabled');

        userMock.workflowType = -1;
        userMock.triggerEvent(new UserUpdateEvent(new Map()));
        fixture.detectChanges();

        expect(getDirectiveElement()).toBeUndefined();

        userMock.workflowType = 0;
        userMock.isAuthenticated = false;
        userMock.triggerEvent(new UserUpdateEvent(new Map()));
        fixture.detectChanges();

        expect(getDirectiveElement()).toExist();
        expect(getDirectiveElement()).not.toHaveClass('disabled');
    });

    it('should update when auth options change', () => {
        initDirective();

        userMock.isAuthenticated = true;
        userMock.workflowType = 0;

        fixture.componentInstance.authOptions = { authenticated: 'hide' };
        fixture.detectChanges();

        expect(getDirectiveElement()).toBeUndefined();

        fixture.componentInstance.authOptions = { authenticated: 'show' };
        fixture.detectChanges();

        expect(getDirectiveElement()).toExist();
    });

    testAuthstate('unauthenticated');
    testAuthstate('authenticated');
    testAuthstate('workflow');

    function testAuthstate(authstate: string) {
        describe(`authstate: '${authstate}'`, () => {
            beforeEach(() => {
                if (authstate === 'authenticated') {
                    userMock.isAuthenticated = true;
                } else {
                    userMock.isAuthenticated = false;
                }

                if (authstate === 'workflow') {
                    userMock.workflowType = 1;
                } else {
                    userMock.workflowType = 0;
                }
            });

            it('should set "disabled" behavior', () => {
                initDirective();

                const options: Record<string, string> = {};
                options[authstate] = 'disabled';
                fixture.componentInstance.authOptions = options;

                fixture.detectChanges();

                expect(getDirectiveElement()).toHaveClass('disabled');
            });

            it('should set "show" behavior', () => {
                initDirective();

                const options: Record<string, string> = {};
                options[authstate] = 'show';
                fixture.componentInstance.authOptions = options;

                fixture.detectChanges();

                expect(getDirectiveElement()).toExist();
            });

            it('should set "hide" behavior', () => {
                initDirective();

                const options: Record<string, string> = {};
                options[authstate] = 'hide';
                fixture.componentInstance.authOptions = options;

                fixture.detectChanges();

                expect(getDirectiveElement()).toBeUndefined();
            });
        });
    }

    function getDirectiveElement() {
        const debugeEl = fixture.debugElement.query(By.css('a'));
        return debugeEl ? debugeEl.nativeElement : undefined;
    }
});
