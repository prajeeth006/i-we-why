import { effect, inject, Injectable, signal } from '@angular/core';
import { LabelSelectorService } from 'src/app/display-manager/display-manager-header/label-selector/label-selector.service';
import { tap } from 'rxjs/operators';
import { ApiService } from 'src/app/common/api.service';
import { GantryLayout, ScreenData, ScreenInfo, SortedColumnScreenData, SortedRowScreensData, SortedScreensData } from '../models/individual-gantry-screens.model';
import { HttpParams } from '@angular/common/http';
import { MainTreeNode } from 'src/app/display-manager/display-manager-left-panel/tree-view/models/main-tree-node.model';
import { PresetAssetData, SelectedScreen, SequencePresetData } from '../models/sequence-preset';
import { Guid } from 'guid-typescript';
import { JsonUtilities } from 'src/app/helpers/json-utilities';
import { SequencencingHelperService } from 'src/app/display-manager/services/sequencencing-helper/sequencencing-helper.service';
import { BehaviorSubject } from 'rxjs';
import { SequencePresetService } from '../../settings-layout/services/sequence-preset.service';

@Injectable({
  providedIn: 'root'
})

export class IndividualConfigurationService {
  public individualGantryLayout: GantryLayout;
  private labelSelectorService = inject(LabelSelectorService);
  private apiService = inject(ApiService);
  private sequencencingHelperService = inject(SequencencingHelperService);
  // ex: "coral" | "ladbrokes" | ""
  _currentLabel = signal<string>("");
  // ex: ["21","3x3","4x4","5","5x1","5x5","6x6","DIGI-HUB"]
  _individualGantryLayoutTypes = signal<string[]>([]);
  // ex: "21" | "3x3" | "4x4" ....etc
  _currentLayoutType = signal<string>("");
  _individualTabCarouselSlides = signal<SortedScreensData[]>([]);
  sequencePresetData$: BehaviorSubject<PresetAssetData> = new BehaviorSubject<PresetAssetData>({} as PresetAssetData);
  initialPresetData$:BehaviorSubject<PresetAssetData> = new BehaviorSubject<PresetAssetData>({} as PresetAssetData);
  _gantryLayouts = signal<GantryLayout[]>([]);

  constructor(private sequencePresetService: SequencePresetService) {
    /**
     * @description this effect helps get list of layout types on label change
     */
    effect(() => {
      const currentLabel = this._currentLabel();
      if (!!currentLabel) {
        //this.getListOfIndividualGantryLayoutTypes(currentLabel)
        this.getAllIndividualTabGantryLayoutTypeDetails()
      }
    });

    /**
     * @description this effect helps get screens data when layout is selected/changed
     */
    effect(() => {
      const currentLayoutType = this._currentLayoutType();
      if (!!currentLayoutType) {
        this.getIndividualTabGantryLayoutTypeDetailsFromLocal(currentLayoutType)
      }
    },{ allowSignalWrites: true});
  }

  resetPresetAssetValues(sequencePresetData: PresetAssetData){
    sequencePresetData.presetData = this.sequencePresetService.populateForm([]);
    this.initialPresetData$.next(sequencePresetData);
  }

  initialize() {
    this.labelSelectorService.currentLabel$
      .pipe(
        tap((label: string) => {
          this._currentLabel.set(label)
        })
      )
      .subscribe();
  }

  getListOfIndividualGantryLayoutTypes(currentLabel: string) {
    let params = new HttpParams().append('currentLabel', currentLabel);
    this.apiService.get<string[]>("/sitecore/api/displayManager/getListOfIndividualTabGantryTypes", params)
      .subscribe((gantryTypes: string[]) => {
        this._individualGantryLayoutTypes.set(gantryTypes); //
        // if no layout type available consider first layout type
        const currentGantryLayoutType = this._currentLayoutType() ? this._currentLayoutType() : gantryTypes?.[0];
        this._currentLayoutType.set(currentGantryLayoutType);
      });
  }

  /**
   * @description get screens data based on the layoutType provided
   * @param layoutType ex: "21" | "3x3" | "4x4"
   */
  public getIndividualTabGantryLayoutTypeDetailsFromServer(layoutType: string) {
    if (!!layoutType) {
      let params = new HttpParams()
        .append('currentLabel', this._currentLabel())
        .append('gantryTypename', layoutType);

      this.apiService.get<GantryLayout>('/sitecore/api/displayManager/getIndividualTabGantryType', params)
        .subscribe((gantryTypeData: GantryLayout) => {
          let sortedGantryScreenData: SortedScreensData = new SortedScreensData();
          let sortedPeripheralScreenData: SortedScreensData = new SortedScreensData();
          if (!!gantryTypeData?.GantryType?.GantryTypeName &&
            !!gantryTypeData?.GantryType?.IndividualScreens &&
            !JsonUtilities.isEmptyObject(gantryTypeData?.GantryType?.IndividualScreens)) {
              let gantryType = this._gantryLayouts().find(x => x.GantryType.Name == layoutType);
            if(gantryType){
              gantryType.GantryType.SortedGantryScreenData = this.transformToVmScreenData(sortedGantryScreenData, gantryTypeData?.GantryType?.IndividualScreens?.GantryScreens);
              gantryType.GantryType.SortedPeripheralScreenData = this.transformToVmScreenData(sortedPeripheralScreenData, gantryTypeData?.GantryType?.IndividualScreens?.PeripheralScreens);
              this._gantryLayouts.set([...this._gantryLayouts(), gantryType])
            }
          } else {
          }
          this.getIndividualTabGantryLayoutTypeDetailsFromLocal(layoutType);
        })

    }
  }
  
