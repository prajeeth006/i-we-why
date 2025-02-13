import { TestBed } from '@angular/core/testing';
import { RealTimeUpdatesLoggerService } from './real-time-updates-logger.service';
import { LoggerService, LogType } from '../logger-service/logger.service';
import { ScContextService } from 'src/app/sitecore/sc-context-service/sc-context.service';
import { of } from 'rxjs';

describe('RealTimeUpdatesLoggerService', () => {
  let service: RealTimeUpdatesLoggerService;
  let mockLoggerService: jasmine.SpyObj<LoggerService>;
  let mockScContextService: jasmine.SpyObj<ScContextService>;

  beforeEach(() => {
    // Mock LoggerService
    mockLoggerService = jasmine.createSpyObj('LoggerService', ['logMessage']);

    // Mock ScContextService with an observable for context$
    mockScContextService = jasmine.createSpyObj('ScContextService', [], {
      context$: of({ User: { Profile: { FullName: 'Test User' } } })
    });

    TestBed.configureTestingModule({
      providers: [
        RealTimeUpdatesLoggerService,
        { provide: LoggerService, useValue: mockLoggerService },
        { provide: ScContextService, useValue: mockScContextService }
      ]
    });

    service = TestBed.inject(RealTimeUpdatesLoggerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call logMessage with correct parameters when log is called', () => {
    // Arrange
    const message = 'Test log message';
    const level = LogType.Warning;
    const status = 'real-time-logs';
    const fatal = true;

    // Act
    service.log(message, level, status, fatal);

    // Assert
    expect(mockLoggerService.logMessage).toHaveBeenCalledWith(message, level, status, fatal);
  });

  it('should handle error when saveLog encounters JSON stringify issue', () => {
    // Arrange
    const logInfo = { event: 'Test Event' };
    spyOn(JSON, 'stringify').and.throwError('Stringify Error');

    // Act
    service.saveLog(logInfo, LogType.Error);

    // Assert: The log method should be called with the original logInfo object
    expect(mockLoggerService.logMessage).toHaveBeenCalledWith(
      logInfo,
      LogType.Error,
      'real-time-logs',
      false
    );
  });
});
