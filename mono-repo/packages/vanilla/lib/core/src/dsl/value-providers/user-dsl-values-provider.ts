import { Injectable } from '@angular/core';

import { filter } from 'rxjs/operators';

import { CookieName } from '../../browser/cookie/cookie.models';
import { CookieService } from '../../browser/cookie/cookie.service';
import { DateTimeService } from '../../browser/datetime.service';
import { Page } from '../../client-config/page.client-config';
import { TrackerIdService } from '../../tracker-id/tracker-id.service';
import { UserEvent, UserUpdateEvent } from '../../user/user-events';
import { UserService } from '../../user/user.service';
import { DslCacheService } from '../dsl-cache.service';
import { DslRecorderService } from '../dsl-recorder.service';
import { DslUserGroupAttributeResolverService } from '../dsl-user-group-attribute-resolver.service';
import { DslUserGroupResolverService } from '../dsl-user-group-resolver.service';
import { DslRecordable, DslValuesProvider } from '../dsl.models';
import { SegmentationGroupResolver } from '../segmentation-group-resolver';

@Injectable()
export class UserDslValuesProvider implements DslValuesProvider {
    constructor(
        dslCacheService: DslCacheService,
        private readonly dslRecorderService: DslRecorderService,
        private readonly user: UserService,
        private readonly cookieService: CookieService,
        private readonly dslUserGroupResolverService: DslUserGroupResolverService,
        private readonly trackerIdService: TrackerIdService,
        private readonly dateTimeService: DateTimeService,
        private readonly page: Page,
        private readonly dslUserGroupAttributeResolverService: DslUserGroupAttributeResolverService,
        private readonly segmentationGroupResolver: SegmentationGroupResolver,
    ) {
        user.events.pipe(filter((e: UserEvent): e is UserUpdateEvent => e instanceof UserUpdateEvent)).subscribe((e) => {
            const refs: string[] = [];

            e.diff.forEach((_, prop: string) => refs.push(`user.${prop}`));

            dslCacheService.invalidate(refs);
        });
    }

    getProviders(): { [provider: string]: DslRecordable } {
        return {
            User: this.dslRecorderService
                .createRecordable('user')
                .createSimpleProperty(this.user, 'registrationDate', 'RegistrationDate')
                .createSimpleProperty(this.user, 'country', 'Country')
                .createSimpleProperty(this.user, 'isFirstLogin', 'FirstLogin')
                .createSimpleProperty(this.user, 'visitCount', 'VisitCount')
                .createSimpleProperty(this.user, 'visitAfterDays', 'VisitAfterDays')
                .createProperty({ name: 'HasTracker', get: () => !!this.cookieService.get(CookieName.TrackerId), deps: 'cookie.Get.trackerId' })
                .createProperty({ name: 'TrackerId', get: () => this.trackerIdService.get(), deps: ['cookie.Get.trackerId', 'location'] })
                .createFunction({
                    name: 'IsInGroup',
                    get: (group: string) => this.resolveSegmentationGroup(group),
                    deps: (group: string) => [`user.IsInGroup.${group}.${this.user.username}`, 'user.username', 'user.segmentationGroups'],
                })
                .createFunction({
                    name: 'GetGroupAttribute',
                    get: (groupName: string, groupAttribute: string) =>
                        !this.user.isAuthenticated || !groupName || !groupAttribute
                            ? ''
                            : this.dslUserGroupAttributeResolverService.resolve({ groupName: groupName, groupAttribute: groupAttribute })?.value,
                    deps: (groupName: string, attributeName: string) => [
                        `user.GetGroupAttribute.${groupName}.${attributeName}.${this.user.username}`,
                        'user.username',
                    ],
                })
                .createProperty({ name: 'IsKnown', get: () => !!this.cookieService.get(CookieName.LastVisitor), deps: 'cookie.Get.lastVisitor' })
                .createSimpleProperty(this.user, 'realPlayer', 'IsRealPlayer')
                .createProperty({ name: 'Language', get: () => this.user.lang.toUpperCase(), deps: 'user.lang' })
                .createSimpleProperty(this.user, 'isAuthenticated', 'LoggedIn')
                .createSimpleProperty(this.user, 'username', 'LoginName')
                .createSimpleProperty(this.user, 'isAnonymous', 'IsAnonymous')
                .createSimpleProperty(this.user, 'loyalty', 'LoyaltyStatus')
                .createProperty({
                    name: 'LoyaltyPoints',
                    get: () => (this.user.isAuthenticated ? this.user.loyaltyPoints : -1),
                    deps: ['user.loyaltyPoints', 'user.isAuthenticated'],
                })
                .createProperty({
                    name: 'TierCode',
                    get: () => (this.user.isAuthenticated ? this.user.tierCode : -1),
                    deps: ['user.tierCode', 'user.isAuthenticated'],
                })
                .createProperty({
                    name: 'AffiliateInfo',
                    get: () => {
                        const cookieValue = this.cookieService.getObject(CookieName.MobileLoginPostLoginValues);

                        if (!cookieValue) return '';

                        return cookieValue['webmasterId'] || '';
                    },
                    deps: ['cookie.Get.mobileLogin.PostLoginValues', 'user.isAuthenticated'],
                })
                .createSimpleProperty(this.user, 'lastLoginTimeFormatted', 'LastLoginTimeFormatted')
                .createProperty({
                    name: 'DaysRegistered',
                    get: () => (this.user.isAuthenticated || this.user.workflowType !== 0 ? this.user.daysRegistered : -1),
                    deps: ['user.daysRegistered', 'user.workflowType', 'user.isAuthenticated'],
                })
                .createProperty({
                    name: 'Age',
                    get: () => {
                        if (!this.user.isAuthenticated || !this.user.dateOfBirth) {
                            return -1;
                        }

                        const today = this.dateTimeService.now();
                        const month = today.getUTCMonth() - this.user.dateOfBirth.getUTCMonth();
                        let years = today.getUTCFullYear() - this.user.dateOfBirth.getUTCFullYear();

                        if (month < 0 || (month === 0 && today.getUTCDate() < this.user.dateOfBirth.getUTCDate())) {
                            years--;
                        }

                        return years;
                    },
                    deps: ['user.dateOfBirth', 'user.isAuthenticated'],
                }),
        };
    }

    private resolveSegmentationGroup(group: string) {
        if (this.page.featureFlags?.['segmentationGroups']) {
            return this.segmentationGroupResolver.isInGroup(group);
        }

        return this.dslUserGroupResolverService.resolve({ group })?.passed;
    }
}
