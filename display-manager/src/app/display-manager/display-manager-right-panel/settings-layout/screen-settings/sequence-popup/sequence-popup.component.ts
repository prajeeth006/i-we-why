import {
  CdkDrag,
  CdkDragHandle,
} from '@angular/cdk/drag-drop';
import { Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormField, MatSelectModule } from '@angular/material/select';
import { SitecoreImageService } from 'src/app/display-manager/display-manager-left-panel/services/sitecore-image/sitecore-image.service';
import { SequencePresetService } from '../../services/sequence-preset.service';
import { LabelSelectorService } from 'src/app/display-manager/display-manager-header/label-selector/label-selector.service';
import { SharedModule } from 'src/app/shared-module';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { TemplateTypes } from '../../../models/TemplateTypes';
import { PresetAssetNamePipe } from '../../../filters/assetname/presetassetname.pipe';
import { CommonModule } from '@angular/common';
import { Asset, CreatePresetModel } from '../../../models/CreatePresetModel';
import { MarketDropdownList, PresetStage } from '../../models/sequence-preset.model';
import { Constants } from '../../../constants/constants';
import { IndividualConfigurationService } from '../../../individual-layout/services/individual-configuration.service';
import { ProfileConstants } from '../../../profiles/constants/profile-constants';
import { PresetAssetsTableComponent } from 'src/app/display-manager/shared-html/preset-assets-table/preset-assets-table.component';
import { DialogueComponent } from 'src/app/common/dialogue/dialogue.component';
import { PresetAssetData } from '../../../individual-layout/models/sequence-preset';

@Component({
  selector: 'app-sequence-model-popup',
  templateUrl: './sequence-popup.component.html',
  styleUrls: ['./sequence-popup.component.scss'],
  standalone: true,
  imports: [
    CdkDrag,
    CdkDragHandle,
    MatFormFieldModule,
    MatDialogModule,
    MatIconModule,
    MatFormField,
    MatInputModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    CommonModule,
    PresetAssetsTableComponent
  ],
  providers: [PresetAssetNamePipe],
})
export class SequencePresetModelPopUpComponent {
  @ViewChild(PresetAssetsTableComponent) presetAssetsComponent!: PresetAssetsTableComponent;
  presetConstants = Constants
  dialogHeaderTitle: string = ProfileConstants.newSequenceTitle;
  resetIconPath: string;
  isCreatePresetEnabled: boolean = false;
  currentLabel: string;
  sequencePresetForm: FormGroup;
  presetListItemDrop: string = 'presetListItemDrop';
  messageTitle: string = ProfileConstants.screenSettingSequenceTitle;
  templateTypes = TemplateTypes;
  templateTypesList: string[] = Object.values(TemplateTypes);
  markets: MarketDropdownList[] = [];
  presetStage = PresetStage;
  stage: string = this.presetStage.create;
  copyIcon: string | undefined;
  originalData: any;
  searchControl: FormControl;
  sequencePresetData: PresetAssetData = new PresetAssetData();
  createSaveActionButton: string = ProfileConstants.createPreset;
  constructor(
    private sitecoreImageService: SitecoreImageService,
    private sequencePresetService: SequencePresetService,
    private labelSelectorService: LabelSelectorService,
    private fb: UntypedFormBuilder,
    private individualConfigurationService: IndividualConfigurationService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<SequencePresetModelPopUpComponent>,
    public dialog: MatDialog,
  ) {
    this.searchControl = this.fb.control('');

    this.labelSelectorService.currentLabel$.subscribe(
      (currentLabel: string) => {
        this.currentLabel = currentLabel;
      },
    );
    this.individualConfigurationService.resetPresetAssetValues(this.sequencePresetData);
    this.originalData = this.data;
    if (this.data?.stage == this.presetStage.edit) {
      this.dialogHeaderTitle = ProfileConstants.editSequenceTitle;
      this.createSaveActionButton = ProfileConstants.save;
      this.initializeData();
    } else if (this.data?.stage == this.presetStage.clone) {
      this.dialogHeaderTitle = ProfileConstants.copySequenceTitle;
      this.initializeData();
    }
  }

  initializeData() {
    this.stage = this.data.stage;
    this.sequencePresetData.presetData = this.data;
    this.sequencePresetData.isCreatePresetEnabled = this.isCreatePresetEnabled;
    this.individualConfigurationService.initialPresetData$.next(this.sequencePresetData);
    this.populatePresetForm(this.data);
  }

