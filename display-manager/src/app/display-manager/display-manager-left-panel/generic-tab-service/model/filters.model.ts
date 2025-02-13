import { FilterEvents } from "./filter-events.enum";
import { FilterRacingCategories } from "./filter-racingcategories.enum";

export class Filters {
    dateFrom: string = FilterEvents.Next15;
    dateTo: string;
    antePost: boolean = false;
    isOutRight: boolean = false;
    markets: string;
    racingCategoryFilter: string = FilterRacingCategories.Horses;
    isNext15 : boolean = false;
    isVirtual: boolean = false;
    isHorses: boolean = false;
    isGreyHounds: boolean = false;
    selectedRacingFilterIndex : number = 0;
    selectedFilterIndex: number = 0;
    excludedTypes: string;
    excludeEventIds: string;
}

export class PrepareGantryUrl {
    targetItemID?: string;
}

export class PrepareGantryPreviewAssetNewUrl{
    targetItemID?:string;
}