import { TestBed } from '@angular/core/testing';

import { ContentItem, CookieName } from '@frontend/vanilla/core';
import { ContentMessagesService } from '@frontend/vanilla/features/content-messages';
import { MockContext } from 'moxxi';

import { SharedFeaturesApiServiceMock } from '../../../core/src/http/test/shared-features-api.mock';
import { CookieServiceMock } from '../../../core/test/browser/cookie.mock';
import { ContentMessagesTrackingServiceMock } from './content-messages-tracking.service.mock';
import { ContentMessagesServiceMock } from './content-messages.mock';

describe('ContentMessagesService', () => {
    let service: ContentMessagesService;
    let cookieServiceMock: CookieServiceMock;
    let contentMessagesTrackingServiceMock: ContentMessagesTrackingServiceMock;
    let apiServiceMock: SharedFeaturesApiServiceMock;
    let message: ContentItem;

    beforeEach(() => {
        cookieServiceMock = MockContext.useMock(CookieServiceMock);
        contentMessagesTrackingServiceMock = MockContext.useMock(ContentMessagesTrackingServiceMock);
        apiServiceMock = MockContext.useMock(SharedFeaturesApiServiceMock);
        MockContext.useMock(ContentMessagesServiceMock);

        message = {
            name: 'msg1',
            templateName: 'pctext',
            parameters: {},
        };

        TestBed.configureTestingModule({
            providers: [MockContext.providers, ContentMessagesService],
        });

        service = TestBed.inject(ContentMessagesService);
    });

    it('getClosedMessageNames() should collect names from all cookies', () => {
        cookieServiceMock.getQueryCollection.withArgs(CookieName.ClsdP, 'kkk').and.returnValue(['p-msg1', 'p-msg2']);
        cookieServiceMock.getQueryCollection.withArgs(CookieName.ClsdL, 'kkk').and.returnValue(['l-msg1', 'l-msg2']);
        cookieServiceMock.getQueryCollection.withArgs(CookieName.ClsdS, 'kkk').and.returnValue(['s-msg1', 's-msg2']);

        const names = service.getClosedMessageNames('kkk'); // act

        expect(names.sort()).toEqual(['p-msg1', 'p-msg2', 'l-msg1', 'l-msg2', 's-msg1', 's-msg2'].sort());
    });

    describe('getMessages()', () => {
        it('getMessages should return messages', () => {
            service.getMessages('messages', 'cookie');

            expect(apiServiceMock.get).toHaveBeenCalledWith('contentMessages', {
                path: 'messages',
                closedCookieKey: 'cookie',
                evaluateFullOnServer: undefined,
            });
        });

        it('should not call the API if path is not provided', () => {
            service.getMessages('');

            expect(apiServiceMock.get).not.toHaveBeenCalled();
        });
    });

    describe('markMessageAsClosed()', () => {
        describe('should add message name to cookie', () => {
            afterEach(() => {
                // no more cookies should be written
                expect(cookieServiceMock.putRaw).not.toHaveBeenCalled();
                expect(cookieServiceMock.addToQueryCollection).toHaveBeenCalledTimes(1);
            });

            it('permanent if no flags nor parameters', () => {
                service.markMessageAsClosed(message, 'kkk'); // act
                expectClosedCookie(CookieName.ClsdP, 365);
            });

            it('session if flag as function parameter', () => {
                service.markMessageAsClosed(message, 'kkk', { showOnNextSession: true }); // act
                expectClosedCookie(CookieName.ClsdS, undefined);
            });

            it('session if flag in message parameters', () => {
                message.parameters = { showOnNextSession: 'true' };
                service.markMessageAsClosed(message, 'kkk'); // act
                expectClosedCookie(CookieName.ClsdS, undefined);
            });

            it('login if flag as function parameter', () => {
                service.markMessageAsClosed(message, 'kkk', { showOnNextLogin: true }); // act
                expectClosedCookie(CookieName.ClsdL, 365);
            });

            it('login if flag in message parameters', () => {
                message.parameters = { showOnNextLogin: 'true' };
                service.markMessageAsClosed(message, 'kkk'); // act
                expectClosedCookie(CookieName.ClsdL, 365);
            });

            it('despite writeOriginalCookie is false because additionalCookieName is not specified', () => {
                message.parameters = { writeOriginalCookie: 'false' };
                service.markMessageAsClosed(message, 'kkk'); // act
                expectClosedCookie(CookieName.ClsdP, 365);
            });

            it('should track', () => {
                message.parameters = {
                    'tracking.ClosedEvent': 'ClosedEvt',
                    'tracking.ClosedEvent.page.referringAction': 'Some_Action',
                };
                service.markMessageAsClosed(message, 'kkk');

                expect(contentMessagesTrackingServiceMock.trackMessageClosed).toHaveBeenCalledWith({
                    name: 'msg1',
                    templateName: 'pctext',
                    parameters: {
                        'tracking.ClosedEvent': 'ClosedEvt',
                        'tracking.ClosedEvent.page.referringAction': 'Some_Action',
                    },
                });
            });
        });

        describe('should write additional cookie', () => {
            afterEach(() => {
                expect(cookieServiceMock.addToQueryCollection).toHaveBeenCalledTimes(1); // standard cookie should still be written
                expect(cookieServiceMock.putRaw).toHaveBeenCalledTimes(1);
            });

            it('if specified', () => {
                message.parameters = { additionalCookieName: 'foo' };
                service.markMessageAsClosed(message, 'kkk'); // act
                expectAdditionalCookie('foo', 'true', 365);
            });

            it('with expiry from closed cookie', () => {
                message.parameters = { additionalCookieName: 'foo' };
                service.markMessageAsClosed(message, 'kkk', { showOnNextSession: true }); // act
                expectAdditionalCookie('foo', 'true', undefined);
            });

            it('with explicitly specified value and expiry', () => {
                message.parameters = {
                    additionalCookieName: 'foo',
                    additionalCookieValue: 'foo val',
                    additionalCookieExpireDays: '10',
                };
                service.markMessageAsClosed(message, 'kkk'); // act
                expectAdditionalCookie('foo', 'foo val', 10);
            });
        });

        it('should write only additional cookie, not original one if specified', () => {
            message.parameters = {
                writeOriginalCookie: 'false',
                additionalCookieName: 'foo',
            };

            service.markMessageAsClosed(message, 'kkk'); // act

            expectAdditionalCookie('foo', 'true', 365);
            expect(cookieServiceMock.addToQueryCollection).not.toHaveBeenCalled();
            expect(cookieServiceMock.putRaw).toHaveBeenCalledTimes(1);
        });

        function expectClosedCookie(expectedName: string, expectedExpireDays: number | undefined) {
            expect(cookieServiceMock.addToQueryCollection).toHaveBeenCalledWith(expectedName, 'kkk', message.name, jasmine.anything());
            expectExpires(cookieServiceMock.addToQueryCollection.calls.mostRecent().args[3].expires, expectedExpireDays);
        }

        function expectAdditionalCookie(expectedName: string, expectedValue: string, expectedExpireDays: number | undefined) {
            expect(cookieServiceMock.putRaw).toHaveBeenCalledWith(expectedName, expectedValue, jasmine.anything());
            expect(cookieServiceMock.putRaw).toHaveBeenCalledTimes(1);
            expectExpires(cookieServiceMock.putRaw.calls.mostRecent().args[2].expires, expectedExpireDays);
        }

        function expectExpires(actualDate: Date, expectedDays: number | undefined) {
            if (expectedDays) {
                const expectedDate = new Date();
                expectedDate.setDate(expectedDate.getDate() + expectedDays);
                expect(actualDate.getTime()).toBeCloseTo(expectedDate.getTime(), -2);
            } else {
                expect(actualDate).toBeUndefined();
            }
        }
    });
});
