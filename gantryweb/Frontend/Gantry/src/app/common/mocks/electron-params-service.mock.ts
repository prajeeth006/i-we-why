import { Mock, StubObservable } from "moxxi";
import { ElectronParamsService } from "../services/electron-params/electron-params.service";

@Mock({ of: ElectronParamsService })
export class ElectronParamsServiceMock {
  @StubObservable() addParamAddedByElectron: jasmine.ObservableSpy;
}