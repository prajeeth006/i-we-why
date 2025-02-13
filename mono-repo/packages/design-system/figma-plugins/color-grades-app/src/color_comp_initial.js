/**
 * This script was written to initially calculate the list of relative luminance for a certain amount of colors
 * This is for reference in case color scheme has to be changed.
 */

// Parameters
// This includes white (0), black(100) and one half-shade followed after white
const numberOfShades = 16;
const gradingStep = 10;

// Initial calculation
const minValue = 0;
const maxValue = 1;
const ratioBlackWhite = (maxValue + 0.05) / (minValue + 0.05);
const shades = [];
const gradeOffset3 = ((gradingStep * (numberOfShades - 2)) / 2 / 50) * 40;
const gradeOffset45 = ((gradingStep * (numberOfShades - 2)) / 2 / 50) * 50;
const gradeOffset7 = ((gradingStep * (numberOfShades - 2)) / 2 / 50) * 70;

for (let i = 0; i < numberOfShades - 1; i++) {
    shades.push({
        grade: i * gradingStep,
        min: 0,
        max: 1,
        avg: 0.5,
    });
    if (i == 0) {
        shades.push({
            grade: i * gradingStep + gradingStep / 2,
            min: 0,
            max: 1,
            avg: 0.5,
        });
    }
}
shades[0].min = 1;
shades[0].avg = 1;
shades[shades.length - 1].max = 0;
shades[shades.length - 1].avg = 0;

// Computation of average value and application
const stepFactor = stepSizeSolver(0, ratioBlackWhite, numberOfShades - 2);

for (let i = 0; i < numberOfShades - 3; i++) {
    if (i == 0) {
        shades[i + 2].avg = Math.round(getLower(shades[0].avg, stepFactor) * 1000) / 1000;
    } else {
        shades[i + 2].avg = Math.round(getLower(shades[i + 1].avg, stepFactor) * 1000) / 1000;
    }
    shades[i + 2].max = shades[i + 2].avg;
    shades[i + 2].min = shades[i + 2].avg;
}
shades[1].avg = Math.round((Math.sqrt((shades[0].avg + 0.05) * (shades[2].avg + 0.05)) - 0.05) * 1000) / 1000;
shades[1].min = shades[1].avg;
shades[1].max = shades[1].avg;

modifiyMinValues();
modifiyMaxValues();
// Treat special case on position 1 to set minium to half
shades[1].min = (shades[1].avg + shades[2].max) / 2 + 0.005;
// Fill up remaining ranges
stretchValues();

for (let shade of shades) {
    //shade.min = Math.ceil(shade.min*1000)/1000
    //shade.max = Math.floor(shade.max*1000)/1000
}

console.log('Magic numbers:', gradeOffset3, gradeOffset45, gradeOffset7);
console.log(shades);

annotate(shades, gradeOffset3, 3);
annotate(shades, gradeOffset45, 4.5);
annotate(shades, gradeOffset7, 7);

console.log(shades);

verify(shades, gradeOffset3, 3);
verify(shades, gradeOffset45, 4.5);
verify(shades, gradeOffset7, 7);

verifyMinMax(shades);

function modifiyMinValues() {
    const gradeOffsets = [gradeOffset3, gradeOffset45, gradeOffset7];
    const gradeRatios = [3, 4.5, 7];

    for (let i = 2; i < numberOfShades - 1; i++) {
        const grades = [];

        for (let gradeOffset of gradeOffsets) {
            for (let j = i + 1; j < numberOfShades; j++) {
                if (shades[i].grade + gradeOffset <= shades[j].grade) {
                    grades.push(shades[j]);
                    break;
                }
            }
        }

        let maxRatio = 0;
        for (let j = 0; j < grades.length; j++) {
            maxRatio = Math.max(maxRatio, getHigher(grades[j].max, gradeRatios[j]));
        }
        if (maxRatio != 0) {
            shades[i].min = shades[i].min - (shades[i].min - maxRatio) / 2;
        }
    }
}

function modifiyMaxValues() {
    const gradeOffsets = [gradeOffset3, gradeOffset45, gradeOffset7];
    const gradeRatios = [3, 4.5, 7];

    for (let i = numberOfShades - 2; i > 1; i--) {
        const grades = [];

        for (let gradeOffset of gradeOffsets) {
            for (let j = i - 1; j >= 0; j--) {
                if (shades[i].grade >= shades[j].grade + gradeOffset) {
                    grades.push(shades[j]);
                    break;
                }
            }
        }

        let minRatio = ratioBlackWhite;
        for (let j = 0; j < grades.length; j++) {
            minRatio = Math.min(minRatio, getLower(grades[j].min, gradeRatios[j]));
        }
        if (minRatio != ratioBlackWhite) {
            shades[i].max = minRatio;
        }
    }
}

