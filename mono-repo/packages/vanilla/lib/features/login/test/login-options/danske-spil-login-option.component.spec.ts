import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrustAsResourceUrlPipe } from '@frontend/vanilla/shared/browser';
import { MockContext } from 'moxxi';

import { HtmlNodeMock } from '../../../../core/test/browser/html-node.mock';
import { NavigationServiceMock } from '../../../../core/test/navigation/navigation.mock';
import { DanskeSpilLoginOptionComponent } from '../../src/login-options/danske-spil-login-option.component';
import { LoginIntegrationConfigMock } from '../login.mocks';

describe('DanskeSpilLoginOptionComponent', () => {
    let fixture: ComponentFixture<DanskeSpilLoginOptionComponent>;
    let component: DanskeSpilLoginOptionComponent;
    let loginIntegrationConfigMock: LoginIntegrationConfigMock;
    let htmlNodeMock: HtmlNodeMock;
    let navigation: NavigationServiceMock;

    beforeEach(() => {
        loginIntegrationConfigMock = MockContext.useMock(LoginIntegrationConfigMock);
        htmlNodeMock = MockContext.useMock(HtmlNodeMock);
        navigation = MockContext.useMock(NavigationServiceMock);

        TestBed.overrideComponent(DanskeSpilLoginOptionComponent, {
            set: {
                imports: [TrustAsResourceUrlPipe],
                providers: [MockContext.providers],
                schemas: [NO_ERRORS_SCHEMA],
            },
        });

        loginIntegrationConfigMock.options = <any>{ loginUrl: 'danske.dk/login', redirectAfterLogin: 'test' };
        navigation.location.baseUrl.and.returnValue('base');
        navigation.location.culture = 'da';
    });

    function initComponent() {
        TestBed.overrideTemplate(DanskeSpilLoginOptionComponent, '<div></div>');

        fixture = TestBed.createComponent(DanskeSpilLoginOptionComponent);
        component = fixture.componentInstance;

        fixture.detectChanges();
        loginIntegrationConfigMock.whenReady.next();
    }

    it('should set html class and url', () => {
        initComponent();

        expect(component.url).toBe('danske.dk/loginbase%2Fda%2Flabelhost%2Fdanske-spil-login-success');
        expect(htmlNodeMock.setCssClass).toHaveBeenCalledWith('danske-spil-login', true);
    });

    it('should remove html class', () => {
        initComponent();

        component.ngOnDestroy();
        expect(htmlNodeMock.setCssClass).toHaveBeenCalledWith('danske-spil-login', false);
    });
});
