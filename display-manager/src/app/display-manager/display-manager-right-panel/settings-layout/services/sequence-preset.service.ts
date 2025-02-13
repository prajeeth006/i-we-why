import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiService } from 'src/app/common/api.service';
import { CreatePresetModel } from '../../models/CreatePresetModel';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MarketDropdownList, PresetData } from '../models/sequence-preset.model';
import { Constants } from '../../constants/constants';

@Injectable({
  providedIn: 'root',
})
export class SequencePresetService {
  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
  ) { }

  saveSequencePreset(label: string, presetObj: CreatePresetModel) {
    return this.apiService.post(
      `/sitecore/api/displayManager/preset/savePreset/${label}`,
      presetObj,
    );
  }

  deleteSequencePreset(label: string, sequencePresetId: string) {
    return this.apiService.delete(
      `/sitecore/api/displayManager/preset/deletePreset/${label}/${sequencePresetId}`,
    );
  }

  getSequencePreset(label: string, sequencePresetId: string) {
    return this.apiService.get<PresetData>(
      `/sitecore/api/displayManager/preset/getPresetDetails/${label}/${sequencePresetId}`,
    );
  }

  getPresetList(label: string) {
    return this.apiService.get(
      `/sitecore/api/displayManager/preset/getPresetList/${label}`,
    );
  }

  initializeForm(name: string): FormGroup {
    return this.fb.group({
      presetName: [name], // Form control for preset name
      presetListRow: this.fb.array([]), // Form array for dynamic rows
    });
  }

  createPresetRow(data: any): FormGroup {
    return this.fb.group({
      eventId: [data.eventId || 0],
      displayOrder: [data.displayOrder || 0],
      eventName: [data.event || ''],
      categoryCode: [data.category || ''],
      marketSelectedOption: [data.marketSelectedOption || ''],
      markets: [data.markets],
      templateHalfType: [data.templateHalfType],
      templateQuadType: [data.templateQuadType],
      isResulted: [data.isResulted],
    });
  }

  populateForm(presetData: any): FormGroup {
    const form = this.initializeForm(presetData.Name);
    const rows = presetData.Assets?.map((asset: any) =>
      this.createPresetRow({
        eventId: asset.EventId,
        displayOrder: asset.DisplayOrder,
        event: asset.EventName,
        category: asset.Category,
        marketSelectedOption: asset.Market.filter((market: any) => market.IsSelected && market.Name !== Constants.win_or_each_way)[0]?.Name || Constants.win_or_each_way,
        markets: asset.Market.map((market: any) => ({
          id: market.MarketId,
          name: market.Name,
          isSelected: market.IsSelected
        })),
        templateHalfType: asset.TemplateTypeHalf?.find(
          (t: { IsSelected: any }) => t.IsSelected,
        )?.Name,
        templateQuadType: asset.TemplateTypeQuad?.find(
          (t: { IsSelected: any }) => t.IsSelected,
        )?.Name,
        isResulted: asset.IsResulted,
      }),
    );
    rows?.forEach((row: any) => {
      (form.get('presetListRow') as FormArray).push(row);
    });

    return form;
  }
}
