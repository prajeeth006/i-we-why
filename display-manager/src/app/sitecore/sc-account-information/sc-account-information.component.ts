import { Component, OnInit } from '@angular/core';
import { ScContextService } from '../sc-context-service/sc-context.service';
import { LogoutService } from '../sc-logout-service/logout.service';

@Component({
  selector: 'sc-account-information',
  templateUrl: './sc-account-information.component.html',
  styleUrls: ['./sc-account-information.component.scss']
})
export class ScAccountInformationComponent implements OnInit {

  accountInformation: any;
  constructor(
    private scContextService: ScContextService,
    private logoutService: LogoutService,


  ) { }

  ngOnInit(): void {
    this.bindAccountInformation();
  }

  bindAccountInformation(){
    this.scContextService.context$.subscribe((accountInformation) => {
      this.accountInformation = accountInformation;
    })
  }

  onLogout() {
    sessionStorage.clear();
    this.logoutService.logout();
  }
}
