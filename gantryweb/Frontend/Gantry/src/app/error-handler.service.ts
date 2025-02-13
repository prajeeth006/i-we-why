import { ErrorHandler, Injectable } from '@angular/core';
import { Log, LoggerService, LogType } from './common/services/logger.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService implements ErrorHandler {

  constructor(private loggerService: LoggerService) {

  }

  handleError(error: any) {
    console.log(error);
    // Implement your own way of handling errors
    let log = this.prepareLog(error);
    this.loggerService.log(log);
  }

  prepareLog(error: any) {
    let log = new Log();
    log.message = error.message;
    log.stack = error.stack;
    log.fatal = true;
    log.level = LogType.Error;
    log.status = "NA";

    return log;
  }
}

