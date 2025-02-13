import { DarkModeService } from '@frontend/vanilla/shared/dark-mode';
import { Mock, Stub } from 'moxxi';

@Mock({ of: DarkModeService })
export class DarkModeServiceMock {
    isEnabled: boolean;
    @Stub() toggle: jasmine.Spy;
}
