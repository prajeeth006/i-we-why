const fs = require("fs");
const path = require("path");
const blueprint = require('./blue-print');

const baseDir = "./configs";
const rootDirectory = path.resolve('./model');

const finalConfigs = [];
const clearConfigsRowsList = [];
const clearConfigsList = [];

createFolder(rootDirectory);

function processConfigInFiles(config) {
  for (const brand in config) {
    console.log("@brand", brand);
    const brandDetails = config[brand];

    // create a brand folder
    let newPath = path.join(baseDir, brand);
    checkAndCreateFolder(config, brand, newPath);

    // create a layout folder
    for (const layout in brandDetails.layouts) {
      console.log("@Layout", layout);


      const layoutDetails = brandDetails.layouts[layout];
      const layoutPath = path.join(newPath, layout);
      checkAndCreateFolder(brandDetails.layouts, layout, layoutPath);

      // create a row folder
      let rows = Object.keys(layoutDetails.rows);

      let finalRow = 0;
      for (let index = 0; index < rows.length; index++) {
        const rowNumber = index + 1;
        const rowDetails = layoutDetails.rows[index];
        const rowPath = path.join(layoutPath, `row${index + 1}`);
        createFolder(rowPath);

        // create a tv folder
        const tvs = Object.keys(rowDetails);

        for (const tv of tvs) {
          let tvNumber = 0;
          let tvDetails = rowDetails[tv];
          const tvPath = path.join(rowPath, tv);
          checkAndCreateFolder(rowDetails, tv, tvPath);
          let screenData = {};

          let positions = [{ row: 1, col: 1 }, { row: 1, col: 2 }, { row: 2, col: 1 }, { row: 2, col: 2 }];
          if (tvDetails.hasSubScreens) {
            tvDetails.screens.map((screenName, index) => {
              let sortOrder = index + 1;
              tvNumber = tvDetails.mapToScreens[index];
              const screenPath = getScreenPath(brand, layout, rowNumber, tv, sortOrder);
              const filename = `${brand}_${layout}_row${rowNumber}_${tv}_${screenName}.json`;
              const filePath = path.join(tvPath, filename);
              screenData = prepareScreenData(tvDetails, tvNumber, screenName, screenName, positions[index], sortOrder);
              writeToFile(filePath, screenData, screenPath);
            })
          } else {
            let sortOrder = 1;
            tvNumber = tvDetails.mapToScreens[0];
            const screenPath = getScreenPath(brand, layout, rowNumber, tv, sortOrder);
            const filename = `${brand}_${layout}_row${rowNumber}_${tv}_${tvDetails.screens.toString()}.json`;
            const filePath = path.join(tvPath, filename);
            screenData = prepareScreenData(tvDetails, tvNumber, tvDetails.ScreenNumber, tvDetails.DisplayName, positions[0], null);
            writeToFile(filePath, screenData, screenPath);
          }
        }

        finalRow = index;
      }

      let lastRow = layoutDetails.rows[finalRow];
      console.log(lastRow);
      
      let screensDummy = Object.keys(lastRow);
      let lastScreen = lastRow[screensDummy[screensDummy.length - 1]];
      console.log(lastScreen);
      
      let totalAvailableScreens = lastScreen.mapToScreens[lastScreen.mapToScreens.length - 1];

      prepareClearConfigModel(brand, layout, totalAvailableScreens);
    }
  }
}

function getDecoderId(screenNameFormatted) {
  switch (screenNameFormatted) {
    case 'sky box a':
      return "TVBOX1"
    case 'sky box b':
      return "TVBOX2"
    default:
      return null;
  }
}

function isDragAllowed(isTvChannel, isPeripheralScreen) {
  if (isTvChannel || isPeripheralScreen) {
    return false;
  } else {
    return true;
  }
}

function isPartOfSequence(isTvChannel, isPeripheralScreen) {
  if (isTvChannel || isPeripheralScreen) {
    return false;
  } else {
    return true;
  }
}

function isDropAllowed(isTv) {
  if (isTv) {
    return false
  } else {
    return true
  }
}