  ngOnInit(): void {
    this.sitecoreImageService.mediaAssets$.subscribe((mediaAssets) => {
      this.resetIconPath = mediaAssets?.ResetIcon ?? '';
      this.copyIcon = mediaAssets?.CopyIcon;
    });
    this.individualConfigurationService.sequencePresetData$.subscribe((data: any) => {
      this.isCreatePresetEnabled = data.isCreatePresetEnabled;
    });
  }

  ngAfterViewInit() {
    this.initialFormStatus();
  }

  initialFormStatus(){
    this.isCreatePresetEnabled = false;
    this.newPresetForm.markAsPristine();
    this.newPresetForm.markAsUntouched();
  }

  newPresetForm = this.fb.group({
    presetName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9-_ ]+$/), this.presetNameExistsValidator(this.data?.presetNames),],],
  });

  resetSequence() {
    this.populatePresetForm(this.originalData);
    this.presetAssetsComponent.resetPreset();
    this.initialFormStatus();
  }

  cancelSequence() {
    this.individualConfigurationService.resetPresetAssetValues(this.sequencePresetData);
  }

  createPreset(): void {
    const formValues = this.newPresetForm.value;
    const trimmedPresetName = this.newPresetForm.get('presetName')?.value.trim();
    if (!trimmedPresetName) {
      return;
    }
    const rows = formValues.presetListRow;
    const presetList: CreatePresetModel = this.prepareNewPresetList(
      rows,
      trimmedPresetName,
    );
    this.sequencePresetService
      .saveSequencePreset(this.currentLabel, presetList)
      .subscribe({
        next: (response: any) => {
          if (response.IsSuccess) {
            this.dialogRef.close(this.presetConstants.preset_dialog_save);
          }
          else {
            this.dialog.open(DialogueComponent, { data: { message: response.ErrorMessage } });
          }
        },
        error: (err) => {
          this.dialog.open(DialogueComponent, { data: { message: err } });
        }
      });
  }

  prepareNewPresetList(data: any[], presetName: string): CreatePresetModel {
    const presetSettingsCount = (this.data?.presetNames?.length ?? 0) + 1; // Increment preset settings count

    // Map the input data to create assets
    const assets: Asset[] = data.map((item) => {
      const marketSelectedOption = item?.marketSelectedOption?.replace(
        /\//g,
        'or',
      );

      let selectedMarket = item?.markets?.filter((market: any) => market.name == marketSelectedOption);
      if (selectedMarket && selectedMarket.length > 0) {
        selectedMarket[0].isSelected = true;
        selectedMarket[0].marketId = selectedMarket[0].id;

      }
      // Return the constructed Asset object
      return {
        eventId: item.racingEvent?.id ?? item.eventId,
        eventName: item?.eventName || '',
        category: item.categoryCode || '',
        displayOrder: item.displayOrder || 0,
        isResulted: item.isResulted,
        market: selectedMarket,
        templateTypeQuad: [
          {
            name: item.templateQuadType,
            isSelected: true,
          },
        ],
        templateTypeHalf: [
          {
            name: item.templateHalfType,
            isSelected: true,
          },
        ],
      };
    });

    // Return the constructed GantryModel
    return {
      sequencePresetId: this.data.sequencePresetId,
      name: presetName || '',
      orderNo: presetSettingsCount || 0,
      type: '',
      gantryType: [''], // Default value
      assets: assets,
    };
  }

  populatePresetForm(presetData: any): void {
    if (presetData) {
      this.newPresetForm.patchValue({
        presetName: presetData?.value?.presetName || '',
      });

      if (presetData?.disableType) {
        this.newPresetForm.get('presetName')?.disable();
      }
    }
  }

  presetNameExistsValidator(existingNames: string[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const name = control.value?.trim();
      if (!name) {
        return { required: true };
      }
      if (existingNames?.includes(name)) {
        return { presetNameExists: true };
      }
      return null;
    };
  }

  getPresetNameError(): string | null {
    const control = this.newPresetForm.get('presetName');
    if (control?.touched || control?.dirty) {
      if (control?.hasError('required')) {
        return this.presetConstants.preset_name_required;
      }
      if (control?.hasError('presetNameExists')) {
        return this.presetConstants.preset_name_exists;
      }
      if (control?.hasError('pattern')) {
        return this.presetConstants.fine_name_error;
      }
    }
    return null;
  }
}
