import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProgressService {

  constructor() {

  }
  showProgress = new BehaviorSubject<boolean>(true);

  get progress(): Observable<boolean> {
    return this.showProgress.asObservable();
  }

  start() {
    this.showProgress.next(true);
  }

  done() {
    this.showProgress.next(false);
  }
}
