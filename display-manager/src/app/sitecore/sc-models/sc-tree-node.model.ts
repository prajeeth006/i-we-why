export class TreeNode {
    constructor(
        public id: string,
        public name: string,
        public level = 1,
        public expandable: boolean = false,
        public isLoading: boolean = false
    ) {}
}