import { ActivatedRoute } from "@angular/router";
import { Mock, StubObservable } from 'moxxi';

@Mock({ of: ActivatedRoute })
export class ActivatedRouteMock {
  @StubObservable() getQueryParams: jasmine.ObservableSpy;
}