function stretchValues() {
    for (let i = 1; i < numberOfShades - 1; i++) {
        // Minimum is not different, we stretch down
        if (shades[i].min == shades[i].avg) {
            shades[i].min = shades[i + 1].max + 0.0001;
        }
        if (shades[i].max == shades[i].avg) {
            shades[i].max = shades[i - 1].min - 0.0001;
        }
    }
}

function getHigher(currentL, factor) {
    return factor * (currentL + 0.05) - 0.05;
}
function getLower(currentL, factor) {
    return (currentL + 0.05) / factor - 0.05;
}

function getRatio(a, b) {
    const z = (a + 0.05) / (b + 0.05);
    if (z < 1) {
        return 1 / z;
    }
    return z;
}

function stepSizeSolver(lowerBound, upperBound, steps, maxBound = 1) {
    const tryFactor = upperBound / 2 + lowerBound / 2;
    let currentValue = 0;
    for (let i = 0; i < steps; i++) {
        currentValue = getHigher(currentValue, tryFactor);
        if (currentValue > maxBound + 0.001) {
            break;
        }
    }
    currentValueRounded = Math.round(currentValue * 10000) / 10000;
    if (currentValueRounded === maxBound) {
        return tryFactor;
    }
    if (currentValue > maxBound) {
        return stepSizeSolver(lowerBound, tryFactor, steps, maxBound);
    }

    return stepSizeSolver(tryFactor, upperBound, steps, maxBound);
}

function annotate(shades, gradeOffset, factor) {
    for (let i = 0; i < numberOfShades; i++) {
        for (let j = i + 1; j < numberOfShades; j++) {
            if (shades[i].grade + gradeOffset <= shades[j].grade) {
                const ratio = getRatio(shades[i].min, shades[j].max);
                shades[i]['gradeOffset' + gradeOffset] = Math.floor(ratio * 10) / 10;
                shades[j]['gradeOffset' + gradeOffset] = Math.floor(ratio * 10) / 10;
                break;
            }
        }
    }
}

function verify(shades, gradeOffset, factor) {
    for (let i = 0; i < numberOfShades; i++) {
        for (let j = 0; j < numberOfShades; j++) {
            if (shades[i].grade + gradeOffset <= shades[j].grade) {
                const ratio = getRatio(shades[i].min, shades[j].max);
                if (ratio < factor) {
                    console.log('Ratio with factor ', factor, 'not correct for grades', shades[i].grade, shades[j].grade, 'Current factor is', ratio);
                }
            }
        }
    }
}

function verifyMinMax(shades) {
    for (let i = 0; i < numberOfShades - 1; i++) {
        if (shades[i].min <= shades[i + 1].max) {
            console.log('Shades min lower than shades max for shade', shades[i].grade, shades[i + 1].grade);
        }
    }
}

/*
var shades = [0,5,10,20,30,40,50,60,70,80,90,100]

var FACTOR_AA_LARGE = 3.0
var FACTOR_AA = 4.5
var FACTOR_AAA = 7.0





var map = {}

for(shade of shades) {
	map[shade] = [0,1]
}

map[0] = [1,1]
map[100] = [0,0]
map[50] = [getHigher(map[100][0], FACTOR_AA), getLower(map[0][0], FACTOR_AA)]
map[40][0] = map[50][1]
map[60][1] = map[50][0]

// Magic 40+ AA Large
// Magic 50+ AA
// Magic 70+ AAA

function computeUpperBounds() {
	for (var i = shades.length; i >= 0; i--) {
		var shade = shades[i];
		
		for (var j = i-1; j >= 0; j--) {
			var shade2 = shades[j];
			
			// Skip fixed shades
			if (shade2 == 0 || shade2 == 50 || shade2 == 100) {
				continue;
			}
			
			if (Math.abs(shade2-shade) >= 40) {
				// Update upper bound
				var lowerBound = getHigher(map[shade][0], FACTOR_AA_LARGE)
				if (lowerBound > 0) {
					map[shade2][0] = Math.max(map[shade2][0], lowerBound)
				}
			}
			if (Math.abs(shade2-shade) >= 50) {
				// Update upper bound
				var lowerBound = getHigher(map[shade][0], FACTOR_AA)
				if (lowerBound > 0) {
					map[shade2][0] = Math.max(map[shade2][0], lowerBound)
				}
			}
			if (Math.abs(shade2-shade) >= 70) {
				// Update upper bound
				var lowerBound = getHigher(map[shade][0], FACTOR_AAA)
				if (lowerBound > 0) {
					map[shade2][0] = Math.max(map[shade2][0], lowerBound)
				}
			}
			
			// We do not need to check boundaries as 0 and 100 is boundary always
			var shade3 = shades[j-1]
			//map[shade3][0] = Math.max(map[shade3][0], map[shade2][1]);
		}
	}
}

function computeLowerBounds() {
	for (var i = 0; i < shades.length; i++) {
		var shade = shades[i];
		
		for (var j = i+1; j < shades.length; j++) {
			var shade2 = shades[j];
			
			// Skip fixed shades
			if (shade2 == 0 || shade2 == 50 || shade2 == 100) {
				continue;
			}
			
			if (Math.abs(shade2-shade) >= 40) {
				// Update upper bound
				var lowerBound = getLower(map[shade][1], FACTOR_AA_LARGE)
				if (lowerBound > 0) {
					map[shade2][1] = Math.min(map[shade2][1], lowerBound)
				}
			}
			if (Math.abs(shade2-shade) >= 50) {
				// Update upper bound
				var lowerBound = getLower(map[shade][1], FACTOR_AA)
				if (lowerBound > 0) {
					map[shade2][1] = Math.min(map[shade2][1], lowerBound)
				}
			}
			if (Math.abs(shade2-shade) >= 70) {
				// Update upper bound
				var lowerBound = getLower(map[shade][1], FACTOR_AAA)
				if (lowerBound > 0) {
					map[shade2][1] = Math.min(map[shade2][1], lowerBound)
				}
			}
			
			// We do not need to check boundaries as 0 and 100 is boundary always
			var shade3 = shades[j-1]
			//map[shade3][0] = Math.max(map[shade3][0], map[shade2][1]);
		}
	}
}

computeLowerBounds();
computeUpperBounds();

console.log(map)

x=0.005
console.log(getLower(x, FACTOR_AA_LARGE))
console.log(getLower(x, FACTOR_AA))
console.log(getLower(x, FACTOR_AAA))
console.log(getHigher(x, FACTOR_AA_LARGE))
console.log(getHigher(x, FACTOR_AA))
console.log(getHigher(x, FACTOR_AAA))
y=0.015
console.log(getLower(y, FACTOR_AA_LARGE))
console.log(getLower(y, FACTOR_AA))
console.log(getLower(y, FACTOR_AAA))
console.log(getHigher(y, FACTOR_AA_LARGE))
console.log(getHigher(y, FACTOR_AA))
console.log(getHigher(y, FACTOR_AAA))
*/

