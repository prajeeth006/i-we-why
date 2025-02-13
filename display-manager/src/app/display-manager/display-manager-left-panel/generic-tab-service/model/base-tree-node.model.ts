import { RacingEvent } from "./event.model";


export class BaseTreeNode {
    constructor(
        public id: string,
        public name: string,
        public event : RacingEvent,
        public parentId:string,
        public level = 1,
        public expandable: boolean = false,
        public isLoading: boolean = false
    ) {}
}