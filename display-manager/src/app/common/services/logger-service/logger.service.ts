import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';

export enum LogType {
  Trace = 0,
  Debug = 1,
  Information = 2,
  Warning = 3,
  Error = 4,
  Critical = 5,
  None = 6
}

export class Log {
  message: string | any;
  level: LogType;
  status: string;
  fatal: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  constructor(private apiService: ApiService) {
  }

  log(log: Log) {
    console.log(log);
    this.apiService.post('/sitecore/api/displayManager/log', log).subscribe();
  }

  logInfo(log: Log){
    log.level = LogType.Information;
    this.log(log);
  }

  logError(log: Log){
    log.level = LogType.Error;
    this.log(log);
  }
  
  logWarning(log: Log){
    log.level = LogType.Warning;
    this.log(log);
  }

  logMessage(message: string | any, level: LogType, status: string, fatal: boolean){
      this.log({
        message: message,
        level: level,
        status: status,
        fatal: fatal
      });
  }
}
