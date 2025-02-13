export interface IMultiEventTabs {
    tabName: string;
    eventType: string;
    eventFormData: any;
    defaultFormData: any;
    savedData: any;
  }

export interface SelectedItem {
  name: string;
}

export interface ManualInitializingForm {
  isSaved: boolean;
  name: string;
  id: string;
  targetid: string;
  isResulted: boolean;
  raceoffState: number;
  data: any;
}
