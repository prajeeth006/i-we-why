import { TestBed } from '@angular/core/testing';

import { DslRecorderService, UserUpdateEvent } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { UserDslValuesProvider } from '../../../src/dsl/value-providers/user-dsl-values-provider';
import { TrackerIdServiceMock } from '../../../src/tracker-id/tracker-id.mock';
import { CookieServiceMock } from '../../browser/cookie.mock';
import { DateTimeServiceMock } from '../../browser/datetime.service.mock';
import { PageMock } from '../../browsercommon/page.mock';
import { UserServiceMock } from '../../user/user.mock';
import { DslCacheServiceMock } from '../dsl-cache.mock';
import { SegmentationGroupResolverMock } from '../segmentation-group-resolver.mock';
import { DslUserGroupAttributeResolverServiceMock } from './dsl-user-group-attribute-resolver.mock';
import { DslUserGroupResolverServiceMock } from './dsl-user-group-resolver.mock';

describe('UserDslValuesProvider', () => {
    let provider: UserDslValuesProvider;
    let dslUserGroupResolverServiceMock: DslUserGroupResolverServiceMock;
    let dslCacheServiceMock: DslCacheServiceMock;
    let userMock: UserServiceMock;
    let cookieServiceMock: CookieServiceMock;
    let trackerIdServiceMock: TrackerIdServiceMock;
    let dateTimeServiceMock: DateTimeServiceMock;
    let dslUserGroupAttributeResolverServiceMock: DslUserGroupAttributeResolverServiceMock;
    let segmentationGroupResolverMock: SegmentationGroupResolverMock;
    let pageMock: PageMock;

    beforeEach(() => {
        dslUserGroupResolverServiceMock = MockContext.useMock(DslUserGroupResolverServiceMock);
        dslCacheServiceMock = MockContext.useMock(DslCacheServiceMock);
        userMock = MockContext.useMock(UserServiceMock);
        cookieServiceMock = MockContext.useMock(CookieServiceMock);
        trackerIdServiceMock = MockContext.useMock(TrackerIdServiceMock);
        dateTimeServiceMock = MockContext.useMock(DateTimeServiceMock);
        dslUserGroupAttributeResolverServiceMock = MockContext.useMock(DslUserGroupAttributeResolverServiceMock);
        segmentationGroupResolverMock = MockContext.useMock(SegmentationGroupResolverMock);
        pageMock = MockContext.useMock(PageMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, DslRecorderService, UserDslValuesProvider],
        });

        provider = TestBed.inject(UserDslValuesProvider);
        TestBed.inject(DslRecorderService).beginRecording();
    });

    describe('User', () => {
        describe('RegistrationDate', () => {
            it('should return registration date', () => {
                const date = new Date('1984-10-11 13:50:48');
                userMock.registrationDate = date;

                const result = provider.getProviders()['User']!['RegistrationDate'];

                expect(result).toEqual(date);
            });
        });

        describe('Country', () => {
            it('should return country', () => {
                userMock.country = 'AT';

                const result = provider.getProviders()['User']!['Country'];

                expect(result).toBe('AT');
            });
        });

        describe('FirstLogin', () => {
            it('should return true if this is users first login', () => {
                userMock.isFirstLogin = true;

                const result = provider.getProviders()['User']!['FirstLogin'];

                expect(result).toBeTrue();
            });
        });

        describe('HasTracker', () => {
            it('should return true if trackerId cookie exists', () => {
                cookieServiceMock.get.withArgs('trackerId').and.returnValue('test');

                const result = provider.getProviders()['User']!['HasTracker'];

                expect(result).toBeTrue();
            });

            it("should return false if trackerId cookie doesn't exist", () => {
                const result = provider.getProviders()['User']!['HasTracker'];

                expect(result).toBeFalse();
            });
        });

        describe('TrackerId', () => {
            it('should get value from service', () => {
                trackerIdServiceMock.get.and.returnValue('123');

                const result = provider.getProviders()['User']!['TrackerId'];

                expect(result).toBe('123');
            });
        });

        describe('IsInGroup', () => {
            it('should return result of user group resolver', () => {
                dslUserGroupResolverServiceMock.resolve.withArgs({ group: 'testGroup' }).and.returnValue({ passed: true });

                const result = provider.getProviders()['User']!['IsInGroup']('testGroup');

                expect(result).toBeTrue();
            });

            it('should return result of user group resovler with new implementation', () => {
                pageMock.featureFlags = { segmentationGroups: true };
                segmentationGroupResolverMock.isInGroup.withArgs('testGroup').and.returnValue(true);

                const result = provider.getProviders()['User']!['IsInGroup']('testGroup');

                expect(result).toBeTrue();
            });
        });

        describe('GetGroupAttribute', () => {
            it('should return result of user group resolver', () => {
                dslUserGroupAttributeResolverServiceMock.resolve
                    .withArgs({ groupName: 'testGroup', groupAttribute: 'att' })
                    .and.returnValue({ value: 'value' });

                const result = provider.getProviders()['User']!['GetGroupAttribute']('testGroup', 'att');

                expect(result).toBe('value');
            });
        });

        describe('IsKnown', () => {
            it('should return true if lastVisitor cookie exists', () => {
                cookieServiceMock.get.withArgs('lastVisitor').and.returnValue('test');

                const result = provider.getProviders()['User']!['IsKnown'];

                expect(result).toBeTrue();
            });

            it("should return false if lastVisitor cookie doesn't exist", () => {
                const result = provider.getProviders()['User']!['IsKnown'];

                expect(result).toBeFalse();
            });
        });

        describe('IsRealPlayer', () => {
            it('should return true if user is a real money player', () => {
                userMock.realPlayer = true;

                const result = provider.getProviders()['User']!['IsRealPlayer'];

                expect(result).toBeTrue();
            });
        });

        describe('Language', () => {
            it('should return language', () => {
                userMock.lang = 'en';

                const result = provider.getProviders()['User']!['Language'];

                expect(result).toBe('EN');
            });
        });

        describe('LoggedIn', () => {
            it('should return true if user is authenticated', () => {
                const result = provider.getProviders()['User']!['LoggedIn'];

                expect(result).toBeTrue();
            });

            it('should return false if is not authenticated', () => {
                userMock.isAuthenticated = false;

                const result = provider.getProviders()['User']!['LoggedIn'];

                expect(result).toBeFalse();
            });
        });

        describe('LoginName', () => {
            it('should return username', () => {
                userMock.username = 'bla';

                const result = provider.getProviders()['User']!['LoginName'];

                expect(result).toBe('bla');
            });
        });

        describe('LoyaltyStatus', () => {
            it('should return loyalty', () => {
                userMock.loyalty = 'B';

                const result = provider.getProviders()['User']!['LoyaltyStatus'];

                expect(result).toBe('B');
            });
        });

        describe('LoyaltyPoints', () => {
            it('should return loyalty points', () => {
                userMock.loyaltyPoints = 100;

                const result = provider.getProviders()['User']!['LoyaltyPoints'];

                expect(result).toBe(100);
            });

            it('should return -1 for unauthenticated users', () => {
                userMock.loyaltyPoints = 100;
                userMock.isAuthenticated = false;

                const result = provider.getProviders()['User']!['LoyaltyPoints'];

                expect(result).toBe(-1);
            });
        });

        describe('TierCode', () => {
            it('should return tier code', () => {
                userMock.tierCode = 2;

                const result = provider.getProviders()['User']!['TierCode'];

                expect(result).toBe(2);
            });

            it('should return -1 for unauthenticated users', () => {
                userMock.tierCode = 2;
                userMock.isAuthenticated = false;

                const result = provider.getProviders()['User']!['TierCode'];

                expect(result).toBe(-1);
            });
        });

        describe('AffiliateInfo', () => {
            it('should return affiliateInfo if webmasterId property exists in postLoginValues cookie', () => {
                cookieServiceMock.getObject.withArgs('mobileLogin.PostLoginValues').and.returnValue({ webmasterId: 100000 });

                const result = provider.getProviders()['User']!['AffiliateInfo'];

                expect(result).toBe(100000);
            });

            it("should return empty string if postLoginValues cookie doesn't exist", () => {
                const result = provider.getProviders()['User']!['AffiliateInfo'];

                expect(result).toBe('');
            });
        });

        describe('LastLoginTimeFormatted', () => {
            it('should return LastLoginTimeFormatted', () => {
                userMock.lastLoginTimeFormatted = '11/6/2014 10:46 AM';

                const result = provider.getProviders()['User']!['LastLoginTimeFormatted'];

                expect(result).toBe('11/6/2014 10:46 AM');
            });
        });

        describe('DaysRegistered', () => {
            it('should return daysRegistered', () => {
                userMock.daysRegistered = 13;

                const result = provider.getProviders()['User']!['DaysRegistered'];

                expect(result).toBe(13);
            });

            it('should return -1 for unauthenticated users', () => {
                userMock.isAuthenticated = false;

                const result = provider.getProviders()['User']!['DaysRegistered'];

                expect(result).toBe(-1);
            });
        });

        describe('Age', () => {
            it('should return user age', () => {
                dateTimeServiceMock.now.and.callFake(() => new Date('2020-08-07'));
                userMock.dateOfBirth = new Date('1985-10-11 13:50:48');

                const result = provider.getProviders()['User']!['Age'];

                expect(result).toEqual(34);
            });

            it('should return -1 for unauthenticated users', () => {
                userMock.isAuthenticated = false;

                const result = provider.getProviders()['User']!['Age'];

                expect(result).toBe(-1);
            });

            it('should return -1 when dateOfBirth claim is empty', () => {
                userMock.dateOfBirth = null;

                const result = provider.getProviders()['User']!['Age'];

                expect(result).toBe(-1);
            });
        });
    });

    describe('watcher', () => {
        it('should invalidate cache for user values that changed', () => {
            userMock.triggerEvent(new UserUpdateEvent(new Map([['username', 'test2']])));

            expect(dslCacheServiceMock.invalidate).toHaveBeenCalledWith(['user.username']);
        });
    });
});
