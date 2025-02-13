import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { AuthstateDirective } from '@frontend/vanilla/shared/auth';
import { MockContext } from 'moxxi';

import { HtmlNodeMock } from '../../../core/test/browser/html-node.mock';
import { PageMock } from '../../../core/test/browsercommon/page.mock';
import { DslServiceMock } from '../../../core/test/dsl/dsl.mock';
import { NavigationServiceMock } from '../../../core/test/navigation/navigation.mock';
import { UrlServiceMock } from '../../../core/test/navigation/url.mock';
import { UserServiceMock } from '../../../core/test/user/user.mock';
import { BottomNavComponent } from '../../../features/bottom-nav/src/bottom-nav.component';
import { BottomNavService } from '../../../features/bottom-nav/src/bottom-nav.service';
import { MenuItemsServiceMock } from '../../account-menu/test/menu-items.mock';
import { BottomNavConfigMock } from './bottom-nav-config.mock';

describe('BottomNavComponent', () => {
    let fixture: ComponentFixture<BottomNavComponent>;
    let bottomNavService: BottomNavService;
    let htmlNodeMock: HtmlNodeMock;
    let bottomNavConfigMock: BottomNavConfigMock;
    let dslServiceMock: DslServiceMock;

    beforeEach(() => {
        MockContext.useMock(UserServiceMock);
        MockContext.useMock(MenuItemsServiceMock);
        MockContext.useMock(NavigationServiceMock);
        MockContext.useMock(UrlServiceMock);
        MockContext.useMock(PageMock);
        MockContext.useMock(BottomNavConfigMock);
        htmlNodeMock = MockContext.useMock(HtmlNodeMock);
        dslServiceMock = MockContext.useMock(DslServiceMock);
        bottomNavConfigMock = MockContext.useMock(BottomNavConfigMock);

        TestBed.configureTestingModule({
            imports: [CommonModule, AuthstateDirective, NoopAnimationsModule],
            providers: [MockContext.providers, BottomNavService],
            schemas: [NO_ERRORS_SCHEMA],
        });

        fixture = TestBed.createComponent(BottomNavComponent);
        bottomNavService = TestBed.inject(BottomNavService);
        bottomNavConfigMock.isEnabledCondition = 'condition';

        fixture.detectChanges();
        dslServiceMock.evaluateExpression.next(true);
    });

    describe('init', () => {
        it('should be visible and add html node class', () => {
            expect(fixture.componentInstance.visible).toBeTrue();
            expect(htmlNodeMock.setCssClass).toHaveBeenCalledWith('bottom-nav-shown', true);
        });
    });

    describe('control', () => {
        describe('show()', () => {
            it('should set show and add html node class', () => {
                bottomNavService.hide();
                htmlNodeMock.setCssClass.calls.reset();
                bottomNavService.show();

                expectShown(true);
            });
        });

        describe('hide()', () => {
            it('should set hide and remove html node class', () => {
                bottomNavService.hide();

                expectShown(false);
            });
        });

        describe('disable', () => {
            it('should subscribe to isEnabledCondition', () => {
                expect(dslServiceMock.evaluateExpression).toHaveBeenCalledWith('condition');
            });

            it('should hide when disabled', () => {
                dslServiceMock.evaluateExpression.next(false);

                expectShown(false);
            });

            it('should use current state when enabled', () => {
                dslServiceMock.evaluateExpression.next(false);
                expectShown(false);
                dslServiceMock.evaluateExpression.next(true);
                expectShown(true);
            });

            it('should not react to show and hide when disabled', () => {
                dslServiceMock.evaluateExpression.next(false);
                expectShown(false);
                bottomNavService.hide();
                expectShown(false);
                bottomNavService.show();
                expectShown(false);
                dslServiceMock.evaluateExpression.next(true);
                expectShown(true);
            });
        });
    });

    function expectShown(shown: boolean) {
        expect(htmlNodeMock.setCssClass).toHaveBeenCalledWith('bottom-nav-shown', shown);
        expect(fixture.componentInstance.visible).toBe(shown);
    }
});
