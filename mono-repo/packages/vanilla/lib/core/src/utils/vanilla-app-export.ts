export function vanillaAppExport(namespace: string | null, name: string, fn: Function) {
    const w = window as any;
    w.vanillaApp = w.vanillaApp || {};

    let o = w.vanillaApp;
    if (namespace) {
        o = o[namespace] = o[namespace] || {};
    }

    o[name] = fn;
}
