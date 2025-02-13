import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SignalRService } from './common/services/signalR-service/signal-r.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  constructor(private signalRService: SignalRService){
  }

  ngOnInit(): void {
    this.signalRService.loadSignalRConfig()
  }
}
