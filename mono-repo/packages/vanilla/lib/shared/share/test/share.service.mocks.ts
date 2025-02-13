import { ShareService } from '@frontend/vanilla/shared/share';
import { Mock, Stub } from 'moxxi';

@Mock({ of: ShareService })
export class ShareServiceMock {
    @Stub() share: jasmine.Spy;
}
