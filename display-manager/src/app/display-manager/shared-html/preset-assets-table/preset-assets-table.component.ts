import {
  CdkDrag,
  CdkDragDrop,
  CdkDragHandle,
  CdkDropList,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { Component, Input } from '@angular/core';
import {
  FormArray,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
} from '@angular/forms';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SharedModule } from 'src/app/shared-module';
import { TemplateTypes } from '../../display-manager-right-panel/models/TemplateTypes';
import { MainTreeNode } from '../../display-manager-left-panel/tree-view/models/main-tree-node.model';
import { DefaultToggleNodes } from '../../display-manager-left-panel/generic-tab-service/model/default-toggle-node.enum';
import { PresetAssetNamePipe } from '../../display-manager-right-panel/filters/assetname/presetassetname.pipe';
import { IndividualConfigurationService } from '../../display-manager-right-panel/individual-layout/services/individual-configuration.service';
import { SitecoreImageService } from '../../display-manager-left-panel/services/sitecore-image/sitecore-image.service';
import { NgClass } from '@angular/common';
import { PresetAssetData } from '../../display-manager-right-panel/individual-layout/models/sequence-preset';
import {
  NodeOptions,
  NodeProperties,
} from '../../display-manager-left-panel/tree-view/models/tree-node.model';
import { MarketDropdownList } from '../../display-manager-right-panel/settings-layout/models/sequence-preset.model';
import { AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { MarketNameFormatPipe } from 'src/app/common/pipes/market-name-format.pipe';

@Component({
  selector: 'app-preset-assets-table',
  standalone: true,
  imports: [
    CdkDrag,
    CdkDragHandle,
    CdkDropList,
    MatIconModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatFormField,
    SharedModule,
    NgClass,
    FormsModule,
    ReactiveFormsModule,
    MarketNameFormatPipe,
  ],
  templateUrl: './preset-assets-table.component.html',
  styleUrl: './preset-assets-table.component.scss',
})
export class PresetAssetsTableComponent implements AfterViewInit {
  @Input() parentFormgroup!: FormGroup;
  @Input() messageTitle: string = '';
  sequencePresetData: PresetAssetData = new PresetAssetData();
  searchControl: string;
  templateTypes = TemplateTypes;
  templateTypesList: string[] = Object.values(TemplateTypes);
  presetListItemDrop: string = 'presetListItemDrop';
  markets: MarketDropdownList[] = [];
  originalData: any;
  hamburgerIconPath: string | undefined;
  ismodified: boolean;
  filteredAssetList: any;

  constructor(
    private fb: UntypedFormBuilder,
    private presetAssetNamePipe: PresetAssetNamePipe,
    private individualConfigurationService: IndividualConfigurationService,
    private sitecoreImageService: SitecoreImageService,
  ) {
    this.sitecoreImageService.mediaAssets$.subscribe((mediaAssets) => {
      this.hamburgerIconPath = mediaAssets?.HamburgerIcon;
    });
  }

  @ViewChild('tableBody', { static: false }) tableBody!: ElementRef;

  ngAfterViewInit() {
    this.scrollToActiveAssets();
  }

  hideGreyedOutAssets() {
    const tableBody = this.tableBody?.nativeElement as HTMLElement;
    if (!tableBody) return;

    const firstNonResultedRow = tableBody.querySelector(
      '.tb-row:not(.resulted-row)',
    ) as HTMLElement;

    if (firstNonResultedRow) {
      const bodyRect = tableBody.getBoundingClientRect();
      const rowRect = firstNonResultedRow.getBoundingClientRect();

      if (rowRect.top < bodyRect.top || rowRect.bottom > bodyRect.bottom) {
        firstNonResultedRow.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    }
  }

  scrollToActiveAssets() {
    setTimeout(() => this.hideGreyedOutAssets(), 300);
  }

  addNewPresetItem($event: any) {
    if ($event?.event) {
      const event = $event?.event;
      const category = event?.categoryCode?.toLowerCase();

      if (
        this.isScrollingOrRunnerCount(event?.assetType) &&
        this.isHorseOrGreyhoundEvent(category)
      ) {
        this.presetListRow.push(this.addAssetsInPresetList($event));
        this.updateSerialNumbers();
        this.sortAndUpdateFormArray();
      }

      this.enableSearchControl();
      this.presetListRow.markAsDirty();
      this.assignPresetRowData();
    }
  }

  resetPreset() {
    this.populatePresetForm(this.originalData);
    this.updateSerialNumbers();
    this.newPresetForm.markAsPristine();
    this.newPresetForm.markAsUntouched();
    this.sortAndUpdateFormArray();
    this.assignPresetRowData();
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.presetListRow.controls,
      event.previousIndex,
      event.currentIndex,
    );
    this.changePositionSerialNumbers();
    this.sortAndUpdateFormArray();
    this.assignPresetRowData();
  }

  deletePresetItem(displayOrder: number) {
    let assetIndex = this.presetListRow.controls.findIndex(
      (x) => x.value.displayOrder == displayOrder,
    );
    if (assetIndex > -1) {
      this.presetListRow.removeAt(assetIndex);
      this.enableSearchControl();
      this.presetListRow.markAsDirty();
    }
    this.updateSerialNumbers();
    this.sortAndUpdateFormArray();
    this.assignPresetRowData();
  }
  
  updateSerialNumbers() {
    this.presetListRow.controls.sort((a, b) => a.value.displayOrder - b.value.displayOrder);
    const occupiedOrders = new Set<number>();
    const nonResultedControls: any[] = [];
    
    this.presetListRow.controls.forEach((control) => {
        nonResultedControls.push(control);
    });

    this.updateDisplayOrder(nonResultedControls, occupiedOrders);
  }
  
  changePositionSerialNumbers() {
    const occupiedOrders = new Set<number>();
    const nonResultedControls: any[] = [];

    this.presetListRow.controls.forEach((control) => {
      if (control.value.isResulted) {
        occupiedOrders.add(control.value.displayOrder);
      } else {
        nonResultedControls.push(control);
      }
    });

    this.updateDisplayOrder(nonResultedControls, occupiedOrders);
  }
  
  updateDisplayOrder(nonResultedControls: any[], occupiedOrders: Set<number>) {
    let order = 1;
    for (const control of nonResultedControls) {
      while (occupiedOrders.has(order)) order++; // Skip resulted event displayOrder values
      control.patchValue({ displayOrder: order });
      occupiedOrders.add(order);
      order++;
    }

    this.presetListRow.markAsDirty();
  }

  isScrollingOrRunnerCount(assetType: string): boolean {
    const templateType = assetType?.toLowerCase();
    return (
      templateType === TemplateTypes.Scrolling?.toLowerCase() ||
      templateType === TemplateTypes.Runnercount?.toLowerCase()
    );
  }

  isHorseOrGreyhoundEvent(categoryCode: string): boolean {
    const category = categoryCode?.toLowerCase();
    return (
      category === DefaultToggleNodes.HorseRacing?.toLowerCase() ||
      category === DefaultToggleNodes.GreyHounds?.toLowerCase() ||
      category === DefaultToggleNodes.HorseRacingSpace?.toLowerCase()
    );
  }

  addAssetsInPresetList(droppedItem: any) {
    const formValues = this.parentFormgroup.value;
    const rows = formValues.presetListRow;
    const order = rows?.length + 1;
    let marketSelection: any;
    let marketNames = [];

    if (droppedItem?.event?.markets) {
      this.markets = droppedItem?.event?.markets.map(
        (market: MarketDropdownList) => ({
          id: market.id,
          name: market.name,
        }),
      );
    }

    if (droppedItem?.event?.marketsWhichAreDropped) {
      marketNames = droppedItem.event?.marketsWhichAreDropped.split('|');
    } else if (droppedItem?.event?.marketSelectedOption) {
      marketNames = droppedItem.event?.marketSelectedOption.split('|');
    }

    if (marketNames.length > 0) {
      const targetMarketName = marketNames[1] || marketNames[0]; // Use the second name if available, otherwise the first
      marketSelection = this.markets.filter(
        (market) => market.name === targetMarketName,
      )[0];
    }

    return this.fb.group({
      eventId: [droppedItem?.event?.eventId],
      eventName: [this.presetAssetNamePipe.transform(droppedItem.event) ?? ''],
      categoryCode: [droppedItem?.event?.categoryCode ?? ''],
      racingEvent: [droppedItem.event],
      label: [this.sequencePresetData.currentLabel ?? null],
      marketSelectedOption: [marketSelection?.name],
      templateHalfType: [
        droppedItem?.event?.assetType ?? droppedItem?.event?.templateHalfType,
      ],
      templateQuadType: [
        droppedItem?.event?.assetType ?? droppedItem?.event?.templateQuadType,
      ],
      markets: [this.markets],
      displayOrder: [order],
      presetName: [''],
      isResulted: [droppedItem?.event?.isResulted ?? false],
    });
  }

  newPresetForm = this.fb.group({
    presetListRow: this.fb.array([]),
  });

  get presetListRow(): FormArray {
    return this.newPresetForm.get('presetListRow') as FormArray;
  }

  sortAndUpdateFormArray(): void {
    const sortedControls = [...this.presetListRow.controls].sort(
      (a: any, b: any) => {
        const isResultedA = a.value.isResulted ? 1 : 0;
        const isResultedB = b.value.isResulted ? 1 : 0;
        return isResultedB - isResultedA;
      },
    );

    while (this.presetListRow.length > 0) {
      this.presetListRow.removeAt(0);
    }

    sortedControls.forEach((control) => this.presetListRow.push(control));
  }

  populatePresetForm(presetData: any): void {
    if (presetData) {
      this.newPresetForm.patchValue({
        presetName: presetData?.value?.presetName || '',
      });

      if (presetData?.disableType) {
        this.newPresetForm.get('presetName')?.disable();
      }

      this.presetListRow.clear();
      presetData?.value?.presetListRow?.forEach((asset: any, index: number) => {
        ['templateHalfType', 'templateQuadType'].forEach((type) => {
          asset[type] =
            asset?.[type]?.toLowerCase() === 'runner count'
              ? TemplateTypes.Runnercount
              : asset?.[type];
        });

        const newRow = this.addAssetsInPresetList({} as MainTreeNode);

        newRow.patchValue({
          eventId: asset?.eventId,
          eventName: asset?.eventName || '',
          categoryCode: asset?.categoryCode || '',
          marketSelectedOption: asset?.marketSelectedOption || '',
          templateHalfType: asset?.templateHalfType,
          templateQuadType: asset?.templateQuadType,
          markets: asset?.markets,
          displayOrder: asset?.displayOrder ?? index + 1,
          isResulted: asset?.isResulted,
        });
        this.presetListRow.push(newRow);
      });
      this.sortAndUpdateFormArray();
    }
  }  

  ngOnInit() {
    Object.keys(this.newPresetForm.controls).forEach((control) =>
      this.parentFormgroup.addControl(
        control,
        this.newPresetForm.get(control)!,
      ),
    );

    this.parentFormgroup.valueChanges.subscribe((data) => {
      const presetName = this.parentFormgroup.get('presetName');
      const trimmedPresetName =
        presetName?.value?.Name?.trim() || presetName?.value?.trim();
      const formRows = data.presetListRow;
      const isNonResultedExists = formRows.filter(
        (row: { isResulted: any }) => !row.isResulted,
      );
      this.sequencePresetData.isCreatePresetEnabled =
        isNonResultedExists.length > 0 &&
        !!trimmedPresetName &&
        this.newPresetForm.valid &&
        this.presetListRow.length > 0;
      this.individualConfigurationService.sequencePresetData$.next(
        this.sequencePresetData,
      );
    });

    this.individualConfigurationService.sequencePresetData$.subscribe(
      (data: any) => {
        if (data?.presetData) {
          this.sequencePresetData = data;
        }
      },
    );

    this.individualConfigurationService.initialPresetData$.subscribe(
      (data: any) => {
        if (data?.presetData) {
          this.sequencePresetData = data;
          this.originalData = this.sequencePresetData.presetData;
          this.populatePresetForm(this.sequencePresetData.presetData);
          this.updateSerialNumbers();
          this.sortAndUpdateFormArray();
          this.assignPresetRowData();
        }
      },
    );
  }

  onSearchKeyChange(): void {
    this.filterPresetItems(this.searchControl);
  }
  filterPresetItems(searchText: string): void {
    if (!searchText) {
      this.resetPresetListRowOnEmptySearch();
      return;
    }

    const lowerSearchText = searchText.toLowerCase();
    this.filteredAssetList = this.presetListRow.controls.filter(
      (x: any) =>
        x.controls.eventName?.value?.toLowerCase().includes(lowerSearchText),
    );
  }

  resetPresetListRowOnEmptySearch(): void {
    this.filteredAssetList = [...this.presetListRow.controls];
  }

  prepareFormDataInput(input: any) {
    const inputRequest = {
      event: input.value ?? input?.value?.racingEvent,
      nodeProperties: new NodeProperties(),
      nodeOptions: new NodeOptions(),
    };

    return inputRequest;
  }

  assignPresetRowData() {
    this.filteredAssetList = [...this.presetListRow.controls];
  }

  enableSearchControl() {
    this.isSearchDisabled();
  }

  isSearchDisabled(): boolean {
    const allAssetsCount = this.presetListRow?.controls?.length || 0;
    const resultedAssetsCount =
      this.presetListRow?.controls?.filter((x) => x.value.isResulted)?.length ||
      0;
    return (
      allAssetsCount > 0 &&
      resultedAssetsCount === allAssetsCount &&
      !this.searchControl
    );
  }
}
