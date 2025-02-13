import { Mock } from 'moxxi';

import { CommonMessages } from '../common-messages.client-config';

@Mock({ of: CommonMessages })
export class CommonMessagesMock extends CommonMessages {
    constructor() {
        super();
        this.Delete = 'Delete';
        this.Cancel = 'Cancel';
        this.Confirm = 'Confirm';
        this.Decline = 'Decline';
        this.LastSessionInfo = 'Your last session started at {0}';
        this.Decline = 'Decline';
        this.LoginDuration = 'Login duration';
        this.KeepPlaying = 'Keep playing';
        this.StopPlaying = 'Stop playing';
        this.Hours = 'hours';
        this.Minutes = 'min';
        this.PleaseWait = 'Please wait';
    }
}
