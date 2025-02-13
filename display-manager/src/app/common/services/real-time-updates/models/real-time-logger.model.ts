export enum UserTypes {
    Publisher = "PUBLISHER",
    Subscriber = "SUBSCRIBER",
    Default = "DEFAULT"
}

export enum UserActions {
    ProfileChange = "PROFILE_CHANGE",
    SaveChanges = "SAVE_CHANGES",
    ActivateProfile = "ACTIVATE_PROFILE",
    PageLoad = "PAGE_LOAD",
    ResetChanges = "RESET_CHANGES",
    DragAndDropAsset = "DRAG_AND_DROP_ASSET",
    CreateOrEditCarousel = "CREATE_OR_EDIT_CAROUSEL",
    RemoveContentAndShiftAssetsLeft = "REMOVE_CONTENT_AND_SHIFT_ASSETS_LEFT",
    ChangeLabel = "CHANGE_LABEL",
    None = "NONE",
    SwitchTab = "SWITCH_TAB",
    MasterToggle = "MASTER_TOGGLE"
}

export enum RealTimeActions {
    ProcessRealTimeUpdates = "PROCESS_REAL_TIME_UPDATES",
    ProfileDropdownUpdateFromRealTime = "PROFILE_DROPDOWN_UPDATE_FROM_REAL_TIME",
}

export enum RealTimeEventKeys {
    SaveComplete = "savecomplete",
    MasterToggle = "mastertoggle"
}
