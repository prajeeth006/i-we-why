import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { CommonModule, NgFor } from '@angular/common';
import { Component, ViewChild, inject } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import {
  MatFormField,
  MatOption,
  MatSelectModule,
} from '@angular/material/select';
import { SitecoreImageService } from 'src/app/display-manager/display-manager-left-panel/services/sitecore-image/sitecore-image.service';
import { SequencePresetService } from '../../settings-layout/services/sequence-preset.service';
import { LabelSelectorService } from 'src/app/display-manager/display-manager-header/label-selector/label-selector.service';
import { tap } from 'rxjs';
import { Constants } from '../../constants/constants';
import { IndividualConfigurationService } from '../services/individual-configuration.service';
import { SequencencingHelperService } from 'src/app/display-manager/services/sequencencing-helper/sequencencing-helper.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';
import { SharedModule } from 'src/app/shared-module';
import { PresetAssetNamePipe } from '../../filters/assetname/presetassetname.pipe';
import { PresetAssetsTableComponent } from 'src/app/display-manager/shared-html/preset-assets-table/preset-assets-table.component';
import { PresetAssetData } from '../models/sequence-preset';
import { ProfileConstants } from '../../profiles/constants/profile-constants';

@Component({
  selector: 'app-sequence-model-popup',
  templateUrl: './sequence-popup.component.html',
  styleUrls: ['./sequence-popup.component.scss'],
  standalone: true,
  imports: [
    CdkDrag,
    CdkDragHandle,
    MatDialogModule,
    MatIconModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatFormField,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgFor,
    MatOption,
    PresetAssetsTableComponent,
    CommonModule
],
providers: [PresetAssetNamePipe],
})
export class SequenceModelPopUpComponent {
  @ViewChild(PresetAssetsTableComponent) presetAssetsComponent!: PresetAssetsTableComponent;
  private sequencencingHelperService = inject(SequencencingHelperService);
  messageTitle = ProfileConstants.individualLayoutSequenceTitle;
  dialogHeaderTitle: string = Constants.new_preset;
  sequencePresetData: PresetAssetData = new PresetAssetData();
  selectedPresetValue: any;
  listOfPreset: any = [];
  resetIconPath: string;
  isApplyEnabled: boolean = false;
  isCreatePresetEnabled: boolean = false;
  presetIconPath: string;
  preset: string = '';
  originalData: any;
  currentLabel: string;
  isPresetUpdate: boolean = true;
  presetlist = ['8A', '8C', '8B', '8D'];
  constructor(private sitecoreImageService: SitecoreImageService,
    private sequencePresetService: SequencePresetService,
    private labelSelectorService: LabelSelectorService, 
    private individualConfigurationService: IndividualConfigurationService,
    private fb: UntypedFormBuilder
  ) {
    this.labelSelectorService.currentLabel$
      .pipe(
        tap((label: string) => {
          this.sequencePresetData.currentLabel = label;
        }),
      )
      .subscribe(() => {
        this.sequencePresetService.getPresetList(this.sequencePresetData.currentLabel).subscribe((data) => {
          this.listOfPreset = data;
        });
      });
  }


  /**
   * @description back to sequence flow
   *
   */
  resetSequence() {
    this.isApplyEnabled = false;   
    this.sequencencingHelperService._isLeftPannelInActive.set(true);
    this.sequencePresetData.isCreatePresetEnabled = this.isCreatePresetEnabled;    
    this.individualConfigurationService.initialPresetData$.next(this.sequencePresetData);
    this.presetAssetsComponent.resetPreset();
    this.initialFormStatus();

  }
  /**
   * @description add sequence to sequence flow
   *
   */
  addSequence() {
    //implement back sequence business logic
    this.individualConfigurationService.CreateNewSequence(this.presetlist, [])
  }

  selectPreset(selectedPreset: any) {
    this.isApplyEnabled = true;
    this.selectedPresetValue = selectedPreset;
    this.initialFormStatus();
    this.isPresetUpdate = true;
  }

  initialFormStatus(){
    this.isCreatePresetEnabled = false;
    this.newPresetForm.markAsPristine();
    this.newPresetForm.markAsUntouched();
  }

  ngAfterViewInit() {
    this.initialFormStatus();
  }
  

  applyPreset() {
    this.sequencePresetService
    .getSequencePreset(this.sequencePresetData.currentLabel, this.selectedPresetValue.SequencePresetId)
    .subscribe((data) => {
      this.sequencePresetData.currentLabel = this.sequencePresetData.currentLabel;
      this.sequencePresetData.presetData = this.sequencePresetService.populateForm(data);
      this.sequencePresetData.isCreatePresetEnabled = this.isCreatePresetEnabled;
      this.individualConfigurationService.initialPresetData$.next(this.sequencePresetData);
      this.sequencencingHelperService._isLeftPannelInActive.set(false);
      this.initialFormStatus();
      this.isPresetUpdate = false;
    });
  }

  ngOnInit(): void {
    this.individualConfigurationService.resetPresetAssetValues(this.sequencePresetData);
    this.sitecoreImageService.mediaAssets$.subscribe((mediaAssets) => {
      this.resetIconPath = mediaAssets?.ResetIcon ?? '';
      this.presetIconPath = mediaAssets?.RightSequencePresetIcon ?? '';
    });

    this.individualConfigurationService.sequencePresetData$.subscribe((data: PresetAssetData) =>{
        this.isCreatePresetEnabled = this.isPresetUpdate? !this.isPresetUpdate : data.isCreatePresetEnabled;
    });
  }

  newPresetForm = this.fb.group({
    presetName: [''],
  });
}
