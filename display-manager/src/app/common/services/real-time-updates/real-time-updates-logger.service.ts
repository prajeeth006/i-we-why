import { Injectable } from '@angular/core';
import { LogType, LoggerService } from '../logger-service/logger.service';
import { ScContextService } from 'src/app/sitecore/sc-context-service/sc-context.service';

@Injectable({
  providedIn: 'root'
})
export class RealTimeUpdatesLoggerService {
  accountInformation: any;
  
  constructor(private loggerService: LoggerService,
    private scContextService: ScContextService,
  ) {
    this.scContextService.context$.subscribe((accountInformation: any) => {
      this.accountInformation = accountInformation
    })
  }

  log(message: string, level: LogType = LogType.Information, status: string = "real-time-logs", fatal: boolean = false) {
    this.loggerService.logMessage(message, level, status, fatal);
  }

  saveLog(logInfo: any, level: LogType = LogType.Information) {
    logInfo.logTime = new Date().toISOString();
    logInfo.user = this.accountInformation?.User?.Profile?.FullName;
    try {
      this.log(JSON.stringify(logInfo), level);
    } catch (e) {
      this.log(logInfo, level);
    }
  }

}
