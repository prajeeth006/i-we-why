export interface PlayerAttributes {
    acknowledgement: { [key: string]: Attribute };
    vip: { [key: string]: Attribute };
}

export interface Attribute {
    updatedAt: number;
    value: any;
}