function prepareScreenData(tvDetails, tvNumber, screenNumber, screenName, pos, sortOrder) {
  const screenNameFormatted = !!screenName ? screenName.toString().toLowerCase().trim() : '';

  const isSkyTv = screenNameFormatted.includes('sky');
  const isTv = screenNameFormatted.includes('tv');
  const isTvChannel = isSkyTv || isTv;
  const skipCloning = isTvChannel;
  const hasPreview = !isTvChannel; // if tv channels we can't preview
  const isPeripheralScreen = tvDetails.IsPeripheralScreen;

  const isPartOfSequenceJourney = isPartOfSequence(isTvChannel, isPeripheralScreen);

  const canDraggable = isDragAllowed(isTvChannel, isPeripheralScreen);
  const canDroppable = isDropAllowed(isTv);

  const decoderID = getDecoderId(screenNameFormatted);

  const screenData = {
    ScreenNumber: (isTvChannel || isPeripheralScreen) ? null : screenNumber.toString(),
    Column: tvDetails.Column,
    HaveLayOutOption: tvDetails.HaveLayOutOption,
    Size: tvDetails.Size,

    ScreenType: tvDetails.ScreenType,
    ScreenDetails: {
      Single: [
        {
          ScreenPath: `/Screen${tvNumber}/1`,
          Row: pos.row,
          Column: pos.col,
          ViewId: 1,
          isHalf: false,
          IsPartOfSequence: isPartOfSequenceJourney,
          DisplayName: isNumber(parseInt(screenName)) ? screenName : screenName === null ? "" : screenName,
          DecoderID: decoderID,
          IsTv: isTv,
          IsSkyTv: isSkyTv,
          SkipCloning: skipCloning,
          HasPreview: hasPreview,
          SortOrder: sortOrder,
          CanDraggable: canDraggable,
          CanDroppable: canDroppable,
        },
      ],
      Duo1: [
        {
          ScreenPath: `/Screen${tvNumber}/1`,
          Row: 1,
          Column: 1,
          ViewId: 1,
          isHalf: true,
          IsPartOfSequence: isPartOfSequenceJourney,
          DisplayName: isNumber(parseInt(screenName)) ? screenName + "E" : screenName === null ? "" : screenName,
          DecoderID: decoderID,
          IsTv: isTv,
          IsSkyTv: isSkyTv,
          SkipCloning: skipCloning,
          HasPreview: hasPreview,
          SortOrder: null,
          CanDraggable: canDraggable,
          CanDroppable: canDroppable,
        },
        {
          ScreenPath: `/Screen${tvNumber}/2`,
          Row: 1,
          Column: 2,
          ViewId: 2,
          isHalf: true,
          IsPartOfSequence: isPartOfSequenceJourney,
          DisplayName: isNumber(parseInt(screenName)) ? screenName + "F" : screenName === null ? "" : screenName,
          DecoderID: decoderID,
          IsTv: isTv,
          IsSkyTv: isSkyTv,
          SkipCloning: skipCloning,
          HasPreview: hasPreview,
          SortOrder: null,
          CanDraggable: canDraggable,
          CanDroppable: canDroppable,
        },
      ],
      Trio1: [
        {
          ScreenPath: `/Screen${tvNumber}/1`,
          Row: 1,
          Column: 1,
          ViewId: 1,
          isHalf: true,
          IsPartOfSequence: isPartOfSequenceJourney,
          DisplayName: isNumber(parseInt(screenName)) ? screenName + "E" : screenName === null ? "" : screenName,
          DecoderID: decoderID,
          IsTv: isTv,
          IsSkyTv: isSkyTv,
          SkipCloning: skipCloning,
          HasPreview: hasPreview,
          SortOrder: null,
          CanDraggable: canDraggable,
          CanDroppable: canDroppable,
        },
        {
          ScreenPath: `/Screen${tvNumber}/2`,
          Row: 1,
          Column: 2,
          ViewId: 2,
          isHalf: false,
          IsPartOfSequence: isPartOfSequenceJourney,
          DisplayName: isNumber(parseInt(screenName)) ? screenName + "B" : screenName === null ? "" : screenName,
          DecoderID: decoderID,
          IsTv: isTv,
          IsSkyTv: isSkyTv,
          SkipCloning: skipCloning,
          HasPreview: hasPreview,
          SortOrder: null,
          CanDraggable: canDraggable,
          CanDroppable: canDroppable,
        },
        {
          ScreenPath: `/Screen${tvNumber}/3`,
          Row: 2,
          Column: 2,
          ViewId: 3,
          isHalf: false,
          IsPartOfSequence: isPartOfSequenceJourney,
          DisplayName: isNumber(parseInt(screenName)) ? screenName + "D" : screenName === null ? "" : screenName,
          DecoderID: decoderID,
          IsTv: isTv,
          IsSkyTv: isSkyTv,
          SkipCloning: skipCloning,
          HasPreview: hasPreview,
          SortOrder: null,
          CanDraggable: canDraggable,
          CanDroppable: canDroppable,
        },
      ],
      Trio2: [
        {
          ScreenPath: `/Screen${tvNumber}/1`,
          Row: 1,
          Column: 1,
          ViewId: 1,
          isHalf: false,
          IsPartOfSequence: isPartOfSequenceJourney,
          DisplayName: isNumber(parseInt(screenName)) ? screenName + "A" : screenName === null ? "" : screenName,
          DecoderID: decoderID,
          IsTv: isTv,
          IsSkyTv: isSkyTv,
          SkipCloning: skipCloning,
          HasPreview: hasPreview,
          SortOrder: null,
          CanDraggable: canDraggable,
          CanDroppable: canDroppable,
        },
        {
          ScreenPath: `/Screen${tvNumber}/2`,
          Row: 1,
          Column: 2,
          ViewId: 2,
          isHalf: false,
          IsPartOfSequence: isPartOfSequenceJourney,
          DisplayName: isNumber(parseInt(screenName)) ? screenName + "C" : screenName === null ? "" : screenName,
          DecoderID: decoderID,
          IsTv: isTv,
          IsSkyTv: isSkyTv,
          SkipCloning: skipCloning,
          HasPreview: hasPreview,
          SortOrder: null,
          CanDraggable: canDraggable,
          CanDroppable: canDroppable,
        },
        {
          ScreenPath: `/Screen${tvNumber}/3`,
          Row: 2,
          Column: 1,
          ViewId: 3,
          isHalf: true,
          IsPartOfSequence: isPartOfSequenceJourney,
          DisplayName: isNumber(parseInt(screenName)) ? screenName + "F" : screenName === null ? "" : screenName,
          DecoderID: decoderID,
          IsTv: isTv,
          IsSkyTv: isSkyTv,
          SkipCloning: skipCloning,
          HasPreview: hasPreview,
          SortOrder: null,
          CanDraggable: canDraggable,
          CanDroppable: canDroppable,
        },
      ],
      Quad: [
        {
          ScreenPath: `/Screen${tvNumber}/1`,
          Row: 1,
          Column: 1,
          ViewId: 1,
          isHalf: false,
          IsPartOfSequence: isPartOfSequenceJourney,
          DisplayName: isNumber(parseInt(screenName)) ? screenName + "A" : screenName === null ? "" : screenName,
          DecoderID: decoderID,
          IsTv: isTv,
          IsSkyTv: isSkyTv,
          SkipCloning: skipCloning,
          HasPreview: hasPreview,
          SortOrder: null,
          CanDraggable: canDraggable,
          CanDroppable: canDroppable,
        },
        {
          ScreenPath: `/Screen${tvNumber}/2`,
          Row: 1,
          Column: 2,
          ViewId: 2,
          isHalf: false,
          IsPartOfSequence: isPartOfSequenceJourney,
          DisplayName: isNumber(parseInt(screenName)) ? screenName + "B" : screenName === null ? "" : screenName,
          DecoderID: decoderID,
          IsTv: isTv,
          IsSkyTv: isSkyTv,
          SkipCloning: skipCloning,
          HasPreview: hasPreview,
          SortOrder: null,
          CanDraggable: canDraggable,
          CanDroppable: canDroppable,
        },
        {
          ScreenPath: `/Screen${tvNumber}/3`,
          Row: 2,
          Column: 1,
          ViewId: 3,
          isHalf: false,
          IsPartOfSequence: isPartOfSequenceJourney,
          DisplayName: isNumber(parseInt(screenName)) ? screenName + "C" : screenName === null ? "" : screenName,
          DecoderID: decoderID,
          IsTv: isTv,
          IsSkyTv: isSkyTv,
          SkipCloning: skipCloning,
          HasPreview: hasPreview,
          SortOrder: null,
          CanDraggable: canDraggable,
          CanDroppable: canDroppable,
        },
        {
          ScreenPath: `/Screen${tvNumber}/4`,
          Row: 2,
          Column: 2,
          ViewId: 4,
          isHalf: false,
          IsPartOfSequence: isPartOfSequenceJourney,
          DisplayName: isNumber(parseInt(screenName)) ? screenName + "D" : screenName === null ? "" : screenName,
          DecoderID: decoderID,
          IsTv: isTv,
          IsSkyTv: isSkyTv,
          SkipCloning: skipCloning,
          HasPreview: hasPreview,
          SortOrder: null,
          CanDraggable: canDraggable,
          CanDroppable: canDroppable,
        },
      ],
    },
  };


  return screenData;
}

