import { TestBed } from '@angular/core/testing';

import { WINDOW } from '@frontend/vanilla/core';
import { AccountMenuRouter, MenuRoute } from '@frontend/vanilla/shared/account-menu';
import { MockContext } from 'moxxi';

import { WindowMock } from '../../../core/src/browser/window/test/window-ref.mock';
import { PageMock } from '../../../core/test/browsercommon/page.mock';
import { LoggerMock } from '../../../core/test/languages/logger.mock';
import { NavigationServiceMock } from '../../../core/test/navigation/navigation.mock';
import { AccountMenuDataServiceMock } from './account-menu-data.mock';

describe('AccountMenuRouter', () => {
    let router: AccountMenuRouter;
    let accountMenuDataServiceMock: AccountMenuDataServiceMock;
    let navigationServiceMock: NavigationServiceMock;
    let windowMock: WindowMock;
    let loggerMock: LoggerMock;
    let currentRoute: MenuRoute | null;
    let pageMock: PageMock;

    beforeEach(() => {
        accountMenuDataServiceMock = MockContext.useMock(AccountMenuDataServiceMock);
        navigationServiceMock = MockContext.useMock(NavigationServiceMock);
        windowMock = new WindowMock();
        loggerMock = MockContext.useMock(LoggerMock);
        pageMock = MockContext.useMock(PageMock);

        TestBed.configureTestingModule({
            providers: [
                MockContext.providers,
                AccountMenuRouter,
                {
                    provide: WINDOW,
                    useValue: windowMock,
                },
            ],
        });

        router = TestBed.inject(AccountMenuRouter);
        router.currentRoute.subscribe((r) => (currentRoute = r));
    });

    describe('common', () => {
        beforeEach(() => {
            accountMenuDataServiceMock.content.next(<any>{
                name: 'main',
                menuRoute: 'menu',
                children: [
                    {
                        name: 'myaccount',
                        menuRoute: 'menu/account',
                        children: [
                            {
                                name: 'settings',
                                menuRoute: 'menu/account/settings',
                            },
                        ],
                    },
                    {
                        name: 'mygame',
                        menuRoute: 'menu/game',
                    },
                ],
            });
        });

        it('should allow navigation to routes', () => {
            router.navigateToRoute('menu/account');

            expect(currentRoute!.item.name).toBe('myaccount');
        });

        it('should log warning when trying to navigate to non existant route', () => {
            router.navigateToRoute('menu/xxx');

            expect(currentRoute).toBeNull();
            expect(loggerMock.warn).toHaveBeenCalled();
        });

        it('should construct a routing tree', () => {
            router.setRoute('menu');

            expect(currentRoute!.parent).toBeNull();
            expect(currentRoute!.item.name).toBe('main');
            expect(currentRoute!.children.size).toBe(2);

            const myAccount = currentRoute!.children.get('account')!;
            expect(myAccount.item.name).toBe('myaccount');
            expect(myAccount.parent).toBe(currentRoute);
            expect(myAccount.children.size).toBe(1);

            const myGame = currentRoute!.children.get('game')!;
            expect(myGame.item.name).toBe('mygame');
            expect(myGame.parent).toBe(currentRoute);
            expect(myGame.children.size).toBe(0);

            const settings = myAccount.children.get('settings')!;
            expect(settings.item.name).toBe('settings');
            expect(settings.parent).toBe(myAccount);
            expect(settings.children.size).toBe(0);
        });

        it('should reconstruct a routing tree when dsl condition changes', () => {
            accountMenuDataServiceMock.content.next({
                name: 'main',
                menuRoute: 'menu',
            });

            router.setRoute('menu');

            expect(currentRoute!.parent).toBeNull();
            expect(currentRoute!.item.name).toBe('main');
            expect(currentRoute!.children.size).toBe(0);
        });

        it('should rebroadcast route when route table is reconstructed', () => {
            router.setRoute('menu');

            accountMenuDataServiceMock.content.next({
                name: 'main',
                menuRoute: 'menu',
            });

            expect(currentRoute!.children.size).toBe(0);
        });

        it('should broadcast default route if current one is not in reconstructed route table', () => {
            router.setRoute('menu/game');

            accountMenuDataServiceMock.content.next({
                name: 'main',
                menuRoute: 'menu',
            });

            expect(currentRoute!.children.size).toBe(0);
        });

        it("should broadcast null if reconstructed route table doesn't not have current or default route", () => {
            router.setRoute('menu/game');

            accountMenuDataServiceMock.content.next({
                name: 'main',
            });

            expect(currentRoute).toBeNull();
        });
    });

    describe('routerMode', () => {
        beforeEach(() => {
            accountMenuDataServiceMock.routerMode = true;

            navigationServiceMock.location.absUrl.and.returnValue('currentUrl');
        });

        describe('navigateToRoute', () => {
            it('should navigate to specified route', () => {
                router.navigateToRoute('menu/route');

                expect(navigationServiceMock.goTo).toHaveBeenCalledWith('/menu/menu/route');
            });

            it('should navigate with browser back if going back', () => {
                router.navigateToRoute('menu/route', true);

                expect(windowMock.history.back).toHaveBeenCalled();
            });

            it('should navigate to parent route if parent route given', () => {
                pageMock.lang = 'sk';
                router.navigateToRoute('menu/route', true, 'menu/menu/personaldetails');

                expect(windowMock.history.back).not.toHaveBeenCalled();
                expect(navigationServiceMock.goTo).toHaveBeenCalledOnceWith('/sk/menu/menu/personaldetails');
            });
        });
    });

    describe('menu invalid root menu route', () => {
        beforeEach(() => {
            accountMenuDataServiceMock.content.next(<any>{
                name: 'main',
                menuRoute: 'menu/xxx',
            });
        });

        it('should log warning if there is a menu route with multiple fragments', () => {
            expect(loggerMock.warn).toHaveBeenCalled();
        });
    });
});
