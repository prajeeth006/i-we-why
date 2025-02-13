import { Component, OnInit } from '@angular/core';
import { HostConnectionService } from './host-connection.service';


@Component({
  selector: 'app-host-connection',
  templateUrl: './host-connection.component.html',
  styleUrls: ['./host-connection.component.scss']
})
export class HostConnectionComponent implements OnInit {
  hosts : any;
  serverConnection : string;
  tdBackgroundGreen : string;
  tdBackgroundRed: string;

  constructor(private hostConnection : HostConnectionService) { }

  ngOnInit(): void {
    this.getHostConnection();
    this.tdBackgroundGreen= "green";
    this.tdBackgroundRed ="red";
  }

  
   getHostConnection() {
    this.serverConnection ="Kafka servers connection";
    this.hostConnection.getKafkaStatus().subscribe((data) => {
      this.hosts =data;
    });
  }

}
