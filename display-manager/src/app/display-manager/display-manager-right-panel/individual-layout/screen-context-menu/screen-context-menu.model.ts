import { ScreenInfo } from "../models/individual-gantry-screens.model";

export interface IndividualScreenMenu {
    itemName: string;
    id: string;
    isContentSaved? : boolean; 
    isCarouselExists? : boolean; 
    data?: ScreenInfo;
  }
  