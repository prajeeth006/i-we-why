import { Injectable } from '@angular/core';
import { Log, LogType, LoggerService } from '../../logger-service/logger.service';

type SignalRParams = {
  [key: string]: any
}

@Injectable({
  providedIn: 'root'
})
export class SignalrParamsService {


  constructor(private loggerService: LoggerService) { }
  addParams(signalRUrl: string, params: SignalRParams): string {
    try {
      let updatedUrl = new URL(signalRUrl);
      if (Object.keys(params).length > 0) {
        for (let key in params) {
          updatedUrl.searchParams.set(key, params[key])
        }
      }

      return updatedUrl.toString();

    } catch (e) {
      let errorLog: Log = {
        level: LogType.Error,
        message: `Could not able to add params for SignalR URL because: ${e}.`,
        status: 'NA',
        fatal: false
      }
      this.loggerService.log(errorLog)
      return signalRUrl;
    }
  }
}
