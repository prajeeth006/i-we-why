import { Injectable, inject } from '@angular/core';

import { first } from 'rxjs';

import { SharedFeaturesApiService } from '../http/shared-features-api.service';
import { UserService } from '../user/user.service';
import { DslCacheService } from './dsl-cache.service';
import { DSL_NOT_READY } from './dsl-recorder.service';

@Injectable({
    providedIn: 'root',
})
export class SegmentationGroupResolver {
    private readonly sharedFeaturesApiService = inject(SharedFeaturesApiService);
    private readonly user = inject(UserService);
    private readonly dslCacheService = inject(DslCacheService);

    private loaded: boolean = false;
    private segmentationGroup: string[];

    isInGroup(group: string) {
        if (!this.user.isAuthenticated) {
            return false;
        }

        if (!this.loaded) {
            this.loaded = true;
            this.load();
        }

        return this.segmentationGroup ? this.segmentationGroup.includes(group) : DSL_NOT_READY;
    }

    private load() {
        this.sharedFeaturesApiService
            .get('segmentationgroups')
            .pipe(first())
            .subscribe((data: { groups: string[] }) => {
                this.segmentationGroup = data.groups;
                this.dslCacheService.invalidate(['user.segmentationGroups']);
            });
    }
}