function isOnePointZero(n) {
    return typeof n == 'string' && n.indexOf('.') != -1 && parseFloat(n) === 1;
}

// Check to see if string passed in is a percentage
function isPercentage(n) {
    return typeof n === 'string' && n.indexOf('%') != -1;
}

function bound01(n, max) {
    if (isOnePointZero(n)) n = '100%';
    var processPercent = isPercentage(n);
    n = Math.min(max, Math.max(0, parseFloat(n)));

    // Automatically convert percentage into number
    if (processPercent) {
        n = parseInt(n * max, 10) / 100;
    }

    // Handle floating point rounding errors
    if (Math.abs(n - max) < 0.000001) {
        return 1;
    }

    // Convert into [0, 1] range if it isn't already
    return (n % max) / parseFloat(max);
}

function hslToRgb(h, s, l) {
    var r, g, b;
    h = bound01(h, 360);
    s = bound01(s, 100);
    l = bound01(l, 100);
    function hue2rgb(p, q, t) {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
    }
    if (s === 0) {
        r = g = b = l; // achromatic
    } else {
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }
    return {
        r: r * 255,
        g: g * 255,
        b: b * 255,
    };
}

function getLuminance(rgb) {
    //http://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
    var RsRGB, GsRGB, BsRGB, R, G, B;
    RsRGB = rgb.r / 255;
    GsRGB = rgb.g / 255;
    BsRGB = rgb.b / 255;
    if (RsRGB <= 0.03928) R = RsRGB / 12.92;
    else R = Math.pow((RsRGB + 0.055) / 1.055, 2.4);
    if (GsRGB <= 0.03928) G = GsRGB / 12.92;
    else G = Math.pow((GsRGB + 0.055) / 1.055, 2.4);
    if (BsRGB <= 0.03928) B = BsRGB / 12.92;
    else B = Math.pow((BsRGB + 0.055) / 1.055, 2.4);
    return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

for (let shade of shades) {
    shade.ranges = [];
}

/*for (let h = 0; h < 360; h++) {
	for (let s = 0; s < 100; s++) {
		for (var i = 0; i <= 100; i++) {
			luminance = getLuminance(hslToRgb(h, s, i))
			for (let shade of shades) {
				if (luminance >= shade.min && luminance <= shade.max) {
					shade.ranges.push(i)
				}
			}
		}
		for (let shade of shades) {
			if (shade.ranges.length === 0) {
				console.log(h,s, shade.grade)
			}
			shade.ranges = []
		}
	}
}*/

for (var i = 0; i <= 100; i++) {
    luminance = getLuminance(hslToRgb(58, 100, i));
    for (let shade of shades) {
        if (luminance >= shade.min && luminance <= shade.max) {
            shade.ranges.push(i);
        }
    }
}

console.log(shades);
