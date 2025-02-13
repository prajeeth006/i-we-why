import * as fs from 'node:fs';

/**
 * This function converts a name to a variable name by removing invalid characters and replacing spaces and underscores with dashes
 * @param name
 */
export function convertToVariableName(name: string) {
    return name
        .toLowerCase()
        .replace(/(\s|\/)+/gi, '-')
        .replace(/_/gi, '-')
        .replace(/[^a-z\d-]/gi, '');
}

export function convertCamelToKebabCase(input: string) {
    return input.replace(/([a-z\d])([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * This function removes invalid characters from a name (only a-z, 0-9, - and _ and space are allowed)
 * @param name
 */
export function removeInvalidChars(name: string) {
    return name.toLowerCase().replace(/[^\w- ]/gi, '');
}

/**
 * This function returns all files in a directory and all subdirectories recursively
 * @param dir the directory to search in
 * @param files not required, internal helper to collect files
 */
export function getFilesRecursiveFromDirectory(dir: string, files: string[] = []): string[] {
    // Get an array of all files and directories in the provided directory using fs.readdirSync
    const fileList = fs.readdirSync(dir);
    // Create the full path of the file/directory by concatenating the passed directory and file/directory name
    for (const file of fileList) {
        const name = `${dir}/${file}`;
        // Check if the current file/directory is a directory using fs.statSync
        if (fs.statSync(name).isDirectory()) {
            // If it is a directory, recursively call the getFiles function with the directory path and the files array
            getFilesRecursiveFromDirectory(name, files);
        } else {
            // If it is a file, push the full path to the files array
            files.push(name);
        }
    }
    return files;
}

export function sortObject(unordered: any, sortArrays = false) {
    if (!unordered || typeof unordered !== 'object') {
        return unordered;
    }

    if (Array.isArray(unordered)) {
        const newArr: any[] = unordered.map((item) => sortObject(item, sortArrays));
        if (sortArrays) {
            newArr.sort();
        }
        return newArr;
    }

    const ordered: any = {};
    Object.keys(unordered)
        .sort()
        .forEach((key) => {
            ordered[key] = sortObject(unordered[key], sortArrays);
        });
    return ordered;
}