function isNumber(value) {
  return typeof value === 'number' && !isNaN(value);
}



function checkAndCreateFolder(data, keyName, newPath) {
  switch (data[keyName].type) {
    case "FOLDER":
      createFolder(newPath);
  }
}

function createFolder(folderName) {
  if (!fs.existsSync(folderName)) {
    fs.mkdirSync(folderName, { recursive: true });
  }
}

function writeToFile(filePath, screenData, screenPath) {
  const data = JSON.stringify(screenData);
  const formattedData = JSON.stringify(screenData, null, 2);

  eachScreen = JSON.parse(JSON.stringify({
    screenPath: screenPath,
    screenData: data,
    screenType: screenData.ScreenType
  }));

  finalConfigs.push(eachScreen);
  fs.writeFileSync(filePath, formattedData);
}


function toTitleCase(txt) {
  return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
}

function getScreenPath(brand, layout, rowNumber, screenNumber, sortOrder) {
  let layoutName = layout.toLowerCase();
  let row = 1;
  let folderName = "GantryScreens";
  if ((layoutName === '5' && rowNumber === 2) || (layoutName === 'super a' && rowNumber === 2) || (rowNumber === 3)) {
    folderName = "PeripheralScreens"
  } else {
    row = rowNumber === 3 ? 1 : rowNumber;
  }
  return `/sitecore/content/Gantry/DisplayManager/RightPanelIndividual/${toTitleCase(brand)}/Mappings/${layout}/${folderName}/Row${row}/${toTitleCase(screenNumber)}/S${sortOrder}`
}

