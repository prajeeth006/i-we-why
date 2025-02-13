import tinycolor from 'tinycolor2';

import { GRADE_OFFSET_3, GRADE_OFFSET_7, GRADE_OFFSET_45, relLumTable } from './color-table-params';

/**
 * Returns a list of colors for a given grade
 * @param baseColor color to start searching from (HSL)
 * @param grade the grade to search for colors
 * @returns list of colors for the given grade
 */
function getForGrade(baseColor: tinycolor.Instance, grade: { min: number; max: number; grade: number }) {
    const values: tinycolor.Instance[] = [];

    for (let i = 100; i >= 0; i--) {
        const renderColor = tinycolor({ ...baseColor.toHsl(), l: i });
        const luminance = renderColor.getLuminance();

        if (luminance >= grade.min && luminance <= grade.max) {
            values.push(renderColor);
        }
    }

    return values;
}

/**
 * Calculates the ratio of relative luminance between two colors
 * @param a relative luminance of color a
 * @param b relative luminance of color b
 * @returns ratio between the two colors
 */
function getRatio(a: number, b: number) {
    const z = (a + 0.05) / (b + 0.05);
    if (z < 1) {
        return 1 / z;
    }
    return z;
}

/**
 * Creates the grades for the given colors
 * @param colors list of colors to create grades for
 * @returns list of grades for the given colors
 */
function createGrades(colors: string[]) {
    const valueGroups = [];

    for (const color of colors) {
        const tColor = tinycolor(color);
        const values: tinycolor.Instance[][] = [[]];

        const hsl = tColor.toHsl();
        let currentShade = 0;

        for (let i = 100; i >= 0; i--) {
            const renderColor = tinycolor({ ...hsl, l: i });
            const luminance = renderColor.getLuminance();
            while (relLumTable[currentShade].min > luminance) {
                if (values[values.length - 1].length === 0) {
                    let offset = 0;
                    while (values[values.length - 1].length === 0) {
                        const alternatives = [
                            ...getForGrade(tinycolor({ ...hsl, h: (hsl.h + offset) % 360 }), relLumTable[currentShade]),
                            ...getForGrade(tinycolor({ ...hsl, h: (hsl.h - offset + 360) % 360 }), relLumTable[currentShade]),
                            ...(hsl.s - offset / 100 >= 0
                                ? getForGrade(tinycolor({ ...hsl, s: hsl.s - offset / 100 }), relLumTable[currentShade])
                                : []),
                            ...(hsl.s + offset / 100 <= 1
                                ? getForGrade(tinycolor({ ...hsl, s: hsl.s + offset / 100 }), relLumTable[currentShade])
                                : []),
                        ];
                        alternatives.forEach((a) => values[values.length - 1].push(a));
                        offset++;
                        if (offset >= 10) {
                            break;
                        }
                    }
                }
                currentShade++;
                values.push([]);
            }
            if (luminance >= relLumTable[currentShade].min && luminance <= relLumTable[currentShade].max) {
                values[values.length - 1].push(renderColor);
            }
        }
        valueGroups.push(values);
    }
    return valueGroups;
}

/**
 * Converts the value groups to a format that is easier to display
 * @param valueGroups list of value groups
 * @returns list of value groups with swapped inner values
 */
function swapColors(valueGroups: tinycolor.Instance[][][]) {
    // Swap value groups with inner values
    const valueOuter = [];
    for (let i = 0; i < relLumTable.length; i++) {
        const entry = [];
        for (const valueGroup of valueGroups) {
            entry.push(valueGroup[i]);
        }
        valueOuter.push(entry);
    }
    return valueOuter;
}

/**
 * This function computes the contrast ratio between the smallest required color difference
 * According to the calculation the ratio always is true so it just to proof it.
 * Actually, in practice one should not need it in the end.
 * @param valueGroups list of value groups
 * @param valueOuter  list of value groups with swapped inner values
 * @returns HTML message with the verification results
 */
