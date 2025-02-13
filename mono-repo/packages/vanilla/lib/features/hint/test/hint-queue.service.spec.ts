import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { ContentItem, UserLoginEvent, WorkerType } from '@frontend/vanilla/core';
import { HintQueueService } from '@frontend/vanilla/features/hint';
import { MockContext } from 'moxxi';

import { PageMock } from '../../../core/test/browsercommon/page.mock';
import { ContentServiceMock } from '../../../core/test/content/content.mock';
import { LoggerMock } from '../../../core/test/languages/logger.mock';
import { ProductServiceMock } from '../../../core/test/products/product.mock';
import { UserServiceMock } from '../../../core/test/user/user.mock';
import { WebWorkerServiceMock } from '../../../core/test/web-worker/web-worker.service.mock';
import { CookieDBServiceMock, FakeListDB } from './cookie-db.mock';
import { HintOverlayServiceMock } from './hint.mock';

describe('HintQueueService', () => {
    let service: HintQueueService;
    let contentServiceMock: ContentServiceMock;
    let loggerMock: LoggerMock;
    let pageMock: PageMock;
    let userMock: UserServiceMock;
    let hintOverlayServiceMock: HintOverlayServiceMock;
    let productServiceMock: ProductServiceMock;
    let webWorkerServiceMock: WebWorkerServiceMock;
    let cookieDBServiceMock: CookieDBServiceMock;
    let content: ContentItem;

    beforeEach(() => {
        cookieDBServiceMock = MockContext.useMock(CookieDBServiceMock);
        hintOverlayServiceMock = MockContext.useMock(HintOverlayServiceMock);
        contentServiceMock = MockContext.useMock(ContentServiceMock);
        loggerMock = MockContext.useMock(LoggerMock);
        pageMock = MockContext.useMock(PageMock);
        userMock = MockContext.useMock(UserServiceMock);
        productServiceMock = MockContext.useMock(ProductServiceMock);
        webWorkerServiceMock = MockContext.useMock(WebWorkerServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, HintQueueService],
        });

        service = TestBed.inject(HintQueueService);
        content = {
            templateName: 'folder',
            name: 'toasts',
            items: [
                {
                    name: 'hint1',
                    templateName: 'folder',
                    items: [
                        {
                            name: 'hint1',
                            templateName: 'pcimagetext',
                            text: 'txt1',
                            title: 'title1',
                            parameters: {
                                cookieExpireDays: '5',
                                displayCounter: '2',
                                showCloseButton: 'true',
                            },
                        },
                    ],
                },
                {
                    name: 'hint2',
                    templateName: 'folder',
                    items: [
                        {
                            name: 'hint2',
                            templateName: 'pcimagetext',
                            text: 'txt2',
                            title: 'title2',
                            parameters: {
                                cookieExpireDays: '5',
                                displayCounter: '2',
                                showCloseButton: 'true',
                            },
                        },
                    ],
                },
                {
                    name: 'hint3',
                    templateName: 'folder',
                    items: [
                        {
                            name: 'hint3',
                            templateName: 'pcimagetext',
                            text: 'txt3',
                            title: 'title3',
                            parameters: {
                                displayCounter: '2',
                                showCloseButton: 'true',
                            },
                        },
                    ],
                },
                {
                    name: 'hint4',
                    templateName: 'pcimagetext',
                    text: 'txt4',
                    title: 'title4',
                    parameters: {
                        displayCounter: '2',
                        showCloseButton: 'true',
                    },
                },
                {
                    name: 'hint5',
                    templateName: 'pcimagetext',
                    text: 'txt5',
                    title: 'title5',
                    parameters: {
                        cookieExpireDays: '5',
                        displayCounter: '2',
                        showCloseButton: 'true',
                        isProductSpecific: 'true',
                    },
                },
            ],
        };

        spyOn(Date.prototype, 'getTime').and.returnValue(450);
    });

    describe('add()', () => {
        it('should add hint to queue and display it from folder', fakeAsync(() => {
            service.add('hint1');

            expect(webWorkerServiceMock.createWorker).toHaveBeenCalledOnceWith(WorkerType.HintQueueTimeout, { timeout: 0 }, jasmine.any(Function));

            tick();

            verifyHintDisplayed(1, content.items![0]!.items![0]!);
        }));

        it('should add hint to queue and display it from root', fakeAsync(() => {
            service.add('hint4');
            tick();

            verifyHintDisplayed(1, content.items![3]!);
        }));

        it('should show hints one by one', fakeAsync(() => {
            service.add('hint1');
            tick();

            const h1 = verifyHintDisplayed(1, content.items![0]!.items![0]!);

            service.add('hint2');
            tick();
            h1[0].detachments.next();

            verifyHintDisplayed(2, content.items![1]!.items![0]!);
        }));

        it('should log a warning if hint is not found', fakeAsync(() => {
            service.add('xxx');
            tick();

            contentServiceMock.getJsonFiltered.next(content);

            expect(loggerMock.warn).toHaveBeenCalledWith('No content found for hint xxx.');
            expect(hintOverlayServiceMock.show).not.toHaveBeenCalled();
        }));

        it('should not do anything after last hint is hidden', fakeAsync(() => {
            service.add('hint1');
            tick();

            const h1 = verifyHintDisplayed(1, content.items![0]!.items![0]!);

            h1[0].detachments.next();

            expect(hintOverlayServiceMock.show).toHaveBeenCalledTimes(1);
        }));

        it('should not load hints when anonymous access is restricted and user is not authenticated', fakeAsync(() => {
            pageMock.isAnonymousAccessRestricted = true;
            userMock.isAuthenticated = false;

            service.add('hint1');
            tick();

            expect(contentServiceMock.getJsonFiltered).not.toHaveBeenCalled();
            expect(hintOverlayServiceMock.show).not.toHaveBeenCalled();
        }));

        it('should load hints when anonymous access is restricted and user is logged in', fakeAsync(() => {
            pageMock.isAnonymousAccessRestricted = true;
            userMock.isAuthenticated = true;

            service.add('hint1');
            tick();

            verifyHintDisplayed(1, content.items![0]!.items![0]!);
        }));

        it('not load hints when anonymous access is restricted when user logs in', fakeAsync(() => {
            pageMock.isAnonymousAccessRestricted = true;
            userMock.isAuthenticated = false;

            service.add('hint1');
            tick();

            userMock.triggerEvent(new UserLoginEvent());

            verifyHintDisplayed(1, content.items![0]!.items![0]!);
        }));

        describe('product specific', () => {
            let hintCookieList: FakeListDB;
            beforeEach(() => {
                hintCookieList = cookieDBServiceMock.createList();
                hintCookieList.insert({ name: 'hint1', shouldShow: false, expires: 500, displayCounter: 3 });
            });

            it('should show hint and save product property', fakeAsync(() => {
                service.add('hint5');
                tick();

                const h1 = verifyHintDisplayed(1, content.items![4]!);

                h1[0].detachments.next();
                expect(hintCookieList.getAll()).toEqual([
                    { name: 'hint1', shouldShow: false, expires: 500, displayCounter: 3 },
                    { name: 'hint5', shouldShow: false, expires: 450, displayCounter: 1, product: 'host' },
                ]);
            }));

            it('should update hint by name and product', fakeAsync(() => {
                hintCookieList.insert({ name: 'hint5', shouldShow: false, expires: 450, displayCounter: 1, product: 'host' });

                service.add('hint5');
                tick();

                expect(hintCookieList.getAll()).toEqual([
                    { name: 'hint1', shouldShow: false, expires: 500, displayCounter: 3 },
                    { name: 'hint5', shouldShow: true, expires: 450, displayCounter: 1, product: 'host' },
                ]);
            }));

            it('should insert hint by name and ignore hint with same name but with different product', fakeAsync(() => {
                hintCookieList.insert({ name: 'hint5', shouldShow: false, expires: 450, displayCounter: 1, product: 'host' });
                productServiceMock.current.name = 'casino';
                service.add('hint5');
                tick();

                expect(hintCookieList.getAll()).toEqual([
                    { name: 'hint1', shouldShow: false, expires: 500, displayCounter: 3 },
                    { name: 'hint5', shouldShow: false, expires: 450, displayCounter: 1, product: 'host' },
                    { name: 'hint5', shouldShow: true },
                ]);

                const h1 = verifyHintDisplayed(1, content.items![4]!);

                h1[0].detachments.next();

                expect(hintCookieList.getAll()).toEqual([
                    { name: 'hint1', shouldShow: false, expires: 500, displayCounter: 3 },
                    { name: 'hint5', shouldShow: false, expires: 450, displayCounter: 1, product: 'host' },
                    { name: 'hint5', shouldShow: false, expires: 450, displayCounter: 1, product: 'casino' },
                ]);
            }));

            it('should update hint by name and ignore hint with same name but with different product', fakeAsync(() => {
                hintCookieList.insert({ name: 'hint5', shouldShow: false, expires: 450, displayCounter: 1, product: 'host' });
                hintCookieList.insert({ name: 'hint5', shouldShow: false, displayCounter: 1 });
                productServiceMock.current.name = 'casino';
                service.add('hint5');
                tick();

                expect(hintCookieList.getAll()).toEqual([
                    { name: 'hint1', shouldShow: false, expires: 500, displayCounter: 3 },
                    { name: 'hint5', shouldShow: false, expires: 450, displayCounter: 1, product: 'host' },
                    { name: 'hint5', shouldShow: true, displayCounter: 1 },
                ]);
            }));
        });

        describe('dismissed items', () => {
            let hintCookieList: FakeListDB;
            beforeEach(() => {
                hintCookieList = cookieDBServiceMock.createList();
                hintCookieList.insert({ name: 'hint1', shouldShow: true, expires: 500, displayCounter: 2 });
                hintCookieList.insert({ name: 'hint2', shouldShow: true, expires: 400 });
                hintCookieList.insert({ name: 'hint3', shouldShow: true });
                hintCookieList.insert({ name: 'hint5', shouldShow: false, expires: 500, displayCounter: 2, product: 'host' });
            });

            it('should remove items which are already expired from the queue', () => {
                service.add('hint4');
                expect(hintCookieList.getAll()).toEqual([
                    { name: 'hint1', shouldShow: true, expires: 500, displayCounter: 2 },
                    { name: 'hint3', shouldShow: true },
                    { name: 'hint5', shouldShow: false, expires: 500, displayCounter: 2, product: 'host' },
                    { name: 'hint4', shouldShow: true },
                ]);
            });

            it('should not show the hint when hint display counter is bigger than the number of dismissals', fakeAsync(() => {
                service.add('hint4');
                tick();
                contentServiceMock.getJsonFiltered.next(content);
                expect(hintCookieList.getAll()).toEqual([
                    { name: 'hint1', shouldShow: false, expires: 500, displayCounter: 2 },
                    { name: 'hint3', shouldShow: true },
                    { name: 'hint5', shouldShow: false, expires: 500, displayCounter: 2, product: 'host' },
                    { name: 'hint4', shouldShow: true },
                ]);
            }));

            it('should save display counter and expires properties for hint when hint is closed', fakeAsync(() => {
                service.add('hint4');
                tick();
                const h3 = verifyHintDisplayed(1, content.items![2]!.items![0]!);
                h3[0].detachments.next();
                expect(hintCookieList.getAll()).toEqual([
                    { name: 'hint1', shouldShow: false, expires: 500, displayCounter: 2 },
                    { name: 'hint3', shouldShow: false, displayCounter: 1 },
                    { name: 'hint5', shouldShow: false, expires: 500, displayCounter: 2, product: 'host' },
                    { name: 'hint4', shouldShow: true },
                ]);
            }));
        });
    });

    describe('remove()', () => {
        it('should remove specified item from the queue', fakeAsync(() => {
            service.add('hint1');
            service.add('hint2');
            service.add('hint3');
            tick();

            const h1 = verifyHintDisplayed(1, content.items![0]!.items![0]!);

            service.remove('hint2');

            h1[0].detachments.next();

            verifyHintDisplayed(2, {
                name: 'hint3',
                templateName: 'pcimagetext',
                text: 'txt3',
                title: 'title3',
                parameters: {
                    displayCounter: '2',
                    showCloseButton: 'true',
                },
            });
        }));
    });

    describe('clear()', () => {
        it('should remove all items from the queue', fakeAsync(() => {
            service.add('hint1');
            service.add('hint2');
            service.add('hint3');
            tick();

            const h1 = verifyHintDisplayed(1, content.items![0]!.items![0]!);

            service.clear();

            h1[0].detachments.next();

            expect(hintOverlayServiceMock.show).toHaveBeenCalledTimes(1);
        }));
    });

    function verifyHintDisplayed(no: number, item: ContentItem) {
        if (no === 1) {
            expect(contentServiceMock.getJsonFiltered).toHaveBeenCalledWith('App-v1.0/Hints');

            contentServiceMock.getJsonFiltered.next(content);
            contentServiceMock.getJsonFiltered.calls.reset();
        } else {
            expect(contentServiceMock.getJsonFiltered).not.toHaveBeenCalled();
        }

        expect(hintOverlayServiceMock.show).toHaveBeenCalledWith(item);
        expect(hintOverlayServiceMock.show).toHaveBeenCalledTimes(no);
        expect(webWorkerServiceMock.removeWorker).toHaveBeenCalledWith(WorkerType.HintQueueTimeout);

        return hintOverlayServiceMock.show.calls.mostRecent().returnValue;
    }
});
