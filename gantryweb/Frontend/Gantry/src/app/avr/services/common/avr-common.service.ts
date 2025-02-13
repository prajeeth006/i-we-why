import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AvrCommonService {
  controllerId$ = new BehaviorSubject<string>("");

  setControllerId(id: string) {
    this.controllerId$.next(id);
  }

  getControllerId() {
    return this.controllerId$.getValue();
  }

  constructor() { }
}
