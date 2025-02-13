import { ProfileScreen } from "./profile";

export class SortedRows{

  row:number;
  columns : Array<SortedColumns>;

}

export class SortedColumns{

  column : number;
  screens: Array<ProfileScreen>;
}

export class SortedScreens{
  maxRow:number;
  maxColumn: number;

  rows: Array<SortedRows>;
}
