import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TabChangeValues } from '../../generic-tab-service/model/tabChangeValues.model';

@Injectable({
  providedIn: 'root'
})
export class ProductTabService {
  activeTabData = new BehaviorSubject<string>("");
  activeTab$ = this.activeTabData.asObservable();
  tabNameChange = new BehaviorSubject<TabChangeValues>(new TabChangeValues());
  tabNameChange$ = this.tabNameChange.asObservable();
  activeLibraryOrManualTabData = new BehaviorSubject<string>("");
  activeLibraryOrManualTab$ = this.activeLibraryOrManualTabData.asObservable();
  activeOverrideOrUserCreatedTabData = new BehaviorSubject<string>("");
  activeOverrideOrUserCreatedTab$ = this.activeOverrideOrUserCreatedTabData.asObservable();

  constructor() { }

  setActiveTab(tabName: string){
    this.activeTabData.next(tabName);
  }

  setTabNameOnTabChange(tabChangeValues : TabChangeValues){
    this.tabNameChange.next(tabChangeValues);
  }  

  setActiveLibraryOrManualTab(tabName: string){
    this.activeLibraryOrManualTabData.next(tabName);
  }

  setOverrideOrUserCreatedTab(tabName: string){
    this.activeOverrideOrUserCreatedTabData.next(tabName);
  }

}
