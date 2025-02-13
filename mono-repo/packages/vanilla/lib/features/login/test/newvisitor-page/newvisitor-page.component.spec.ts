import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { HtmlNodeMock } from '../../../../core/test/browser/html-node.mock';
import { NewVisitorPageComponent } from '../../src/newvisitor-page/newvisitor-page.component';
import { LoginContentMock, LoginServiceMock } from '../login.mocks';

describe('NewVisitorPageComponent', () => {
    let fixture: ComponentFixture<NewVisitorPageComponent>;
    let component: NewVisitorPageComponent;
    let loginContentMock: LoginContentMock;
    let loginServiceMock: LoginServiceMock;
    let htmlNodeMock: HtmlNodeMock;

    beforeEach(() => {
        loginContentMock = MockContext.useMock(LoginContentMock);
        loginServiceMock = MockContext.useMock(LoginServiceMock);
        htmlNodeMock = MockContext.useMock(HtmlNodeMock);

        TestBed.overrideComponent(NewVisitorPageComponent, {
            set: {
                providers: [MockContext.providers],
                schemas: [NO_ERRORS_SCHEMA],
            },
        });

        fixture = TestBed.createComponent(NewVisitorPageComponent);
        component = fixture.componentInstance;

        fixture.detectChanges();
    });

    describe('ngOnInit', () => {
        it('should set HTML CSS class', fakeAsync(() => {
            loginContentMock.whenReady.next();
            tick();

            expect(htmlNodeMock.setCssClass).toHaveBeenCalledOnceWith('cdk-global-scrollblock', true);
        }));
    });

    describe('ngOnDestroy', () => {
        it('should remove HTML CSS class', () => {
            fixture.destroy();

            expect(htmlNodeMock.setCssClass).toHaveBeenCalledOnceWith('cdk-global-scrollblock', false);
        });
    });

    describe('getItemComponent', () => {
        it('should get new visitor component from login service', () => {
            component.getItemComponent('test');

            expect(loginServiceMock.getNewVisitorComponent).toHaveBeenCalledOnceWith('test');
        });
    });
});
