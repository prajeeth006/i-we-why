export class ArrayUtilities {
    static getListOfRange(noOfItems : number) {
        return Array.from({ length: noOfItems }, (value, index) => index + 1);
    }
}