  /**
   * @description get screens data based on the layoutType provided
   * @param layoutType ex: "21" | "3x3" | "4x4"
   */
  public getIndividualTabGantryLayoutTypeDetailsFromLocal(layoutType: string) {
    if (!!layoutType) {
      let gantryLayout  = this._gantryLayouts().find(x => x.GantryType?.Name == layoutType);
      if(gantryLayout?.GantryType?.SortedGantryScreenData && gantryLayout?.GantryType?.SortedPeripheralScreenData){
        this._individualTabCarouselSlides.set([gantryLayout?.GantryType?.SortedGantryScreenData, gantryLayout?.GantryType?.SortedPeripheralScreenData]);
      } else {
        this._individualTabCarouselSlides.set([new SortedScreensData(), new SortedScreensData()]);
      }
    }
  }
  
  /**
   * @description get screens data based on the layoutType provided
   * @param layoutType ex: "21" | "3x3" | "4x4"
   */
  public getAllIndividualTabGantryLayoutTypeDetails() {
      let params = new HttpParams()
        .append('currentLabel', this._currentLabel())

        this.apiService.get<GantryLayout[]>('/sitecore/api/displayManager/getAllIndividualTabGantryTypes', params)
        .subscribe((gantryTypeData: GantryLayout[]) => {

          gantryTypeData.forEach(gantryType => {
            let sortedGantryScreenData: SortedScreensData = new SortedScreensData();
            let sortedPeripheralScreenData: SortedScreensData = new SortedScreensData();
            if (!!gantryType?.GantryType?.GantryTypeName &&
              !!gantryType?.GantryType?.IndividualScreens &&
              !JsonUtilities.isEmptyObject(gantryType?.GantryType?.IndividualScreens)) {
                gantryType.GantryType.SortedGantryScreenData = this.transformToVmScreenData(sortedGantryScreenData, gantryType?.GantryType?.IndividualScreens?.GantryScreens);
                gantryType.GantryType.SortedPeripheralScreenData = this.transformToVmScreenData(sortedPeripheralScreenData, gantryType?.GantryType?.IndividualScreens?.PeripheralScreens);
            } else {
              gantryType.GantryType.SortedGantryScreenData = sortedGantryScreenData;
              gantryType.GantryType.SortedPeripheralScreenData = sortedPeripheralScreenData;
            }
          });
          this._gantryLayouts.set(gantryTypeData);
          let gantryTypes = gantryTypeData.map( x => x.GantryType.Name);
          this._individualGantryLayoutTypes.set(gantryTypeData.map( x => x.GantryType.Name)); 
          if(gantryTypes.length > 0){
            this._currentLayoutType.set(gantryTypes[0]);
          }
          
        })
    }

    public gantryLayoutTouched(){
      this._gantryLayouts.update((gantryLayouts) => {
        gantryLayouts.forEach(gantryLayout => {
          if(gantryLayout.GantryType.Name === this._currentLayoutType()){
            gantryLayout.GantryType.HaveTouched = true;
          }
          gantryLayout.GantryType.IsDirty = false;

          [gantryLayout.GantryType.SortedGantryScreenData, gantryLayout.GantryType.SortedPeripheralScreenData].forEach((sortedScreens: SortedScreensData) => {
            sortedScreens.rows.forEach(row => {
              row.columns.forEach(col => {
                if(!!col.screens){
                col.screens.forEach(subScreen => {
                  let screenDetails = this.GetScreenDetails(subScreen);
                  screenDetails.forEach(screen => {
                    if(!screen.IsTv && ((!screen.IsTouched && screen.NowPlaying == null) || (screen.IsTouched && screen.NewAssetToSave == null))){
                        gantryLayout.GantryType.IsDirty = true;
                    }
                  })
                  })
                }
              })
            });
          });
        });

        return [...gantryLayouts];
      });

    }

    public gantryLayoutReadOnlyView(isReadOnlyView: boolean){
      this._gantryLayouts.update((gantryLayouts) => {
        const index = gantryLayouts.findIndex(x => x.GantryType.Name === this._currentLayoutType());
        if (index !== -1) {
          gantryLayouts[index] = { 
            ...gantryLayouts[index], 
            GantryType: { 
              ...gantryLayouts[index].GantryType, 
              ReadOnlyView: isReadOnlyView 
            } 
          };
        }
        return [...gantryLayouts];
      });

    }

  public getActiveGantryLayout(){
    return this._gantryLayouts().find(x => x.GantryType.Name === this._currentLayoutType());
  }
  
  public isGantryTouched(){
    return !!this._gantryLayouts().find(x => x.GantryType.HaveTouched);
  }

