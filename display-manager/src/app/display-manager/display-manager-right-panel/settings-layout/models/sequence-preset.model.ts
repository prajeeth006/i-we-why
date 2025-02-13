export interface PresetData {
  Assets: Array<string> | null | undefined;
  Name: string | null;
  OrderId: number;
  TotalAssets: number;
}

export interface MarketDropdownList {
  id:string;
  name: string;
  marketId: string;
  isSelected: boolean;
}
export enum PresetTypes {
  system = 'System',
  custom = 'Custom',
}

export enum PresetStage {
  edit = 'edit',
  clone = 'clone',
  create = 'create',
}
