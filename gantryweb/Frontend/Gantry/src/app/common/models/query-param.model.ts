export class QueryParamEvent{
    constructor(public key: string) {}
}

export class QueryParamMarkets{
    constructor(public keys: string) {}
}

export class QueryParamEventMarkets{
    constructor(public event: QueryParamEvent, public market: QueryParamMarkets) {}
}