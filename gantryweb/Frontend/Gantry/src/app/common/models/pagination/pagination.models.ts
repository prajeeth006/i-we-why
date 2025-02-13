export class PaginationContent {
    pageNumber: number = 0;
    totalPages: number = 0;
    paginationText: string;
    startIndex: number = 0;
    endIndex: number = 0;
    currentPageNumber: number = 0;
    pageSize: number;

}

export enum PageSizes {
    Three = 3,
    Four = 4,
    Five = 5,
    Six = 6,
    Nine = 9,
    Ten = 10,
    eleven = 11,
    Fourteen = 14,
    Sixteen = 16

};

export enum StandardPageInterval {
    defaultPageTime = 7000 // 1 second is 1000 ml
}