export class RacingEvent {
    id:number;
    typeName: string;
    name:string;
    markets:Array<Market>;
    marketsWhichAreDropped: string = '';
    typeId:number;
    className:string;
    categoryCode:string; 
    startTime: string;
}

export class Market {
    name:string;
    id:string;
} 
