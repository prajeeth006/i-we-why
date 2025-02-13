
import { SportContentParameters } from "src/app/common/models/sport-content/sport-content-parameters.model";

  
export class FootBallContentParams extends SportContentParameters {
}

export class HomeDrawAwayResult {
  content: FootBallContentParams;
  homeDrawAwayEvent: Array<HomeDrawAway>;
  marketName?: string;
  categoryName?: string;
  eventDateTimeInputValue:string;
}

export class HomeDrawAway {
  eventName: string;
  eventTime: string;
  eventDateTime?: Date;
  homeSelection: HomeDrawAwaySelection;
  drawSelection: HomeDrawAwaySelection;
  awaySelection: HomeDrawAwaySelection
}

export class HomeDrawAwaySelection {
  selectionName: string;
  price: string;
}