function displayVerification(valueGroups: tinycolor.Instance[][][], valueOuter: tinycolor.Instance[][][]) {
    let verificationMessage = '<h2>Verification</h2>';
    verificationMessage += "<details style='width: max-content;'><summary>Details (color/grade/entry)</summary>";
    const verificationData = [
        { magic_number: GRADE_OFFSET_3, contrast_ratio: 3, name: 'AA Large Text' },
        { magic_number: GRADE_OFFSET_45, contrast_ratio: 4.5, name: 'AA Text/AAA Large Text' },
        { magic_number: GRADE_OFFSET_7, contrast_ratio: 7, name: 'AAA Text' },
    ];
    let hasIssues = false;

    for (const verificationEntry of verificationData) {
        verificationMessage += `<h3>Contrast ratio ${verificationEntry.name} (${verificationEntry.contrast_ratio})</h3>`;
        for (let i = 0; i < relLumTable.length - 1; i++) {
            const grade1 = relLumTable[i].grade;
            for (let j = 0; j < relLumTable.length; j++) {
                const grade2 = relLumTable[j].grade;
                if (grade1 + verificationEntry.magic_number > grade2) {
                    continue;
                }

                const colorsGrade1 = valueOuter[i];
                const colorsGrade2 = valueOuter[j];

                // Do comparison between all colors
                for (let a = 0; a < valueGroups.length; a++) {
                    for (let b = 0; b < valueGroups.length; b++) {
                        let counterA = 0;
                        for (const valueA of colorsGrade1[a]) {
                            let counterB = 0;
                            for (const valueB of colorsGrade2[b]) {
                                const ratio = getRatio(valueA.getLuminance(), valueB.getLuminance());
                                const colorVerification = ratio >= verificationEntry.contrast_ratio ? 'green' : 'red';
                                if (ratio < verificationEntry.contrast_ratio) {
                                    // This should not happen, but to be on the safe side.
                                    hasIssues = true;
                                }
                                verificationMessage += `<span style="color: ${colorVerification};">${a}/${grade1}/${counterA} with ${b}/${grade2}/${counterB}: ${ratio}</span><br>`;
                                counterB++;
                            }
                            counterA++;
                        }
                    }
                }

                // Comparison done break for this one
                break;
            }
        }
    }
    verificationMessage += '</details>';
    verificationMessage += hasIssues
        ? "<span style='color: red;'>Contrast ratio issues found</span>"
        : "<span style='color: green;'>No contrast ratio issues found</span>";
    return verificationMessage;
}

/**
 * Displays the color table for the given value groups
 * @param valueGroups list of value groups
 * @param valueOuter  list of value groups with swapped inner values
 * @param origColors list of original colors sent
 * @returns HTML table with the color values
 */
function displayColorTable(valueGroups: tinycolor.Instance[][][], valueOuter: tinycolor.Instance[][][], origColors: string[]) {
    let returnMessage = '';

    returnMessage += `<table id="result-table"><thead><tr><th colspan="2">Grade</th>`;
    for (let i = 0; i < valueGroups.length; i++) {
        returnMessage += `<th>Color ${i}</th>`;
    }
    returnMessage += `</tr></thead><tbody>`;

    returnMessage += `<tr><td colspan="2">Given</td>`;
    for (const color of origColors) {
        const origColor = tinycolor(color);
        returnMessage += `<td><div><span style="width: 16px; height: 16px; background-color: ${origColor.toRgbString()}; display: inline-block;"></span><span>${origColor.toHslString()}</span></div></td>`;
    }
    returnMessage += `</tr>`;

    valueOuter.forEach((values, index) => {
        returnMessage += `<tr><td>${relLumTable[index].grade}</td>`;

        const maxValues = Math.max(...values.map((x) => x.length));
        returnMessage += '<td>';
        for (let i = 0; i < maxValues; i++) {
            returnMessage += `${i}<br>`;
        }
        returnMessage += '</td>';

        let colorId = 0;
        values.forEach((value) => {
            const origColor = tinycolor(origColors[colorId]);
            returnMessage += '<td>';
            value.forEach((color) => {
                returnMessage += `<div><span style="width: 16px; height: 16px; background-color: ${color.toRgbString()}; display: inline-block;"></span><span style="font-weight: ${origColor.toHslString() === color.toHslString() ? '700' : '400'};">${color.toHslString()}</span></div>`;
            });
            returnMessage += '</td>';
            colorId++;
        });
        returnMessage += `</tr>`;
    });
    returnMessage += '</tbody></table>';
    return returnMessage;
}

figma.showUI(__html__, { width: 500, height: 800, themeColors: true });

figma.ui.onmessage = (msg: Record<string, any>) => {
    if (msg['type'] === 'create-grades') {
        const valueGroups = createGrades(msg['colors']);
        const valueOuter = swapColors(valueGroups);

        let returnMessage = displayColorTable(valueGroups, valueOuter, msg['colors']);
        returnMessage += displayVerification(valueGroups, valueOuter);

        figma.ui.postMessage({ message: returnMessage, type: 'create-grades-result' });
    }
};
