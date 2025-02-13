import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable, NgZone } from '@angular/core';
import { LogType, LoggerService } from '../services/logger-service/logger.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(
    private loggerService: LoggerService,
    private zone: NgZone
  ) {}

  handleError( error: any) {
    
    this.zone.run(() =>{
        this.loggerService.logMessage(typeof error == 'string' ? error : JSON.stringify(error), LogType.Error, '500', false);
    });
    console.error('Error from global error handler', error);
    
  }
}
