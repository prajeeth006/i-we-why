import { Component, OnInit } from '@angular/core';
import { SortedScreens } from '../../profiles/models/sorted-screens';
import { MasterConfigurationService } from '../services/master-configuration.service';
import { AssetType } from '../../profiles/models/profile';
import { combineLatest } from 'rxjs';
import { ProfileConstants } from '../../profiles/constants/profile-constants';
import { SignalRConfigItem, SignalRService } from '../../../../common/services/signalR-service/signal-r.service';
import { RealTimeUpdatesV2Service } from '../../../../common/services/real-time-updates/real-time-updates-v2.service';

@Component({
  selector: 'app-master-gantry-configuration',
  templateUrl: './master-gantry-configuration.component.html',
  styleUrls: ['./master-gantry-configuration.component.scss']
})
export class MasterGantryConfigurationComponent implements OnInit {
  currentProfile: string;
  currentLabel: string;
  selectedIndex: number = 0;
  sortedMasterGantryScreensData: SortedScreens;
  gantryShops: Array<string> = [];

  gantryScreenData: any;
  currentProfileVal: any;
  signalRconfig: SignalRConfigItem;

  constructor(private masterConfigService: MasterConfigurationService,
    private realTimeUpdatesV2Service: RealTimeUpdatesV2Service,
    private signalRService: SignalRService
  ) {

    this.signalRService.signalRConfig$.subscribe((signalRconfig: SignalRConfigItem) => {
      this.signalRconfig = signalRconfig;
    });

  }

  ngOnInit(): void {
    this.currentProfileVal = combineLatest([this.masterConfigService.currentProfileVal$, this.masterConfigService.listOfGantryTypesChanges$]).subscribe(
      ([currentProfile, listOfGantryTypes]) => {
        this.currentProfile = currentProfile;
        this.gantryShops = listOfGantryTypes;
        if (this.gantryShops?.length > 0 && currentProfile)
          this.loadGantryData(this.gantryShops[this.selectedIndex]);
      })



    this.gantryScreenData = this.masterConfigService.gantryScreenData$.subscribe((data) => {
      var assetTypes = data?.find(x => x?.Name?.toLowerCase() == this.currentProfile?.toLowerCase())?.GantryTypes?.find(y => y?.Name?.toLowerCase() == this.gantryShops[this.selectedIndex]?.toLowerCase())?.AssetTypes as AssetType[];
      this.sortedMasterGantryScreensData = this.masterConfigService.loadMasterGantryData(assetTypes);
    })

    this.updateGantryTypeOnSaveChanges();
  }

  selectGantryType(gantryType: any, index: number) {
    console.log("Current gantryType : ", gantryType);
    this.selectedIndex = index;
    this.loadGantryData(gantryType);
  }


  loadGantryData(gantryType: any) {
    if(this.signalRconfig.isRealTimeUpdatesEnabled){
      this.realTimeUpdatesV2Service.gantryType = gantryType;
    }
    this.masterConfigService.loadMasterScreensData(this.currentProfile, gantryType, false)
  }

  updateGantryTypeOnSaveChanges() {
    this.masterConfigService.onSaveChanges$.subscribe((value: string) => {
      if (value == ProfileConstants.saveCompleted) {
        this.selectGantryType(this.gantryShops[this.selectedIndex], this.selectedIndex);
      }
    })
  }

  ngOnDestroy() {
    this.currentProfileVal.unsubscribe();
    this.gantryScreenData.unsubscribe();
  }
}
