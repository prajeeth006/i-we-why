import { Injectable } from '@angular/core';

import { PaginationContent } from '../models/pagination/pagination.models';

@Injectable({
    providedIn: 'root',
})
export class PaginationService {
    prevCount: number = 0;
    previousTimer: number;
    constructor() {}

    paginationSetup(paginationContent: PaginationContent, selectionsLength: number, haveToMoveNextPage: boolean = true) {
        paginationContent.totalPages = Math.ceil(selectionsLength / paginationContent.pageSize);
        if (selectionsLength > paginationContent.pageSize) {
            if (paginationContent.currentPageNumber == 0 || paginationContent.currentPageNumber > paginationContent.totalPages) {
                paginationContent.currentPageNumber = 1;
            } else if (paginationContent.currentPageNumber == paginationContent.totalPages) {
                if (haveToMoveNextPage) paginationContent.currentPageNumber = 1;
            } else {
                if (haveToMoveNextPage) paginationContent.currentPageNumber++;
            }
        } else {
            paginationContent.currentPageNumber = 1;
        }
        paginationContent.pageNumber = paginationContent.currentPageNumber;
        paginationContent.paginationText = this.getFooterText(paginationContent.pageNumber, paginationContent.totalPages);
        paginationContent.startIndex = (paginationContent.pageNumber - 1) * paginationContent.pageSize;
        paginationContent.endIndex = paginationContent.pageNumber * paginationContent.pageSize;
    }

    calculateTotalPages(paginationContent: PaginationContent, selectionsLength: number) {
        paginationContent.totalPages = Math.ceil(selectionsLength / paginationContent.pageSize);
        paginationContent.paginationText = this.getFooterText(paginationContent.pageNumber, paginationContent.totalPages);
    }

    darkThemePaginationSetup(paginationContent: PaginationContent, selectionsLength: number, haveToMoveNextPage: boolean = true) {
        this.paginationSetup(paginationContent, selectionsLength, haveToMoveNextPage);
        paginationContent.paginationText = this.getNewDesignFooterText(paginationContent.pageNumber, paginationContent.totalPages);
    }

    darkThemeCalculateTotalPages(paginationContent: PaginationContent, selectionsLength: number) {
        paginationContent.totalPages = Math.ceil(selectionsLength / paginationContent.pageSize);
        paginationContent.paginationText = this.getNewDesignFooterText(paginationContent.pageNumber, paginationContent.totalPages);
    }

    getFooterText(pageNum: number, totalPages: number): string {
        return 'PAGE ' + pageNum + ' OF ' + totalPages;
    }

    getNewDesignFooterText(pageNum: number, totalPages: number): string {
        return 'Page ' + pageNum + ' of ' + totalPages;
    }
}
