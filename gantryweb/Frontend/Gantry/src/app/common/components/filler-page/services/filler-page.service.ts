import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class FillerPageService {
    private subject = new BehaviorSubject<string>(null);
    fillerPageMessage$ = this.subject.asObservable();

    constructor() {
    }

    setFillerPage(message: string) {
        this.subject.next(message);
    }

    unSetFillerPage() {
        this.subject.next(null);
    }
}