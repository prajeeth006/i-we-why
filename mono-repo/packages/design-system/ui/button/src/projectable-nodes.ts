export function dsButtonProjectableNodes(el: HTMLElement): Node[][] {
    const cloned = el?.cloneNode(true);
    const projectableNodes: Node[][] = [];

    if (!el) {
        return projectableNodes;
    }

    // eslint-disable-next-line unicorn/prefer-spread
    const childNodes = Array.from(cloned?.childNodes ?? []);

    const slotStart: Node | undefined = [...childNodes].find((x) => {
        const attrs: NamedNodeMap | null = (x as Element)?.attributes ?? null;
        if (attrs) {
            return attrs.getNamedItem('slot')?.value === 'start';
        }
        return false;
    });

    const slotEnd: Node | undefined = [...childNodes].find((x) => {
        const attrs: NamedNodeMap | null = (x as Element)?.attributes ?? null;
        if (attrs) {
            return attrs.getNamedItem('slot')?.value === 'end';
        }
        return false;
    });

    const defaultSlot: Node[] | undefined = childNodes.filter((x) => {
        if (x instanceof Element) {
            const attrs = x.attributes;
            return !attrs.getNamedItem('slot');
        }

        return true;
    });

    if (slotStart) {
        projectableNodes[0] = [slotStart];
    }
    if (defaultSlot) {
        projectableNodes[2] = defaultSlot;
    }
    if (slotEnd) {
        projectableNodes[1] = [slotEnd];
    }
    return projectableNodes;
}
