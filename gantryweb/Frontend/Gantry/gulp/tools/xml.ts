import * as xmldom from 'xmldom';

export class XML {
    static stringify(xml: any) {
        const content = new xmldom.XMLSerializer().serializeToString(xml);
        return content.replace(/\/>/g, ' />').replace('?><', '?>\r\n<'); // Few fixes to keep in sync with VS formatting
    }

    static parse(content: string) {
        return new xmldom.DOMParser().parseFromString(content);
    }
}
