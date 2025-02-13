export class DocumentMock {
    readyState: DocumentReadyState | undefined;
    addEventListener = jest.fn();
    querySelector = jest.fn();
    querySelectorAll = jest.fn();
    removeEventListener = jest.fn();
    createElement = jest.fn();
    appendChild = jest.fn();
    getElementById = jest.fn();
    dispatchEvent = jest.fn();
}
