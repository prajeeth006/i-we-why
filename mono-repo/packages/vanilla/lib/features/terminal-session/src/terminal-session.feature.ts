import { runOnFeatureInit } from '@frontend/vanilla/core';

import { TerminalSessionBootstrapService } from './terminal-session-bootstrap.service';

export function provide() {
    return [runOnFeatureInit(TerminalSessionBootstrapService)];
}
