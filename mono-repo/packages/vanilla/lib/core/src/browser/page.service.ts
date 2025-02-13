import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';

/**
 * @whatItDoes Represents a change of page metadata.
 *
 * @description
 *
 * Use `revert()` to revert the change to the original value.
 *
 * @stable
 */
export interface RevertiblePageChange {
    write(): void;

    revert(): void;
}

/**
 * @whatItDoes Manipulates page metadata (like title and meta tags).
 *
 * @howToUse
 *
 * ```
 * ngOnInit() {
 *     this.changes = [
 *         this.pageService.setTitle('special title'),
 *         this.pageService.setMeta('description', 'some description')
 *     ]
 * }
 *
 * ngOnDestroy() {
 *     this.changes.forEach(c => c.revert())
 * }
 * ```
 *
 * @description
 *
 * You can use this service to change (or add) title and meta tags. Each change is reversible by calling `revert()` function on
 * the object returned from each call to the service. Usually you want to have some base title and meta tags, set them to something
 * different for some page, then revert back to the original state after navigating away from this page.
 *
 * This is done automatically for public pages displayed via `PageMatrixComponent`.
 *
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class PageService {
    private readonly _doc = inject(DOCUMENT);

    setTitle(title: string): RevertiblePageChange {
        let originalTitle: string | undefined = this._doc.title;
        this._doc.title = title;

        return new LambdaRevertiblePageChange(() => {
            if (originalTitle == undefined) {
                throw new Error(`Page title "${title}" was already reverted.`);
            }
            this._doc.title = originalTitle;
            originalTitle = undefined;
        });
    }

    setMeta(name: string, content: string | null): RevertiblePageChange {
        let originalContent: string | null | undefined = setMetaTag(name, content, this._doc);

        return new LambdaRevertiblePageChange(() => {
            if (originalContent === undefined) {
                throw new Error(`The change of meta tag "${name}" to content "${content}" was already reverted.`);
            }
            setMetaTag(name, originalContent, this._doc);
            originalContent = undefined;
        });
    }
}

class LambdaRevertiblePageChange implements RevertiblePageChange {
    constructor(private revertFunc: () => void) {}

    write() {
        // This is intentional
    }

    revert() {
        this.revertFunc();
    }
}

function setMetaTag(name: string, content: string | null, doc: Document): string | null {
    const encodedName = name.replace(/\\/, '\\\\').replace(/"/, '\\"');
    let meta: HTMLMetaElement | null = doc.head.querySelector(`meta[name="${encodedName}"]`);
    const originalContent = meta ? meta.content : null;

    if (meta) {
        if (typeof content === 'string') {
            meta.content = content;
        } else {
            meta.remove();
        }
    } else {
        if (typeof content === 'string') {
            meta = doc.createElement('meta');
            meta.name = name;
            meta.content = content;
            doc.head.appendChild(meta);
        } // else no need to remove b/c it already doesn't exist
    }
    return originalContent;
}