function prepareClearConfigModel(brand, layout, totalAvailableScreens) {

  for (let x = 0; x < totalAvailableScreens; x++) {
    for (let y = 0; y < 4; y++) {
      let path1 = `/sitecore/content/Gantry/DisplayManager/RightPanelIndividual/${brand}/Screens/${layout}/Screen${x+1}/${y+1}`;
      let path2 = `/sitecore/content/Gantry/DisplayManager/RightPanelIndividual/${brand}/Screens/${layout}/Screen${x+1}/${y+1}/Rule`;
      clearConfigsList.push(path1);
      clearConfigsRowsList.push(path2);
    }
  }
  createModel('individual-gantry-screens-clear-configs.mock.ts', clearConfigsList, "clearGantryScreensConfigsList");
  createModel('individual-gantry-screens-clear-rows.mock.ts', clearConfigsRowsList, "clearGantryScreenRowsConfigsList");
}


function createModel(fileName, data, exportName) {
  const filePath = path.join(rootDirectory, fileName);
  const minifiedContent = JSON.stringify(data, null, 2);
  fs.writeFileSync(filePath, `export const ${exportName} = ${minifiedContent};`, "utf8");
}


processConfigInFiles(blueprint.layoutConfig);

createModel('individual-gantry-screens.mock.ts', finalConfigs, "newGantryScreensConfig");