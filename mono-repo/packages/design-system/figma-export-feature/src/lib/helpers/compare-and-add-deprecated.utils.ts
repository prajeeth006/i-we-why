import { W3CGroup, W3CToken, W3CTokenDocument } from '@design-system/w3c-token-standard-utils';

/**
 * This functions takes a group or token and marks it recursively as deprecated by adding the status deprecated to the extensions
 * @param groupOrToken the group or token to mark as deprecated
 * @param deprecationDate a consistent date for marking token as deprecated
 */
function markGroupOrTokenAsDeprecated(groupOrToken: W3CGroup | W3CToken, deprecationDate: string): W3CGroup | W3CToken {
    // Add deprecated status to the extensions field
    const subGroup = groupOrToken.$extensions?.['com.entaingroup.ext-figma'] ?? {};
    if (typeof subGroup !== 'object') {
        throw new TypeError('invalid structure');
    }

    const castedSubGroup = subGroup as { status?: string; status_changed_at?: string };

    if (!('status_changed_at' in castedSubGroup)) {
        castedSubGroup.status_changed_at = deprecationDate;
    }

    groupOrToken.$extensions = {
        ...groupOrToken.$extensions,
        'com.entaingroup.ext-figma': {
            ...castedSubGroup,
            status: 'deprecated',
        },
    };

    // It is not a token, so it is a group
    if (!('$value' in groupOrToken)) {
        // Mark all children as deprecated
        Object.entries(groupOrToken).forEach(([key, value]) => {
            // Ignore fields starting with $ ($value, $description, $extensions) as they are not tokens or groups
            if (!key.startsWith('$')) {
                const castedValue = value as W3CGroup | W3CToken;
                groupOrToken[key] = markGroupOrTokenAsDeprecated(castedValue, deprecationDate);
            }
        });
    }

    return groupOrToken;
}

/**
 * This function scans the new and old tokens and marks the deprecated ones as deprecated
 * @param newGroupOrToken the token or group to add deprecated tokens to
 * @param oldGroupOrToken the token or group to compare with
 * @param parentNewGroup the parent group of the new group or token
 * @param parentOldGroup the parent group of the old group or token
 * @param path the path to the token checked
 */
function scanAndMarkDeprecatedTokens(
    newGroupOrToken: W3CGroup | W3CToken,
    oldGroupOrToken: W3CGroup | W3CToken,
    parentNewGroup: W3CGroup,
    parentOldGroup: W3CGroup,
    deprecationDate: string,
    path: string[] = [],
) {
    const key = path.at(-1);

    // Ensure both are tokens or groups
    if ('$value' in newGroupOrToken && !('$value' in oldGroupOrToken)) {
        // Store old tokens with special deprecation flag
        parentNewGroup[`${key}--<|deprecated-group|>`] = markGroupOrTokenAsDeprecated(oldGroupOrToken, deprecationDate);

        // Check if there was a token before which was already a token that delete this deprecation information
        if (`${key}--<|deprecated-token|>` in parentOldGroup) {
            oldGroupOrToken = parentOldGroup[`${key}--<|deprecated-token|>`];
        } else {
            // No need to handle further
            return;
        }
        //throw Error(`Cannot compare, structure changed too much (new token is not a group): ${path.join(".")}`);
    }
    if ('$value' in oldGroupOrToken && !('$value' in newGroupOrToken)) {
        // Store old tokens with special deprecation flag
        parentNewGroup[`${key}--<|deprecated-token|>`] = markGroupOrTokenAsDeprecated(oldGroupOrToken, deprecationDate);

        // Check if there was a token before which was already a group that use this information as deprecation check
        if (`${key}--<|deprecated-group|>` in parentOldGroup) {
            oldGroupOrToken = parentOldGroup[`${key}--<|deprecated-group|>`];
        } else {
            // no need to handle further
            return;
        }
        //throw Error(`Cannot compare, structure changed too much (new token is not a value): ${path.join(".")}`);
    }
    // Both are tokens, then the token still exists
    if ('$value' in oldGroupOrToken && '$value' in newGroupOrToken) {
        // Both are tokens, this is good, no deprecation

        // We delete keys of deprecated tokens as token is no longer deprecated
        delete parentOldGroup[`${key}--<|deprecated-token|>`];
        delete parentNewGroup[`${key}--<|deprecated-token|>`];

        return;
    }

    // Both are groups, so we can compare the children
    // We delete keys of deprecated group as group is no longer deprecated
    delete parentOldGroup[`${key}--<|deprecated-group|>`];
    delete parentNewGroup[`${key}--<|deprecated-group|>`];

    const newGroup = newGroupOrToken as W3CGroup;
    const oldGroup = oldGroupOrToken as W3CGroup;

    // Scan all children of the old group and mark them as deprecated if they are not in the new group
    Object.entries(oldGroup).forEach(([key2, value]) => {
        // It has been removed in the meantime
        if (!(key2 in oldGroup)) {
            return;
        }

        // Ignore fields starting with $ ($value, $description, $extensions) as they are not tokens or groups
        if (key2.startsWith('$')) {
            return;
        }
        // If the key is not in the new group, it is deprecated
        if (key2 in newGroup) {
            // The token is not deprecated, but we need to check the children
            const castedValue = value as W3CGroup | W3CToken;
            const newCastedValue = newGroup[key2];
            scanAndMarkDeprecatedTokens(newCastedValue, castedValue, newGroup, oldGroup, deprecationDate, [...path, key2]);
        } else {
            // This token is deprecated
            const groupOrToken = value as W3CGroup | W3CToken;
            markGroupOrTokenAsDeprecated(groupOrToken, deprecationDate);
            newGroup[key2] = groupOrToken;
            return;
        }
    });
}

/**
 * This function compares the existing files with the new updates.
 * Any variable and group that has been removed or renamed will be marked as deprecated.
 * @param newExport
 * @param oldExport
 */
export function compareAndAddDeprecated(
    newExport: Record<string, W3CTokenDocument>,
    oldExport: Record<string, W3CTokenDocument>,
): Record<string, W3CTokenDocument> {
    const result: Record<string, W3CTokenDocument> = newExport;

    const deprecationDate = new Date().toISOString();

    // Scan all old themes and mark them as deprecated if they are not in the new themes
    Object.entries(oldExport).forEach(([themeName, draft]) => {
        // If the theme is not in the new export, it is deprecated
        if (!(themeName in newExport)) {
            result[themeName] = draft;
            // Go over all groups or tokens and mark them as deprecated
            for (const groupOrToken of Object.values(result[themeName])) {
                markGroupOrTokenAsDeprecated(groupOrToken, deprecationDate);
            }
            return;
        }

        // The theme is not deprecated, but we need to check the children
        const newDraft = result[themeName];

        scanAndMarkDeprecatedTokens(newDraft, draft, result, oldExport, deprecationDate, [themeName]);
    });

    return result;
}
