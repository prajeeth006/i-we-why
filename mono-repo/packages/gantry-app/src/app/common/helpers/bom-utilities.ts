// BOM : Browser Object Model
export class BomUtilities {
    static formatLog(logMsg: any, bgColor: string = 'red', color: string = 'white') {
        console.log(`%c[${new Date().toISOString()}]: ${logMsg}`, `background: ${bgColor};color: ${color}`);
    }
}
