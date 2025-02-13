import { TestBed } from '@angular/core/testing';
import { SequencencingHelperService } from './sequencencing-helper.service';


describe('SequencencingHelperService', () => {
  let service: SequencencingHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SequencencingHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize sequenceJourneyStatus as false', () => {
    expect(service.sequenceJourneyStatus()).toBeFalse();
  });

  it('should update sequenceJourneyStatus to true', () => {
    service.setSequenceJourneyStatus(true);
    expect(service.sequenceJourneyStatus()).toBeTrue();
  });

  it('should update sequenceJourneyStatus to false', () => {
    service.setSequenceJourneyStatus(true);
    service.setSequenceJourneyStatus(false);
    expect(service.sequenceJourneyStatus()).toBeFalse();
  });

  it('should provide a writable signal for sequenceJourneyStatus', () => {
    const statusSignal = service.sequenceJourneyStatus;
    statusSignal.set(true);
    expect(statusSignal()).toBeTrue();
  });
});
