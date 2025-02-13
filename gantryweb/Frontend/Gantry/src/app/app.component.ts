import { Component, HostListener, OnDestroy } from '@angular/core';
import { EventSourceManager } from "./common/services/sse-services/event-source-manager.service";


@Component({
  selector: 'root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  title = 'Gantry';

  constructor(private eventSourceManager: EventSourceManager
  ) {
  }

  @HostListener('window:beforeunload', ['$event'])
  ngOnDestroy() {
    let eventSources = this.eventSourceManager.get()

    eventSources.forEach(eventSource => {
      eventSource.close();
    });
  }
}
