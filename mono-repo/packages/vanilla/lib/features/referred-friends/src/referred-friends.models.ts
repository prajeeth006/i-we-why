export interface ReferredFriends {
    friends: ReferredFriend[];
}

export interface ReferredFriend {
    emailContact: EmailContact;
    referredChannel: string;
    isDisqualified: boolean;
    rewards: ReferReward[];
    status: string;
}

export interface EmailContact {
    emailId: string;
    firstName: string;
    lastName: string;
}

export interface ReferReward {
    bonusAmount: number;
    currencyCode: string;
    currencySymbol: string;
}

export interface BonusNotificationMessage {
    bonusAmount: number;
    depositAmount?: number;
    username: string;
}

export interface InvitationUrl {
    url: string;
}

export enum ReferStatus {
    DEPOSITED = 'DEPOSITED',
    QUALIFIED = 'QUALIFIED',
    REGISTERED = 'REGISTERED',
}
