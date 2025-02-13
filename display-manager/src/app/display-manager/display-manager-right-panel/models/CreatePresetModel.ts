export class CreatePresetModel {
  sequencePresetId: string;
  name: string;
  orderNo: number;
  type: string;
  gantryType: string[];
  assets: Asset[];
}

export class Asset {
  eventId: number;
  eventName: string;
  category: string;
  displayOrder: number;
  isResulted: boolean;
  market: Market[];
  templateTypeQuad: TemplateType[];
  templateTypeHalf: TemplateType[];
}

export class Market {
  name: string;
  marketId: number;
  isSelected: boolean;
}

export class TemplateType {
  name: string;
  isSelected: boolean;
}