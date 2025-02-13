import { Injectable, NgZone } from "@angular/core";
import { Observable, Subscriber } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class EventSourceDataFeedService {
  urlStaleDataMap = new Map<string, boolean>();
  constructor(
    private _zone: NgZone,
  ) { }

  getServerSentEvent(url: string, snapShotDataTimeOut: number = 5000, checkForSnapShot = true): Observable<any> {
    
    let has404Error: boolean = false;
    let requestStartedAt: number = Date.now();
    let timeOut : NodeJS.Timeout | undefined;
    let isSnapshotDataAvailable: boolean = false;

    return new Observable((observer: Subscriber<string>) => {
      const eventSource = new EventSource(url);
      timeOut = setTimeout(() => {
        this.handleSnapShotDelay(timeOut, has404Error, url, snapShotDataTimeOut, isSnapshotDataAvailable);  
        timeOut = undefined;
        eventSource.close();
        this._zone.run(() => {
          observer.next('{"isFinished":true}');
        });
      }, snapShotDataTimeOut);
      eventSource.onmessage = (event: any) => {
        try {
          let responseData = JSON.parse(event.data);
          let isSuccess = this.isSuccess(responseData);
          let isSnapShot = this.isSnapShotMessage(responseData);

          if (isSnapShot) {
            isSnapshotDataAvailable = true;
            if(checkForSnapShot){
              if(timeOut)
                clearTimeout(timeOut);
              eventSource.close();
              this._zone.run(() => {
                observer.next('{"isFinished":true}');
              });
            }
          } else {
            if (!isSuccess) {
              console.error(event.currentTarget['url'], responseData);
            }
            else {
              this.urlStaleDataMap.set(url, true);
              this._zone.run(() => {
                observer.next(event.data);
              });
            }
          }
        }
        catch (e: any) {
          console.error(e, 'Connection lost with event error');
          this._zone.run(() => {
            observer.next('{"isFinished":true}');
          });
        }
      };

      eventSource.onerror = (errorEvent: any) => {
        console.error(errorEvent.currentTarget['url'] + " " + 'Connection lost with event source');
        has404Error = true;
        this._zone.run(() => {
          observer.next('{"isFinished":true}');
        });
      };
    });
  }

  isSuccess(responseData: any) {
    return !(responseData?.status !== undefined && responseData.status === 404);
  }

  isSnapShotMessage(responseData: any) {
    return !!responseData?.status && responseData.status == '600';
  }

  handleSnapShotDelay(timeOut: any, has404Error: boolean, url: string, snapShotDataTimeOut: number, isSnapshotDataAvailable: boolean){
    if(timeOut){
      clearTimeout(timeOut);
      if(!isSnapshotDataAvailable && !has404Error){
        console.error(url, "Snapshot data not received with in "+ snapShotDataTimeOut + " Milliseconds.", "500", true);
      }
      
    }
  }

}