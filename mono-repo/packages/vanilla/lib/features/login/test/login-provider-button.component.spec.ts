import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginProvider } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { UtilsServiceMock } from '../../../core/src/utils/test/utils.mock';
import { LoginProviderButtonComponent } from '../src/login-provider-button.component';
import { LoginContentServiceMock, LoginProvidersServiceMock } from './login.mocks';

describe('LoginProviderButtonComponent', () => {
    let fixture: ComponentFixture<LoginProviderButtonComponent>;
    let component: LoginProviderButtonComponent;

    let loginContentServiceMock: LoginContentServiceMock;
    let utilsServiceMock: UtilsServiceMock;

    beforeEach(() => {
        loginContentServiceMock = MockContext.useMock(LoginContentServiceMock);
        utilsServiceMock = MockContext.useMock(UtilsServiceMock);
        MockContext.useMock(LoginProvidersServiceMock);

        loginContentServiceMock.content = <any>{
            children: {
                facebookimage: { image: { src: 'image' } },
                facebookicon: { image: { src: 'icon' } },
            },
            form: {
                facebookbutton: { label: LoginProvider.FACEBOOK },
            },
            messages: {
                ContinueAs: 'continue',
            },
        };

        TestBed.overrideComponent(LoginProviderButtonComponent, {
            set: {
                imports: [CommonModule],
                providers: [MockContext.providers],
                schemas: [NO_ERRORS_SCHEMA],
            },
        });

        fixture = TestBed.createComponent(LoginProviderButtonComponent);
        component = fixture.componentInstance;
        component.provider = LoginProvider.FACEBOOK;

        fixture.detectChanges();
    });

    describe('emmitLogin', () => {
        it('should emmit login event when button is enabled', () => {
            spyOn(component.loginEvent, 'emit');
            component.emmitLogin(true);

            expect(component.loginEvent.emit).toHaveBeenCalledWith(true);
        });
    });

    describe('getBackgroundImage', () => {
        it('should return background icon if connected', () => {
            const backgroundImage = component.getBackgroundImage(true);

            expect(backgroundImage).toEqual({ 'background-image': 'url(icon)' });
        });

        it('should return background image if NOT connected', () => {
            const backgroundImage = component.getBackgroundImage(false);

            expect(backgroundImage).toEqual({ 'background-image': 'url(image)' });
        });

        it('should null if content is missing', () => {
            loginContentServiceMock.content.children.facebookicon!.image = null;

            const backgroundImage = component.getBackgroundImage(true);

            expect(backgroundImage).toBeNull();
        });
    });

    describe('getLabel', () => {
        it('should format profile name', () => {
            component.getLabel('DefaultUser');

            expect(utilsServiceMock.format).toHaveBeenCalledWith('continue', 'DefaultUser');
        });

        it('should return label if no profile name', () => {
            const label = component.getLabel();

            expect(label).toBe(LoginProvider.FACEBOOK);
        });
    });
});
