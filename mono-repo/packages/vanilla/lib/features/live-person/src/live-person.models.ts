export interface LivePersonChat {
    handlePushChatShowInvite: () => void;
    sendLivepersonEvent: (eventName: string, data: any, eventParams: any) => void;
    triggerSectionOpen: (section: string) => void;
    isLivePersonPushChatEnabled: boolean;
    loadScriptData: () => void;
}
