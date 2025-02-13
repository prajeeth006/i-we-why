import { Component } from '@angular/core';
import { MasterToggleStateService } from './master-toggle-state.service';
import { LabelSelectorService } from 'src/app/display-manager/display-manager-header/label-selector/label-selector.service';
import { SignalRService } from 'src/app/common/services/signalR-service/signal-r.service';
import { Field, MasterToggleFormattedFields, SitecoreItemRoot } from 'src/app/common/services/signalR-service/signal-r.model';
import { JsonUtilities } from 'src/app/helpers/json-utilities';
import { RealTimeEventKeys, UserActions, UserTypes } from 'src/app/common/services/real-time-updates/models/real-time-logger.model';
import { RealTimeUpdatesLoggerService } from 'src/app/common/services/real-time-updates/real-time-updates-logger.service';
import { MatDialog } from '@angular/material/dialog';
import { ActionDialogComponent } from 'src/app/common/action-dialog/action-dialog.component';
import { Constants } from '../../display-manager-right-panel/constants/constants';
import { MasterConfigurationService } from '../../display-manager-right-panel/master-layout/services/master-configuration.service';
import { SequencencingHelperService } from '../../services/sequencencing-helper/sequencencing-helper.service';

@Component({
  selector: 'master-toggle',
  templateUrl: './master-toggle.component.html',
  styleUrls: ['./master-toggle.component.scss']
})
export class MasterToggleComponent {
  sequencingEnabled: boolean = false;
  currentLabel: string;
  masterToggleActive: boolean = true;
  changeValue: string | boolean = '';
  masterconstants = Constants;
  constructor(
    public labelSelectorService: LabelSelectorService,
    private masterToggleStateService: MasterToggleStateService,
    private signalRService: SignalRService,
    private realTimeUpdatesLoggerService: RealTimeUpdatesLoggerService,
    public dialog: MatDialog,
    private masterConfigService: MasterConfigurationService,
    private sequencencingHelper: SequencencingHelperService
  ) {
    this.labelSelectorService.sequencingEnabled$.subscribe(
      (visible: boolean) => {
        this.sequencingEnabled = visible;        
      }
    );
    this.signalRService.signalRMessage$
      .subscribe((sitecoreItemRoot: SitecoreItemRoot) => {
        try {
          if (!JsonUtilities.isEmptyObject(sitecoreItemRoot) &&
            sitecoreItemRoot?.Item?.Key == RealTimeEventKeys.MasterToggle &&
            sitecoreItemRoot?.Item?.Path?.toLowerCase().includes(this.currentLabel.toLowerCase())
          ) {
            let fields = {} as MasterToggleFormattedFields;
            sitecoreItemRoot?.Item?.Fields?.forEach((field: Field) => fields[field?.Key as keyof MasterToggleFormattedFields] = field?.Content);
            this.masterToggleStateService.setSequencingToggle(fields?.value?.toLowerCase() === 'true');
          }
        } catch (e) {
          console.log(`Error in processing Content From masterToggle SignalR ${e}`);
        }
      });
  }
  get sequenceJourneyStatus(): boolean {
    return this.sequencencingHelper.sequenceJourneyStatus();
  }
  ngOnInit(): void {
    this.subscribeToSequencingToggle();
    this.labelSelectorService.currentLabel$.subscribe((currentLabel: string) => {
      this.currentLabel = currentLabel;
      this.masterToggleStateService.currentLabel = currentLabel;
      this.masterToggleStateService.getMasterToggle();
    });
  }

  subscribeToSequencingToggle() {
    this.masterToggleStateService.sequencingToggle$.subscribe((value) => {
      this.masterToggleActive = value;
      this.changeValue = value;
    });
  }

  onToggleChange() {    
    this.changeValue = '';    
    const confirmationDialogData = {
      dialog_title: this.masterconstants.use_master,
      dialog_msg: this.labelSelectorService?.configItemValues?.individualToMaster_allAssigned,
      dialog_btn_cancel: this.masterconstants.btn_cancel,
      dialog_btn_submit: this.masterconstants.btn_continue
    };

    if (!this.masterToggleActive) {
      if (this.masterConfigService.checkAllScreensHaveAssets()) {
        confirmationDialogData.dialog_msg = this.labelSelectorService?.configItemValues?.masterToIndividual_allAssigned;
      } else {
        confirmationDialogData.dialog_msg = this.labelSelectorService?.configItemValues?.masterToIndividual_notAllAssigned;
      }
    }
    
    const dialogRef = this.dialog.open(ActionDialogComponent, {
      id: 'confirm-change-modal',
      hasBackdrop: true,
      width: '40%',
      panelClass: 'modern-dialog',
      disableClose: true,
      data: { ...confirmationDialogData, change: false },
    });

    dialogRef.afterClosed().subscribe(isChange => {
      if (isChange) {
        this.updateToggleState();
      } else if (this.changeValue === '') {
        this.subscribeToSequencingToggle();
    }
    });
  }

  updateToggleState() {
    const logInfo = {
      userType: UserTypes.Publisher,
      userAction: UserActions.MasterToggle,
      isMasterToggleEnabled: this.masterToggleActive
    }
    this.realTimeUpdatesLoggerService.saveLog(logInfo);
    this.masterToggleStateService.saveMasterToggle(this.masterToggleActive);
  }
}
