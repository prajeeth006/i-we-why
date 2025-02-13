import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LhHeaderBarComponent } from '@frontend/vanilla/features/header-bar';
import { MockContext } from 'moxxi';

import { HeaderBarConfigMock, HeaderBarServiceMock } from './header-bar.mocks';

describe('LhHeaderBarComponent', () => {
    let fixture: ComponentFixture<LhHeaderBarComponent>;
    let component: LhHeaderBarComponent;
    let headerBarServiceMock: HeaderBarServiceMock;

    beforeEach(() => {
        MockContext.useMock(HeaderBarConfigMock);
        headerBarServiceMock = MockContext.useMock(HeaderBarServiceMock);

        TestBed.overrideComponent(LhHeaderBarComponent, {
            set: {
                providers: [MockContext.providers],
                schemas: [NO_ERRORS_SCHEMA],
            },
        });

        fixture = TestBed.createComponent(LhHeaderBarComponent);
        component = fixture.componentInstance;
    });

    describe('init', () => {
        it('should evaluate and set disableClose and showBackButton from config value if disableClose and showBackButton are not defined', () => {
            fixture.detectChanges();

            headerBarServiceMock.disableClose$.next(true);
            headerBarServiceMock.showBackButton$.next(true);

            expect(component.disableClose).toBeTrue();
            expect(component.showBackButton).toBeTrue();
        });
    });
});
