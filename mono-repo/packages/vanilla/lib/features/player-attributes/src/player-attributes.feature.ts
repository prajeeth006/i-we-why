import { registerLazyDslOnModuleInit } from '@frontend/vanilla/core';

import { PlayerAttributesDslValuesProvider } from './player-attributes-dsl-values-provider';

export function provide() {
    return [registerLazyDslOnModuleInit(PlayerAttributesDslValuesProvider)];
}
