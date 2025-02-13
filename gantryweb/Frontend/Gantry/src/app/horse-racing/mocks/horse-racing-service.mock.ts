import { Mock, StubObservable } from "moxxi";
import { RacingContentService } from "../services/data-feed/racing-content.service";

@Mock({ of: RacingContentService })
export class RacingContentServiceMock {
  @StubObservable() getHorseRacingContent: jasmine.ObservableSpy;
  @StubObservable() getEventFeedApiUrls: jasmine.ObservableSpy;
}