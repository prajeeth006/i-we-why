import { Mock, Stub } from 'moxxi';
import { Subject } from 'rxjs';

import { TerminalSessionOverlayService } from '../src/terminal-session-overlay.service';
import { TerminalSessionConfig } from '../src/terminal-session.client-config';
import { TerminalSession } from '../src/terminal-session.models';
import { TerminalSessionService } from '../src/terminal-session.service';

@Mock({ of: TerminalSessionConfig })
export class TerminalSessionConfigMock extends TerminalSessionConfig {
    override whenReady = new Subject<void>();
}

@Mock({ of: TerminalSessionService })
export class TerminalSessionServiceMock {
    terminalSession = new Subject<TerminalSession>();
}

@Mock({ of: TerminalSessionOverlayService })
export class TerminalSessionOverlayServiceMock {
    @Stub() show: jasmine.Spy;
}
