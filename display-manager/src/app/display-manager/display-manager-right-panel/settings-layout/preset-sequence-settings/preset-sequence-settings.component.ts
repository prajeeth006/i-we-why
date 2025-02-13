import { Component, Input } from '@angular/core';
import { MasterLayoutTabs } from '../../profiles/models/master-tabs';
import { CommonModule } from '@angular/common';
import { ApiService } from 'src/app/common/api.service';
import { LabelSelectorService } from 'src/app/display-manager/display-manager-header/label-selector/label-selector.service';
import { tap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { SitecoreImageService } from 'src/app/display-manager/display-manager-left-panel/services/sitecore-image/sitecore-image.service';
import { SequencePresetModelPopUpComponent } from '../screen-settings/sequence-popup/sequence-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { Constants } from '../../constants/constants';
import { SequencePresetService } from '../services/sequence-preset.service';
import { ConfirmationDialogComponent } from 'src/app/common/confirmation-dialog/confirmation-dialog.component';
import { FormGroup } from '@angular/forms';
import { DialogueComponent } from 'src/app/common/dialogue/dialogue.component';
import {
  PresetData,
  PresetStage,
  PresetTypes,
} from '../models/sequence-preset.model';

@Component({
  selector: 'preset-sequence-settings',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './preset-sequence-settings.component.html',
  styleUrl: './preset-sequence-settings.component.scss',
})
export class PresetSequenceSettingsComponent {
  manualConstants = Constants;

  currentLabel: string;
  @Input() screenData: MasterLayoutTabs = {} as MasterLayoutTabs;

  presetSettingsSubscription$: Subscription;

  presetSettings: any;
  presetData: any;
  editIcon: string | undefined;
  copyIcon: string | undefined;
  disableEdit: boolean = false;
  presetTypes = PresetTypes;
  disableClone: boolean = false;
  presetStage = PresetStage;

  constructor(
    private apiService: ApiService,
    private labelSelectorService: LabelSelectorService,
    private sitecoreImageService: SitecoreImageService,
    private sequencePresetService: SequencePresetService,
    public dialog: MatDialog,
  ) {
    this.labelSelectorService.currentLabel$
      .pipe(
        tap((label: string) => {
          this.currentLabel = label;
        }),
      )
      .subscribe(() => {
        this.sequencePresetService
          .getPresetList(this.currentLabel)
          .subscribe((data) => {
            this.presetSettings = data;
          });
      });
  }

  ngOnInit() {
    this.sitecoreImageService.mediaAssets$.subscribe((mediaAssets) => {
      this.editIcon = mediaAssets?.EditIconDark;
      this.copyIcon = mediaAssets?.CopyIcon;
    });
  }

  getPresetList() {
    this.sequencePresetService
      .getPresetList(this.currentLabel)
      .subscribe((data) => {
        this.presetSettings = data;
      });
  }
  newSequencePreset() {
    const presetNames = this.presetSettings?.map((preset: { Name: any; }) => preset.Name) || [];
    var timeout = setTimeout(() => {
      const dialogRef = this.dialog.open(SequencePresetModelPopUpComponent, {
        id: 'new-preset-modal-popup-card',
        width: '1024px',
        height: '820px',
        disableClose: true,
        backdropClass: 'scope-to-right-pannel',
        data: { presetNames },
      });
      clearTimeout(timeout);
      dialogRef.afterClosed().subscribe((result) => {
        if (result === this.manualConstants.preset_dialog_save) {
          this.getPresetList();
        }
      });
    }, 100);
  }

  editSequencePreset(sequencePresetId: string, name: string, type: string) {
    this.disableEdit = true;
    this.sequencePresetService
      .getSequencePreset(this.currentLabel, sequencePresetId)
      .subscribe((data) => {
        this.presetData = this.sequencePresetService.populateForm(data);
        this.presetData.stage = this.presetStage.edit;
        this.presetData.disableType =
          type?.toLowerCase() == Constants.system_preset;
        this.presetData.sequencePresetId = sequencePresetId;
        const dialogRef = this.dialog.open(SequencePresetModelPopUpComponent, {
          id: 'edit-preset-modal-popup-card',
          width: '1024px',
          height: '820px',
          disableClose: true,
          backdropClass: 'scope-to-right-pannel',
          data: this.presetData,
        });
        this.disableEdit = false;
        dialogRef.afterClosed().subscribe((result) => {
          if (result === this.manualConstants.preset_dialog_save) {
            this.getPresetList();
          }
        });
      });
  }

  cloneSequencePreset(sequencePresetId: string) {
    this.disableClone = true;
    this.sequencePresetService
      .getSequencePreset(this.currentLabel, sequencePresetId)
      .subscribe((data: PresetData) => {
        if (data?.Name) {
          data.Name = '';
        }
        this.presetData = this.sequencePresetService.populateForm(data);
        this.presetData.stage = this.presetStage.clone;
        this.dialog.open(SequencePresetModelPopUpComponent, {
          id: 'clone-preset-modal-popup-card',
          width: '1024px',
          height: '820px',
          disableClose: true,
          backdropClass: 'scope-to-right-pannel',
          data: this.presetData,
        });
        this.disableClone = false;
      });
  }

  openDeleteConfirmationPopup(sequencePresetId: string, name: string) {
    const deletePresetDialogData = {
      dialog_title: this.manualConstants.delete_preset,
      dialog_msg: `Are you sure you want to delete '${name}'?`,
      dialog_btn_cancel: this.manualConstants.btn_cancel,
      dialog_btn_delete: this.manualConstants.btn_delete,
    };

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      id: 'delete-modal',
      hasBackdrop: true,
      width: '40%',
      panelClass: 'modern-dialog',
      data: { ...deletePresetDialogData },
    });

    dialogRef.beforeClosed().subscribe((action: any) => {
      if (action == this.manualConstants.btn_delete) {
        this.deleteSequencePreset(sequencePresetId);
      }
    });
  }

  deleteSequencePreset(sequencePresetId: string) {
    this.sequencePresetService
      .deleteSequencePreset(this.currentLabel, sequencePresetId)
      .subscribe(
        (response: any) => {
          if (response && response.IsSuccess) {
            this.getPresetList();
          } else {
            console.log(response.Message);
            this.dialog.open(DialogueComponent, {
              data: { message: response.ErrorMessage },
            });
          }
        },
        (error) => {
          console.log(error);
          this.dialog.open(DialogueComponent, { data: { message: error } });
        },
      );
  }
}
