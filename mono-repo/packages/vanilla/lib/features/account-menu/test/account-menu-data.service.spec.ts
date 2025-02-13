import { TestBed } from '@angular/core/testing';

import { AccountMenuDataService } from '@frontend/vanilla/shared/account-menu';
import { MockContext } from 'moxxi';
import { BehaviorSubject } from 'rxjs';

import { CookieServiceMock } from '../../../core/test/browser/cookie.mock';
import { DeviceServiceMock } from '../../../core/test/browser/device.mock';
import { MediaQueryServiceMock } from '../../../core/test/browser/media-query.service.mock';
import { ClientConfigServiceMock } from '../../../core/test/client-config/client-config.mock';
import { DslServiceMock } from '../../../core/test/dsl/dsl.mock';
import { LoggerMock } from '../../../core/test/languages/logger.mock';
import { UserServiceMock } from '../../../core/test/user/user.mock';
import { AccountMenuConfigMock } from './menu-content.mock';

describe('AccountMenuDataService', () => {
    let service: AccountMenuDataService;
    let menuContentMock: AccountMenuConfigMock;
    const contentEvents: BehaviorSubject<any> = new BehaviorSubject([]);
    let dslServiceMock: DslServiceMock;
    let cookieServiceMock: CookieServiceMock;
    let deviceServiceMock: DeviceServiceMock;
    let mediaQueryServiceMock: MediaQueryServiceMock;
    let loggerMock: LoggerMock;

    beforeEach(() => {
        menuContentMock = MockContext.useMock(AccountMenuConfigMock);
        dslServiceMock = MockContext.useMock(DslServiceMock);
        cookieServiceMock = MockContext.useMock(CookieServiceMock);
        deviceServiceMock = MockContext.useMock(DeviceServiceMock);
        mediaQueryServiceMock = MockContext.useMock(MediaQueryServiceMock);
        loggerMock = MockContext.useMock(LoggerMock);
        MockContext.useMock(UserServiceMock);
        MockContext.useMock(ClientConfigServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, AccountMenuDataService],
        });

        menuContentMock.account.root = <any>{
            name: 'main',
            menuRoute: 'menu',
            resources: { r: '2' },
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
        };
        menuContentMock.account.version = 1;
        menuContentMock.resources = { messages: { r: '1' } };
        menuContentMock.vipLevels = [
            <any>{
                name: 'lvl1',
            },
        ];

        deviceServiceMock.isMobilePhone = false;
        dslServiceMock.evaluateContent.and.returnValue(contentEvents);
        contentEvents.next(menuContentMock.account.root);
    });

    describe('common', () => {
        beforeEach(() => {
            service = TestBed.inject(AccountMenuDataService);
        });

        it('should expose resources', () => {
            expect(service.resources).toEqual(menuContentMock.resources);
        });

        it('should expose root item resources for v2', () => {
            menuContentMock.account.version = 2;
            expect(service.resources).toEqual({ messages: menuContentMock.account.root.resources });
        });

        it('should expose vipLevels', () => {
            expect(service.vipLevels).toEqual(menuContentMock.vipLevels);
        });

        it('should not log warning if there are no items with the same name', () => {
            expect(loggerMock.warn).not.toHaveBeenCalled();
        });

        it('should expose evaluated content', () => {
            service.init();
            const spy = jasmine.createSpy();
            service.content.subscribe(spy);

            expect(spy).toHaveBeenCalledWith(menuContentMock.account.root);

            const newContent = { a: 1 };
            contentEvents.next(newContent);

            expect(spy).toHaveBeenCalledWith(newContent);
        });

        describe('routerMode', () => {
            beforeEach(() => {
                deviceServiceMock.isMobilePhone = true;
            });

            it('should be true if on mobile device', () => {
                expect(service.routerMode).toBeTrue();
            });

            it('should be false if not on mobile device', () => {
                deviceServiceMock.isMobilePhone = false;

                expect(service.routerMode).toBeFalse();
            });

            describe('routerModeReturnUrl', () => {
                it('should return url from cookie', () => {
                    cookieServiceMock.get.withArgs('vn.MenuReturnUrl').and.returnValue('returnUrl');

                    expect(service.routerModeReturnUrl).toBe('returnUrl');
                });
            });
        });

        describe('hierarchy', () => {
            it('should return menu hierarchy', () => {
                service.init();
                expect(service.hierarchy).toEqual({
                    main: {
                        myaccount: {
                            settings: null,
                        },
                        mygame: null,
                    },
                });
            });
        });

        describe('v2', () => {
            it('should return if menu uses v2', () => {
                menuContentMock.account.version = 2;

                expect(service.version).toBe(2);
            });
        });

        describe('isDesktop', () => {
            it('should return true if gt-sm', () => {
                mediaQueryServiceMock.isActive.withArgs('gt-sm').and.returnValue(true);

                expect(service.isDesktop).toBeTrue();
            });
        });

        describe('routerModeReturnUrl', () => {
            it('should return value from cookie', () => {
                cookieServiceMock.get.withArgs('vn.MenuReturnUrl').and.returnValue('returnUrl');

                expect(service.routerModeReturnUrl).toBe('returnUrl');
            });
        });

        describe('setReturnUrlCookie()', () => {
            it('should store return url in a cookie', () => {
                service.setReturnUrlCookie('returnUrl');

                expect(cookieServiceMock.put).toHaveBeenCalledWith('vn.MenuReturnUrl', 'returnUrl');
            });
        });

        describe('removeReturnUrlCookie()', () => {
            it('should remove stored cookie', () => {
                service.removeReturnUrlCookie();

                expect(cookieServiceMock.remove).toHaveBeenCalledWith('vn.MenuReturnUrl');
            });
        });

        describe('getItem()', () => {
            it('should return item by name', () => {
                service.init();
                const item = service.getItem('myaccount');

                expect(item).toBe(menuContentMock.account.root.children[0]!);
            });

            it('should return null if item does not exist', () => {
                const item = service.getItem('xxx');

                expect(item).toBeNull();
            });
        });
    });

    describe('menu with duplicate items', () => {
        beforeEach(() => {
            menuContentMock.account.root = <any>{
                name: 'main',
                menuRoute: 'menu',
                children: [
                    {
                        name: 'myaccount',
                    },
                    {
                        name: 'myaccount',
                    },
                ],
            };

            contentEvents.next(menuContentMock.account.root);
            service = TestBed.inject(AccountMenuDataService);
            service.init();
        });

        it('should log warning if there are multiple items with the same name', () => {
            expect(loggerMock.warn).toHaveBeenCalled();
        });
    });
});