  public isGantryDirty(){
    return !!this._gantryLayouts().find(x => x.GantryType.IsDirty);
  }

  public shouldShowLayoutChangeOption(coloumnScreens: ScreenData[]): boolean {
    return coloumnScreens.every((screen: ScreenData) => screen.HaveLayOutOption);
  }

  public prepareColumScreensData(row:number, column: number, screensData: ScreenData[][]) {
    var columnsData = new SortedColumnScreenData();
    columnsData.column = column;
    let columnScreens: ScreenData[] = screensData?.[row]?.filter(rowData => rowData?.Column == column);
    let sortedColumnScreens = columnScreens;

    if (columnScreens.length == 1) {
      columnsData.haveLayoutChangeOption = this.shouldShowLayoutChangeOption(columnScreens);
      columnsData.hasSubScreens = false;
    } else if (columnScreens.length > 1) {
      // this condition helps in identifying the special layout screens in 21 layout
      // special screens are always single screens & won't be having layoutchange option
      columnsData.haveLayoutChangeOption = false;
      columnsData.hasSubScreens = true;
      sortedColumnScreens = columnScreens.sort((a: ScreenData, b: ScreenData) => {
        return a.ScreenDetails.Single[0]?.SortOrder - b.ScreenDetails.Single[0]?.SortOrder
      });
    }

    columnsData.screens = sortedColumnScreens;
    return columnsData;
  }

  transformToVmScreenData(sortedScreenData: SortedScreensData, screensData: ScreenData[][]) {
    const maxRows = screensData?.length ?? 0;
    const maxColumns = screensData?.flat()?.reduce((max, currentRow) => Math.max(max, currentRow.Column), 0) ?? 0;
    sortedScreenData.maxRows = maxRows;
    sortedScreenData.maxColumns = maxColumns;
    sortedScreenData.rows = [];

    let finalRows: Array<SortedRowScreensData> = [];

    for (let row: number = 0; row < maxRows; row++) {
      let rowData = new SortedRowScreensData();
      rowData.row = row;
      rowData.columns = [];

      for (let column = 1; column <= maxColumns; column++) {
        const columnsData = this.prepareColumScreensData(row, column, screensData);
        rowData.columns.push(columnsData);
      }
      finalRows.push(rowData);
    }
    sortedScreenData.rows = finalRows;
    return sortedScreenData;
  }

  public CreateNewSequence(selectedScreens: string[], presetList: MainTreeNode[]) {
    let sequenceId: Guid = Guid.create()
    if (!this.individualGantryLayout.Sequences || this.individualGantryLayout.Sequences.length === 0) {
      this.individualGantryLayout.Sequences = [];
    }

    let sequenceSelectedScreens: SelectedScreen[] = []
    const presetListDeepCopy = JSON.parse(JSON.stringify(presetList));
    selectedScreens.map((selectedScreen, index) => {
      if (!!this.individualGantryLayout?.GantryType?.IndividualScreens && this.individualGantryLayout?.GantryType?.IndividualScreens?.GantryScreens?.length > 0) {
        this.individualGantryLayout?.GantryType?.IndividualScreens?.GantryScreens?.forEach((row) => {
          row.forEach((screen) => {
            const screenDetails = this.GetScreenDetails(screen);
            screenDetails.forEach((screenDetail) => {
              if (screenDetail.DisplayName == selectedScreen) {
                screenDetail.SequenceId = sequenceId.toString();
                screenDetail.NowPlaying = presetListDeepCopy.shift();
                const selectedScreen: SelectedScreen = {
                  ScreenNumber: screen.ScreenNumber,
                  ScreenType: screen.ScreenType,
                  ViewId: screenDetail.ViewId,
                  Order: index + 1
                }
                sequenceSelectedScreens.push(selectedScreen);
              }
            })
          })
        })
      }
    })
    this.individualGantryLayout?.Sequences?.push(this.prepareSequenceData(sequenceSelectedScreens, sequenceId));
    // After Add Sequence completes 'Master' & 'Settings' will be in enabled state
    this.sequencencingHelperService.setSequenceJourneyStatus(false);
  }


  public GetScreenDetails(screen: ScreenData): ScreenInfo[] {
    switch (screen?.ScreenType?.toLowerCase()) {
      case 'single':
        return screen.ScreenDetails.Single
      case 'duo1':
        return screen.ScreenDetails.Duo1
      case 'trio1':
        return screen.ScreenDetails.Trio1
      case 'trio2':
        return screen.ScreenDetails.Trio2
      case 'quad':
        return screen.ScreenDetails.Quad
      default:
        return screen.ScreenDetails.Single
    }
  }
  
  private prepareSequenceData(selectedScreens: SelectedScreen[], sequenceId: Guid): SequencePresetData {
    var sequencePreset: SequencePresetData = {
      SequenceId: sequenceId.toString(),
      PresetId: '',
      SelectedScreens: selectedScreens,
      GantryType: this.individualGantryLayout?.GantryType?.Name,
      UserSavedSequenceDateNTime: ''
    };
    return sequencePreset;
  }

}
