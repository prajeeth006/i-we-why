import { LazyClientConfigService, registerLazyDslOnModuleInit, runOnFeatureInit } from '@frontend/vanilla/core';

import { ReferredFriendsBootstrapService } from './referred-friends-bootstrap.service';
import { ReferredFriendsDslValuesProvider } from './referred-friends-dsl-values-provider';
import { ReferredFriendsConfig, referredFriendsConfigFactory } from './referred-friends.client-config';
import { ReferredFriendsService } from './referred-friends.service';

export function provide() {
    return [
        ReferredFriendsService,
        {
            provide: ReferredFriendsConfig,
            useFactory: referredFriendsConfigFactory,
            deps: [LazyClientConfigService],
        },
        runOnFeatureInit(ReferredFriendsBootstrapService),
        registerLazyDslOnModuleInit(ReferredFriendsDslValuesProvider),
    ];
}
