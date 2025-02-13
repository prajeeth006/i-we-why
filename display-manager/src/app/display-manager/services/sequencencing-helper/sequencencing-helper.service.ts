import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SequencencingHelperService {
  _isLeftPannelInActive: WritableSignal<boolean> = signal<boolean>(false);
  private _isSequenceJourneyActive: WritableSignal<boolean> = signal<boolean>(false);

  get sequenceJourneyStatus(): WritableSignal<boolean> {
    return this._isSequenceJourneyActive ?? false;
  }

  setSequenceJourneyStatus(status: boolean) {
    this._isSequenceJourneyActive.set(status);
  }
}