/**
 * Magic number for the ratio between two colors being at least 3
 */
export const GRADE_OFFSET_3 = 56;
/**
 * Magic number for the ratio between two colors being at least 4.5
 */
export const GRADE_OFFSET_45 = 70;
/**
 * Magic number for the ratio between two colors being at least 7
 */
export const GRADE_OFFSET_7 = 98;

/**
 * Table for relative luminance values
 * This table was calculated with the color_comp_initial.js code.
 * It should not be changed unless the calculation is redone.
 */
export const relLumTable = [
    {
        grade: 0,
        min: 1,
        max: 1,
    },
    {
        grade: 5,
        min: 0.8485,
        max: 0.9999,
    },
    {
        grade: 10,
        min: 0.7865,
        max: 0.8484,
    },
    {
        grade: 20,
        min: 0.623,
        max: 0.7864,
    },
    {
        grade: 30,
        min: 0.4912500000000001,
        max: 0.6229,
    },
    {
        grade: 40,
        min: 0.386,
        max: 0.4911500000000001,
    },
    {
        grade: 50,
        min: 0.30025,
        max: 0.3859,
    },
    {
        grade: 60,
        min: 0.232,
        max: 0.30000000000000004,
    },
    {
        grade: 70,
        min: 0.177,
        max: 0.18333333333333335,
    },
    {
        grade: 80,
        min: 0.11700000000000002,
        max: 0.1358888888888889,
    },
    {
        grade: 90,
        min: 0.0703777777777778,
        max: 0.09955555555555555,
    },
    {
        grade: 100,
        min: 0.046988888888888886,
        max: 0.0702777777777778,
    },
    {
        grade: 110,
        min: 0.027933333333333334,
        max: 0.04688888888888888,
    },
    {
        grade: 120,
        min: 0.012766666666666673,
        max: 0.027833333333333335,
    },
    {
        grade: 130,
        min: 0.0001,
        max: 0.012666666666666673,
    },
    {
        grade: 140,
        min: 0,
        max: 0,
    },
];
