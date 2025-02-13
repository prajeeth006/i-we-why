import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { ToastrQueueOptions, ToastrSchedule } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { CookieServiceMock } from '../../../core/test/browser/cookie.mock';
import { DateTimeServiceMock } from '../../../core/test/browser/datetime.service.mock';
import { DslServiceMock } from '../../../core/test/dsl/dsl.mock';
import { ToastrQueueServiceMock } from '../../../core/test/toastr/toastr-queue.mock';
import { UserServiceMock } from '../../../core/test/user/user.mock';
import { DepositPromptService } from '../src/deposit-prompt.service';
import { DepositPromptConfigMock } from './deposit-prompt-config.mock';

describe('DepositPromptService', () => {
    let service: DepositPromptService;
    let depositPromptConfigMock: DepositPromptConfigMock;
    let toastrQueueServiceMock: ToastrQueueServiceMock;
    let dslServiceMock: DslServiceMock;
    let userMock: UserServiceMock;
    let cookieServiceMock: CookieServiceMock;
    let dateTimeServiceMock: DateTimeServiceMock;

    beforeEach(() => {
        depositPromptConfigMock = MockContext.useMock(DepositPromptConfigMock);
        toastrQueueServiceMock = MockContext.useMock(ToastrQueueServiceMock);
        dslServiceMock = MockContext.useMock(DslServiceMock);
        userMock = MockContext.useMock(UserServiceMock);
        cookieServiceMock = MockContext.useMock(CookieServiceMock);
        dateTimeServiceMock = MockContext.useMock(DateTimeServiceMock);
        dateTimeServiceMock.now.and.callFake(() => new Date(2019, 2, 3, 4, 5, 6, 7));

        TestBed.configureTestingModule({
            providers: [MockContext.providers, DepositPromptService],
        });

        service = TestBed.inject(DepositPromptService);

        depositPromptConfigMock.condition = 'tc';
        depositPromptConfigMock.repeatTime = 10000;
    });

    describe('atStartup()', () => {
        it('should start watcher if user is authenticated and trigger is always and show toast every time condition is true', () => {
            depositPromptConfigMock.trigger = 'Always';
            userMock.isAuthenticated = true;

            service.atStartup();

            expect(dslServiceMock.evaluateExpression).toHaveBeenCalledWith('tc');
            verifyWatcher();
            verifyWatcher();
        });

        it('should not start watcher if user is not authenticated', () => {
            depositPromptConfigMock.trigger = 'Always';
            userMock.isAuthenticated = false;

            service.atStartup();

            expect(dslServiceMock.evaluateExpression).not.toHaveBeenCalled();
        });

        it('should not start watcher trigger is not always', () => {
            userMock.isAuthenticated = true;

            depositPromptConfigMock.trigger = 'Off';
            service.atStartup();
            depositPromptConfigMock.trigger = 'Login';
            service.atStartup();

            expect(dslServiceMock.evaluateExpression).not.toHaveBeenCalled();
        });
    });

    describe('postLogin()', () => {
        it('should remove timeout cookie', fakeAsync(() => {
            service.postLogin({});

            expect(cookieServiceMock.remove).toHaveBeenCalledWith('dpto');
        }));

        describe('when trigger is Off', () => {
            beforeEach(() => {
                depositPromptConfigMock.trigger = 'Off';
            });

            it('should do nothing', fakeAsync(() => {
                service.postLogin({});
                tick();

                expect(dslServiceMock.evaluateExpression).not.toHaveBeenCalled();
                expect(toastrQueueServiceMock.add).not.toHaveBeenCalled();
            }));

            returnsPromiseTest();
        });

        describe('when trigger is Always', () => {
            beforeEach(() => {
                depositPromptConfigMock.trigger = 'Always';
            });

            it('should start watcher after 5s if login will not redirect', fakeAsync(() => {
                service.postLogin({ willRedirect: false });
                dslServiceMock.evaluateExpression.completeWith(false);
                tick(5000);

                expect(dslServiceMock.evaluateExpression).toHaveBeenCalledWith('tc');
                verifyWatcher();
                verifyWatcher();
            }));

            testLoginTrigger(true, ToastrSchedule.AfterNextNavigation);
            testLoginTrigger(false, ToastrSchedule.Immediate);
            returnsPromiseTest(() => dslServiceMock.evaluateExpression.next(true));
            returnsPromiseTest(() => dslServiceMock.evaluateExpression.next(false));
        });

        describe('when trigger is Login', () => {
            beforeEach(() => {
                depositPromptConfigMock.trigger = 'Login';
            });

            testLoginTrigger(true, ToastrSchedule.AfterNextNavigation);
            testLoginTrigger(false, ToastrSchedule.Immediate);

            it('should check condition once and not show toast if its false', fakeAsync(() => {
                service.postLogin({});
                tick();

                expect(dslServiceMock.evaluateExpression).toHaveBeenCalledWith('tc');
                dslServiceMock.evaluateExpression.next(false);

                expect(toastrQueueServiceMock.add).not.toHaveBeenCalled();
                expect(cookieServiceMock.put).not.toHaveBeenCalled();
            }));
        });

        function testLoginTrigger(willRedirect: boolean, expectedSchedule: string) {
            it(`should check condition once and show toast if its true with ${expectedSchedule} if willRedirect is ${willRedirect}`, () => {
                service.postLogin({ willRedirect });

                expect(dslServiceMock.evaluateExpression).toHaveBeenCalledWith('tc');
                dslServiceMock.evaluateExpression.next(true);

                verifyToast({ schedule: <any>expectedSchedule, placeholders: { trigger: 'After Login' } });

                dslServiceMock.evaluateExpression.next(true);
                expect(toastrQueueServiceMock.add).not.toHaveBeenCalled();
                expect(cookieServiceMock.put).not.toHaveBeenCalled();
            });
        }

        function returnsPromiseTest(processFn?: () => void) {
            it('should return a promise', fakeAsync(() => {
                const spy = jasmine.createSpy();

                service.postLogin({}).then(spy);
                processFn && processFn();
                tick(5000);

                expect(spy).toHaveBeenCalled();
            }));
        }
    });

    function verifyWatcher() {
        dslServiceMock.evaluateExpression.next(false);
        dslServiceMock.evaluateExpression.next(false);
        dslServiceMock.evaluateExpression.next(true);

        verifyToast({ placeholders: { trigger: 'Periodic' } });
    }

    function verifyToast(options?: Partial<ToastrQueueOptions>) {
        expect(toastrQueueServiceMock.add).toHaveBeenCalledWith('depositprompt', options);
        expect(toastrQueueServiceMock.add).toHaveBeenCalledTimes(1);
        expect(cookieServiceMock.put).toHaveBeenCalledWith('dpto', '1', { expires: new Date(2019, 2, 3, 4, 5, 16, 7) });
        toastrQueueServiceMock.add.calls.reset();
        cookieServiceMock.put.calls.reset();
    }
});
