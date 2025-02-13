import { Mock, Stub, StubPromise } from 'moxxi';
import { Subject } from 'rxjs';

import { PlayBreakOverlayService } from '../src/play-break-overlay.service';
import { PlayBreakTrackingService } from '../src/play-break-tracking.service';
import { PlayBreakConfig } from '../src/play-break.client-config';
import { PlayBreak, PlayBreakTimer, PlayBreakWorkflow } from '../src/play-break.models';
import { PlayBreakService } from '../src/play-break.service';

@Mock({ of: PlayBreakService })
export class PlayBreakServiceMock {
    playBreak = new Subject<PlayBreak>();
    playBreakWorkflow = new Subject<PlayBreakWorkflow>();
    playBreakTimer = new Subject<PlayBreakTimer>();
    @StubPromise() acknowledgePlayBreak: jasmine.PromiseSpy;
    @Stub() load: jasmine.Spy;
    @Stub() startPlayBreakTimer: jasmine.Spy;
    @Stub() changePlayBreakWorkflow: jasmine.Spy;
    @Stub() formatTime: jasmine.Spy;
}

@Mock({ of: PlayBreakOverlayService })
export class PlayBreakOverlayServiceMock {
    @Stub() showBreakConfig: jasmine.Spy;
    @Stub() showSoftBreak: jasmine.Spy;
    @Stub() showMandatoryBreak: jasmine.Spy;
    @Stub() showDurationSelection: jasmine.Spy;
    @Stub() showStartSelection: jasmine.Spy;
    @Stub() showConfirmation: jasmine.Spy;
}

@Mock({ of: PlayBreakConfig })
export class PlayBreakConfigMock extends PlayBreakConfig {
    override whenReady = new Subject<void>();

    constructor() {
        super();

        this.templates = <any>{
            breaktimer: { messages: { 'time-PLAY_BREAK': 'tick' } },
            takebreaklater: { messages: {} },
            takebreaknow: { messages: {} },
            mandatorybreak: { messages: {} },
            mandatorybreak24h: { messages: {} },
            scheduledbreakprompt: { messages: {} },
            scheduledbreakprompt24h: { messages: {} },
            nonscheduledbreakprompt: { messages: {} },
            nonscheduledbreakprompt24h: { messages: {} },
            breakstartselection: { messages: {}, form: { breakstartform: { toolTip: '' } } },
            breakdurationselection: { messages: {}, form: { breakdurationform: { toolTip: '' } } },
            breakstartednotification: { messages: {}, validation: {} },
            breakstartednotification24h: { messages: {}, validation: {} },
            breakshedulednotification: { messages: {}, validation: {} },
            breakshedulednotification24h: { messages: {}, validation: {} },
        };
    }
}

@Mock({ of: PlayBreakTrackingService })
export class PlayBreakTrackingServiceMock {
    @Stub() trackInterceptorShown: jasmine.Spy;
    @Stub() trackHeaderClose: jasmine.Spy;
    @Stub() trackClose: jasmine.Spy;
    @Stub() trackTakeShortBreak: jasmine.Spy;
    @Stub() trackDurationSelectionOpen: jasmine.Spy;
    @Stub() trackDurationSelectionChange: jasmine.Spy;
    @Stub() trackDurationSelectionCancel: jasmine.Spy;
    @Stub() trackDrawerContinue: jasmine.Spy;
    @Stub() trackDrawerOpenedSecondStep: jasmine.Spy;
    @Stub() trackDrawerPeriodSelectedSecondStep: jasmine.Spy;
    @Stub() trackDrawerCancelSecondStep: jasmine.Spy;
    @Stub() trackDrawerContinueSecondStep: jasmine.Spy;
    @Stub() trackConfirmationDrawerOpened: jasmine.Spy;
    @Stub() trackConfirmationDrawerCancel: jasmine.Spy;
    @Stub() trackConfirmationDrawerConfirm: jasmine.Spy;
    @Stub() trackConfirmationDrawerChangeDuration: jasmine.Spy;
    @Stub() trackNotificationPopupDisplayed: jasmine.Spy;
    @Stub() trackNotificationPopupContactUs: jasmine.Spy;
    @Stub() trackNotificationPopupOk: jasmine.Spy;
    @Stub() trackHeaderMessageShown: jasmine.Spy;
    @Stub() trackHeaderMessageContactUs: jasmine.Spy;
    @Stub() trackHardInterceptorShown: jasmine.Spy;
    @Stub() trackHardInterceptorTakeBreak: jasmine.Spy;
    @Stub() trackHardInterceptorLiveChat: jasmine.Spy;
    @Stub() trackLSL24InterceptorLoad: jasmine.Spy;
    @Stub() trackLSL24InterceptorClick: jasmine.Spy;
    @Stub() trackLSL24StepLoad: jasmine.Spy;
    @Stub() trackLSL24StepDrawerClick: jasmine.Spy;
    @Stub() trackLSL24StepConfirmLoad: jasmine.Spy;
    @Stub() trackLSL24BreakTimePlayerSet: jasmine.Spy;
    @Stub() trackLSL24TakePlayBreakYesNo: jasmine.Spy;
    @Stub() trackLSL24NotificationPopupDisplayed: jasmine.Spy;
    @Stub() trackLSL24NotificationContinue: jasmine.Spy;
    @Stub() trackLSL24NotificationContactUs: jasmine.Spy;
}
