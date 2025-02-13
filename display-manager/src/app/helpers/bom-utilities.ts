// BOM : Browser Object Model
export class BOMUtilities {
    static getMousePosition(event: any = null) {
        if (!event) {
            return { x: '0px', y: '0px' }
        }
        return { x: `${event.clientX}px`, y: `${event.clientY}px` }
    }

    static openInNewTab(url: string) {
        window.open(url, '_blank')?.focus();
    }

    static customLog(logMsg: any, bgColor: string = 'red', color: string = 'white') {
        console.log(`%c[${(new Date()).toISOString()}]: ${logMsg}`, `background: ${bgColor};color: ${color}`);
    }

    static getTimeStamp() {
        return `[${(new Date()).toISOString()}]: `;
    }
}