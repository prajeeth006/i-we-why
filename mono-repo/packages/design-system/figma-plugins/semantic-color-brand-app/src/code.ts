import tinycolor from 'tinycolor2';

import {
    computeColorListByPalette,
    getColorPaletteOptions,
    getMode,
    getReferencedColorPalette,
    linkFixedOptions,
    loadFixedLinkingOptions,
} from './helpers';
import {
    getColorMode,
    getCurrentState,
    getCurrentStateIndex,
    getMyStates,
    getReferenceFile,
    getSelectedOptionValue,
    getTheme,
    getVariant,
    hasInverseNo,
    hasInverseYes,
    hasSelectedOption,
    isDarkMode,
    nextState,
    prevState,
    resetState,
    setSelectedOptionValue,
    setState,
    usesDisabledStates,
    usesSupportingStates,
} from './state-manager';
import { StateOption } from './states';

let isSpeedMode = false;

function createPreviewFor(name: string) {
    const myStates = getMyStates();
    const baseKey = name.replace('_inverse', '').replace('_selected', '');
    const inversePostfix = name.endsWith('_inverse') ? '_inverse' : '';

    let text_message = '';
    const text_key = 'on_' + baseKey + inversePostfix;
    let text_name = '';
    if (hasSelectedOption(text_key)) {
        const textState = myStates.find((x) => x.key === text_key);
        if (textState == null) {
            throw Error('Text state not found');
        }
        text_name = textState.key
            .replace('_color', '')
            .split('_')
            .map((str) => str.charAt(0).toUpperCase() + str.slice(1))
            .join(' ');
        text_message = `<span style='color: ${getSelectedOptionValue(text_key).split('_')[1]}'>
      ${text_name}
    </span>
    `;
    }

    const base_name = (baseKey + inversePostfix)
        .replace('_color', '')
        .split('_')
        .map((str) => str.charAt(0).toUpperCase() + str.slice(1))
        .join(' ');

    const cssProperty = name.includes('outline') ? 'borderColor' : 'backgroundColor';
    const cssProperty2 = name.includes('outline') ? 'border: 2px solid' : 'background-color:';

    let mouseEvents = '';
    if (hasSelectedOption(baseKey + '_active' + inversePostfix)) {
        mouseEvents += `
      onMouseDown="this.style.${cssProperty}='${getSelectedOptionValue(baseKey + '_active' + inversePostfix).split('_')[1]}'"
      onMouseUp="this.style.${cssProperty}='${getSelectedOptionValue(baseKey + '_hover' + inversePostfix).split('_')[1]}'"
      onMouseEnter="this.style.${cssProperty}='${getSelectedOptionValue(baseKey + '_hover' + inversePostfix).split('_')[1]}'"
      onMouseLeave="this.style.${cssProperty}='${getSelectedOptionValue(baseKey + inversePostfix).split('_')[1]}'"
    `;
    }

    let defaultColor = 'color: #2b2b2b;';
    let defaultColorLight = 'color: #727272;';
    let inverseColor = 'color: white;';
    let inverseColorLight = 'color: #C3C3C3;';
    if (isDarkMode()) {
        defaultColor = 'color: white;';
        defaultColorLight = 'color: #C3C3C3;';
        inverseColor = 'color: #2b2b2b;';
        inverseColorLight = 'color: #727272;';
    }

    let message = '';
    message += `<div style='display: flex; gap: 16px; ${inversePostfix != '' ? inverseColor : defaultColor}'>`;

    message += "<div style='display: flex: flex-direction: column;'>";
    message += `<div
      ${mouseEvents}
      style='display: flex; justify-content: center; align-items: center; padding: 8px; width: 380px; height: 85px; ${cssProperty2} ${getSelectedOptionValue(baseKey + inversePostfix).split('_')[1]}'>
        ${text_message}
      </div>`;

    let paletteName1 = getColorMode().split('_')[2];
    let paletteName2 = paletteName1;
    if (colorListsValues[baseKey + inversePostfix] != null) {
        paletteName1 = colorListsValues[baseKey + inversePostfix].split('_')[2];
    }
    if (colorListsValues[text_key] != null) {
        paletteName2 = colorListsValues[text_key].split('_')[2];
    }

    message += "<div style='display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; margin-top: 12px;'>";
    message += `<div style='display: flex; flex-direction:column; gap: 8px;'>
    <span style='height: 20px; font-size: 14px; font-weight: 500;'>
      ${base_name}
    </span>
    <div style="display: flex; align-items: center; gap: 8px;">
      <div style='display: inline-block; width: 24px; height: 24px; background-color: ${getSelectedOptionValue(baseKey + inversePostfix).split('_')[1]};'></div>
      <div style='display: flex; flex-direction: column;'>
        <span style='line-height: 18px; font-size: 14px;'>${paletteName1} - Grade ${getSelectedOptionValue(baseKey + inversePostfix).split('_')[0]}</span>
        <span style='line-height: 18px; font-size: 12px; ${inversePostfix != '' ? inverseColorLight : defaultColorLight}'>${getSelectedOptionValue(baseKey + inversePostfix).split('_')[1]}</span>
      </div>
    </div>
  </div>`;

    if (hasSelectedOption(text_key)) {
        message += `<div style='display: flex; flex-direction:column; gap: 8px;'>
    <span style='height: 20px; font-size: 14px; font-weight: 500;'>
    ${text_name}
    </span>
    <div style="display: flex; align-items: center; gap: 8px;">
      <div style='display: inline-block; width: 24px; height: 24px; background-color: ${getSelectedOptionValue(text_key).split('_')[1]};'></div>
      <div style='display: flex; flex-direction: column;'>
        <span style='line-height: 18px; font-size: 14px;'>${paletteName2} - Grade ${getSelectedOptionValue(text_key).split('_')[0]}</span>
        <span style='line-height: 18px; font-size: 12px; ${inversePostfix != '' ? inverseColorLight : defaultColorLight}'>${getSelectedOptionValue(text_key).split('_')[1]}</span>
      </div>
    </div>
  </div>`;
    }
    message += '</div>';
    message += '</div>';

    message += "<div style='height: 85px; display: flex; align-items: center; justify-content: center;'>";
    if (inversePostfix == '' || hasInverseYes()) {
        message += `<button class='button-text button-edit button-edit-${baseKey + inversePostfix}' style="margin: 0; display: inline-flex; align-items: center; justify-content: center; ${inversePostfix != '' ? inverseColor : defaultColor}">
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M12.4444 0L16 3.55556L6.22222 13.3333L2.66667 9.77778L12.4444 0Z"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M0 16L1.77778 10.6667L5.33333 14.2222L0 16Z"/>
  </svg>
  <span>Edit</span>
  </button>`;
    }
    message += '</div>';

    message += '</div>';
    return message;
}

function createPreviewWindow() {
    const state = getCurrentState();
    const key = state.key;

    let base_key = key.replace('_inverse', '').replace('_selected', '');
    let text_message = '';
    const inversePostfix = key.endsWith('_inverse') ? '_inverse' : '';
    if (key.startsWith('on_')) {
        base_key = base_key.replace('on_', '');
        text_message = `<span style='color: ${getSelectedOptionValue('on_' + base_key + inversePostfix).split('_')[1]}'>
      ${state.key
          .replace('_color', '')
          .split('_')
          .map((str) => str.charAt(0).toUpperCase() + str.slice(1))
          .join(' ')}
    </span>
    `;
    }

    const cssProperty = key.includes('outline') ? 'borderColor' : 'backgroundColor';
    const cssProperty2 = key.includes('outline') ? 'border: 2px solid' : 'background-color:';

    let mouseEvents = '';
    if (hasSelectedOption(base_key + '_active' + inversePostfix)) {
        mouseEvents += `
      onMouseDown="this.style.${cssProperty}='${getSelectedOptionValue(base_key + '_active' + inversePostfix).split('_')[1]}'"
      onMouseUp="this.style.${cssProperty}='${getSelectedOptionValue(base_key + '_hover' + inversePostfix).split('_')[1]}'"
      onMouseEnter="this.style.${cssProperty}='${getSelectedOptionValue(base_key + '_hover' + inversePostfix).split('_')[1]}'"
      onMouseLeave="this.style.${cssProperty}='${getSelectedOptionValue(base_key + inversePostfix).split('_')[1]}'"
    `;
    }

    const backgroundColor =
        (getTheme() === 'Light Mode' && inversePostfix === '') || (getTheme() === 'Dark Mode' && inversePostfix !== '') ? 'white' : '#444';

    let message = '';
    message += `<div style='width: 300px; display: flex; flex-direction: column; justify-content: center;'>`;
    message += "<p style='font-size: 16px; line-height: 18px; text-align: center;'>Preview Window</p>";
    message += `<div style='width: 100%; border: 2px solid #AAAAAA; border-radius: 4px; display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 32px; padding: 16px; background-color: ${backgroundColor}'>`;
    message += '<span></span>';
    message += `<div
      ${mouseEvents}
      style='display: flex; justify-content: center; align-items: center; padding: 8px; width: 80%; height: 85px; ${cssProperty2} ${getSelectedOptionValue(base_key + inversePostfix).split('_')[1]}'>
        ${text_message}
      </div>`;
    message += "<button class='button-outline button-refresh'>Refresh</button>";
    message += '</div>';
    message += '</div>';
    return message;
}

function setVariantOptions(currentOption: StateOption) {
    if (!currentOption.variants) {
        return;
    }

    for (const variant of currentOption.variants) {
        const colorGrades = withCondition(allOptions, isDarkMode() ? variant.condition_dark : variant.condition);
        if (colorGrades.length !== 1) {
            throw Error('Invalid variant selection, please check code should not happen');
        }
        const colorGrade = colorGrades[0];
        const cList = getCurrentState().key in colorLists ? colorLists[getCurrentState().key] : colorList;
        if (cList[colorGrade].length !== 1) {
            throw Error('Invalid variant selection, please check code should not happen');
        }
        const color = cList[colorGrade][0];
        setSelectedOptionValue(variant.key, `${colorGrade}_${color.color.toHexString()}`);
    }
}

async function createVar(
    variablePath: string[] | undefined,
    selectedKey: string,
    modeId: string,
    semanticCollection: VariableCollection,
    localVariables: Variable[],
    referencedColorMode: string,
) {
    if (variablePath == null) {
        return;
    }

    const variableName = variablePath
        .map((x) => x.replace('{variant}', getVariant()).replace('{color_mode_referenced}', referencedColorMode).toLowerCase())
        .join('/');

    let variable = localVariables.find(
        (localVariable) => localVariable.variableCollectionId === semanticCollection?.id && localVariable.name === variableName,
    );
    if (variable == null) {
        variable = figma.variables.createVariable(variableName, semanticCollection, 'COLOR');
    }

    const gradeSelected = getSelectedOptionValue(selectedKey).split('_')[0];
    const valueForOutput = getSelectedOptionValue(selectedKey).split('_')[1];
    const cList = selectedKey in colorLists ? colorLists[selectedKey] : colorList;

    if (cList[gradeSelected].length === 1 && cList[gradeSelected][0].reference != null) {
        const refParts = cList[gradeSelected][0].reference!.split('_');
        if (refParts[2] === 'team') {
            const impVariable = await figma.variables.importVariableByKeyAsync(refParts[1]);
            variable.setValueForMode(modeId, { type: 'VARIABLE_ALIAS', id: impVariable.id });
        } else {
            variable.setValueForMode(modeId, { type: 'VARIABLE_ALIAS', id: refParts[1] });
        }
    } else {
        const color = tinycolor(valueForOutput).toRgb();
        variable.setValueForMode(modeId, { r: color.r / 255.0, g: color.g / 255.0, b: color.b / 255.0, a: color.a });
    }
}

async function createVars() {
    const collections = await figma.variables.getLocalVariableCollectionsAsync();
    const localVariables = await figma.variables.getLocalVariablesAsync();

    /*let semanticCollection = collections.find((x) => x.name.startsWith('semantic'));
    if (semanticCollection == null) {
        semanticCollection = figma.variables.createVariableCollection('semantic');
    }*/
    const semanticCollection = collections.find((x) => x.id === getSelectedOptionValue('target_collection'));
    if (semanticCollection == null) {
        figma.notify('Selected target collection does not exist anymore', { error: true });
        return;
    }
    const modeNamePart = await getMode(getColorMode());
    const modeName = `${modeNamePart} ${getTheme().replace(' Mode', '').toLowerCase()}`;

    let modeId = semanticCollection.modes.find((mode) => mode.name === modeName)?.modeId;
    if (modeId == null) {
        modeId = semanticCollection.addMode(modeName);
    }

    const myStates = getMyStates();

    const referencedColorMode = getReferencedColorPalette(getColorMode());

    for (const state of myStates) {
        await createVar(state.variablePath, state.key, modeId, semanticCollection, localVariables, referencedColorMode);

        if (state.variants) {
            for (const subState of state.variants) {
                await createVar(subState.variablePath, subState.key, modeId, semanticCollection, localVariables, referencedColorMode);
            }
        }
    }
}

function getBreadcrumb() {
    const breadcrumb: string[] = [];
    const myStates = getMyStates();

    for (let i = 0; i < getCurrentStateIndex(); i++) {
        const state = myStates[i];
        if (state.breadcrumb) {
            breadcrumb.push(
                state.breadcrumb.replace(`{${state.key}}`, state.key === 'reference_file' ? brandName : (getSelectedOptionValue(state.key) ?? '')),
            );
        }
    }
    return breadcrumb.join(' > ');
}

async function handleMessage(msg: { type: string; data: string; isCacheResetChecked?: boolean }) {
    if (msg.type === 'reset') {
        figma.ui.postMessage({ message: '', type: 'reset' });
        return;
    }

    let varCreated = false;

    if (msg.type === 'create-linking-selection') {
        let message = '';

        const data = JSON.parse(msg.data) as {
            social_colors: boolean;
            radius: boolean;
            spacing: boolean;
            sizing: boolean;
            typography: boolean;
        };

        figma.ui.postMessage({ message: 'Please wait, creation in progress...', type: 'step-update' });

        message += '<div>';
        message += await linkFixedOptions(data);
        message += '</div>';
        message += '<div>';
        message += `<button class='button-cancel button-outline' id='cancel'>Start over</button>`;
        message += '</div>';

        figma.ui.postMessage({ message: message, type: 'step-update' });
        return;
    }

    if (msg.type === 'create-vars') {
        await createVars();
        varCreated = true;
    }

    if (msg.type === 'get-started') {
        resetState();
        colorLists = {};
        colorListsValues = {};
        isSpeedMode = msg.isCacheResetChecked ? false : true;
    }

    const myStates = getMyStates();

    if (msg.type === 'edit') {
        const editIndex = myStates.findIndex((x) => x.key === msg.data);
        if (editIndex === -1) {
            throw Error('Edit not found');
        }
        setState(editIndex);
    }

    if (msg.type === 'next-step' || msg.type === 'refresh') {
        const currentOption = getCurrentState();
        const isException =
            hasSelectedOption(currentOption.key + '_exception') && getSelectedOptionValue(currentOption.key + '_exception') === 'true';

        setSelectedOptionValue(currentOption.key, msg.data);

        if (currentOption.variants) {
            for (const variant of currentOption.variants) {
                //const stateOptions = (isDarkMode()) ? option.options_dark : option.options;
                const colorGrades = withCondition(allOptions, isDarkMode() != isException ? variant.condition_dark : variant.condition);
                if (colorGrades.length !== 1) {
                    throw Error('Invalid variant selection, please check code should not happen');
                }
                const colorGrade = colorGrades[0];
                const cList = getCurrentState().key in colorLists ? colorLists[getCurrentState().key] : colorList;
                if (cList[colorGrade].length !== 1) {
                    throw Error('Invalid variant selection, please check code should not happen');
                }
                const color = cList[colorGrade][0];
                setSelectedOptionValue(variant.key, `${colorGrade}_${color.color.toHexString()}`);
            }
        }

        if (currentOption.type === 'color_palette' && currentOption.key == 'color_mode') {
            figma.ui.postMessage({ message: 'Taking time... importing data', type: 'step-update' });
            colorList = await computeColorListByPalette(msg.data);
        }
        if (currentOption.type === 'color_palette' && currentOption.key == 'reference_file') {
            const colorPaletteOptions = await getColorPaletteOptions('reference_file', true);
            brandName = colorPaletteOptions[msg.data];
        }
        // Skip to end if no inverse, copy all colors to inverse
        if (currentOption.key === 'has_inverse' && msg.data === 'no') {
            for (const state of myStates) {
                if (state.variablePath == null) {
                    continue;
                }
                if (state.key.endsWith('_inverse')) {
                    setSelectedOptionValue(state.key, getSelectedOptionValue(state.key.replace('_inverse', '')));
                }
                for (const stateVariant of state.variants ?? []) {
                    setSelectedOptionValue(stateVariant.key, getSelectedOptionValue(stateVariant.key.replace('_inverse', '')));
                }
            }
            setState(myStates.length - 1);
        }

        if (msg.type === 'next-step') {
            nextState();
        }
    }

    if (msg.type === 'prev-step') {
        prevState();
        // If there is not an inverse, skip all inverse states
        if (hasInverseNo()) {
            while (getCurrentStateIndex() < myStates.length && getCurrentState().key.endsWith('_inverse')) {
                prevState();
            }
        }
        // If there was only on option to select, continue to go back
        /*while (currentState >= 0) {
            const option = getCurrentState();
            const stateOptions = isDarkMode() ? option.options_dark : option.options;
            const stateCondition = isDarkMode() ? option.condition_dark : option.condition;
            const sel = withCondition(stateOptions, stateCondition);
            if (sel.length > 1) {
                break;
            }
            if (option.type === 'color_palette') {
                const colorPaletteOptions = await getColorPaletteOptions(option.key === 'reference_file' ? 'reference_file' : 'color_mode');
                if (Object.keys(colorPaletteOptions).length > 1) {
                    break;
                }
            }
            currentState--;
        }*/

        if (getCurrentStateIndex() < 0) {
            setState(0);
        }
    }

    let message = '';

    // Header
    message += `<div><button class="button-prev-step button-text"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M12.8655 13.6042L8.98925 10.0224L12.8551 6.42074C13.0208 6.27005 13.1146 6.06086 13.1146 5.84207C13.1146 5.62329 13.0208 5.41409 12.8551 5.26341C12.6862 5.09511 12.4529 5 12.2091 5C11.9653 5 11.732 5.09511 11.563 5.26341L7.13446 9.44376C6.9688 9.59445 6.875 9.80364 6.875 10.0224C6.875 10.2412 6.9688 10.4504 7.13446 10.6011L11.6255 14.7615C11.9722 15.0795 12.5189 15.0795 12.8655 14.7615C13.0312 14.6108 13.125 14.4016 13.125 14.1828C13.125 13.964 13.0312 13.7549 12.8655 13.6042Z"/></svg>Back</button></div>`;
    message += '<h2>Semantic Variables Generator</h2>';

    message += `<div class="breadcrumb">${getBreadcrumb()}</div>`;

    if (getCurrentStateIndex() >= myStates.length) {
        message += "<div style='display: flex; flex-direction: column; gap: 8px;'>";
        message += `<h3 class="state-header">Preview - See your semantic variables for ${(getVariant() ?? '').toUpperCase()}</h3>`;

        const isDisabledState = usesDisabledStates();
        const isSupportingState = usesSupportingStates();

        message += "<div style='display: flex; flex-direction: row;'>";

        if (isDisabledState) {
            message += `<div style='background-color: ${getTheme() === 'Light Mode' ? 'white' : '#444'}; display: flex; flex-direction: column; gap: 8px; padding: 8px;'>`;
            message += createPreviewFor('base_color');
            message += createPreviewFor('outline_base_color');
            message += '</div>';

            message += `<div style='background-color: ${getTheme() === 'Light Mode' ? '#444' : 'white'}; display: flex; flex-direction: column; gap: 8px; padding: 8px;'>`;
            message += createPreviewFor('base_color_inverse');
            message += createPreviewFor('outline_base_color_inverse');
            message += '</div>';
        } else if (isSupportingState) {
            message += `<div style='background-color: ${getTheme() === 'Light Mode' ? 'white' : '#444'}; display: flex; flex-direction: column; gap: 8px; padding: 8px;'>`;
            message += createPreviewFor('supporting_tint_color');
            message += createPreviewFor('supporting_subtle_color');
            message += createPreviewFor('supporting_base_color');
            message += createPreviewFor('supporting_strong_color');
            message += createPreviewFor('supporting_shade_color');
            message += '</div>';
        } else {
            message += `<div style='background-color: ${getTheme() === 'Light Mode' ? 'white' : '#444'}; display: flex; flex-direction: column; gap: 8px; padding: 8px;'>`;
            message += createPreviewFor('base_color');
            message += createPreviewFor('outline_base_color');
            message += createPreviewFor('container_base_color');
            message += '</div>';

            message += `<div style='background-color: ${getTheme() === 'Light Mode' ? '#444' : 'white'}; display: flex; flex-direction: column; gap: 8px; padding: 8px;'>`;
            message += createPreviewFor('base_color_inverse');
            message += createPreviewFor('outline_base_color_inverse');
            message += createPreviewFor('container_base_color_inverse');
            message += '</div>';
        }
        message += '</div>';

        const referencedColorMode = getReferencedColorPalette(getColorMode());

        message += '<div>';
        message += '<h3>Variables</h3>';
        message += `<pre>`;
        for (const state of myStates) {
            if (state.variablePath == null) {
                continue;
            }
            const varName = state.variablePath
                .map((x) =>
                    x.replace('{variant}', getVariant()).replace('{color_mode_referenced}', referencedColorMode).replace(' ', '-').toLowerCase(),
                )
                .join('-');
            const gradeSelected = getSelectedOptionValue(state.key).split('_')[0];
            let valueForOutput = getSelectedOptionValue(state.key).split('_')[1];
            const cList = state.key in colorLists ? colorLists[state.key] : colorList;
            if (cList[gradeSelected].length === 1) {
                if (cList[gradeSelected][0].referenceName) {
                    valueForOutput = `var(--${cList[gradeSelected][0].referenceName},${valueForOutput})`;
                }
                message += `--${varName}: ${valueForOutput}\n`;
            } else {
                message += `--${varName}: ${valueForOutput}\n`;
            }
        }
        message += `</pre>`;

        const collections = await figma.variables.getLocalVariableCollectionsAsync();
        const semanticCollection = collections.find((x) => x.id === getSelectedOptionValue('target_collection'));
        if (semanticCollection != null) {
            const modeName = await getMode(getColorMode());
            message += `<button class='button-create-vars'>Create Or Update Variables for ${semanticCollection.name}/${modeName} ${getTheme().replace(' Mode', '').toLowerCase()}/color/${getVariant().toLowerCase()}${getVariant() === 'Supporting' ? '/' + referencedColorMode : ''} </button>`;
        } else {
            figma.notify('Selected target collection does not exist anymore', { error: true });
        }
        message += `<button class='button-cancel button-outline' id='cancel'>${varCreated ? 'Start new' : 'Start over'}</button>`;
        message += '</div>';

        figma.ui.postMessage({ message: message, type: 'step-update' });
        return;
    }

    const option = getCurrentState();

    if (msg.type === 'color-palette-change') {
        figma.ui.postMessage({ message: 'Taking time... importing data', type: 'step-update' });
        colorLists[option.key] = await computeColorListByPalette(msg.data);
        colorListsValues[option.key] = msg.data;
    }

    if (msg.type === 'color-palette-exception') {
        setSelectedOptionValue(option.key + '_exception', msg.data ? 'true' : 'false');
        if (option.key != 'outline_base_color' && option.key != 'outline_base_color_inverse') {
            setSelectedOptionValue('on_' + option.key + '_exception', msg.data ? 'true' : 'false');
        }
        for (const optionVariant of option.variants ?? []) {
            setSelectedOptionValue(optionVariant.key + '_exception', msg.data ? 'true' : 'false');
            if (option.key != 'outline_base_color' && option.key != 'outline_base_color_inverse') {
                setSelectedOptionValue('on_' + optionVariant.key + '_exception', msg.data ? 'true' : 'false');
            }
        }
        // Special handling for outline
        if (option.key === 'container_base_color') {
            setSelectedOptionValue('on_outline_base_color_exception', msg.data ? 'true' : 'false');
        }
        if (option.key === 'container_base_color_inverse') {
            setSelectedOptionValue('on_outline_base_color_inverse_exception', msg.data ? 'true' : 'false');
        }
    }

    message += `<h3 class="state-header">${option.header.replace('{variant}', (getVariant() ?? '').toUpperCase())}</h3>`;

    const isException = hasSelectedOption(option.key + '_exception') && getSelectedOptionValue(option.key + '_exception') === 'true';
    const stateOptions = isDarkMode() !== isException ? option.options_dark : option.options;
    const stateCondition = isDarkMode() !== isException ? option.condition_dark : option.condition;

    let isChecked = true;
    if (hasSelectedOption(option.key)) {
        isChecked = false;
    }

    if (option.type === 'color') {
        const colorPaletteOptions = await getColorPaletteOptions('color_mode', true);
        const [referenceKey, referenceModeKey, referenceSource] = getReferenceFile().split('_');
        message += "<label>Color: <select class='color-palette-change'>";
        for (const modeKey in colorPaletteOptions) {
            // Only show collections referencing the selected reference file
            if (modeKey.startsWith(referenceKey + '_' + referenceModeKey) && modeKey.endsWith(referenceSource)) {
                const isSelectedOption = option.key in colorListsValues && colorListsValues[option.key] === modeKey;
                const isDefaultOption = !(option.key in colorListsValues) && getColorMode() === modeKey;

                message += `<option ${isSelectedOption || isDefaultOption ? 'selected' : ''} value='${modeKey}'>${colorPaletteOptions[modeKey]}</option>`;
            }
        }
        message += '</select></label>';

        message += "<div style='display: flex; flex-direction: row; justify-content: space-between;'>";
        message += '<div>';
        const colorGrades = withCondition(stateOptions, stateCondition);
        for (const colorGrade of colorGrades) {
            const cList = option.key in colorLists ? colorLists[option.key] : colorList;
            if (cList[colorGrade].length === 1) {
                const color = cList[colorGrade][0];
                const option_value = `${colorGrade}_${color.color.toHexString()}`;
                message += `<p style='display: flex; flex-direction: column;'>
            <label style='display: flex; align-items: center; gap: 8px;'>
              <input ${isChecked || (hasSelectedOption(option.key) && getSelectedOptionValue(option.key) === option_value) ? 'checked' : ''} type='radio' name='step_value' value='${option_value}'>
              Grade ${colorGrade}
            </label>
            <div style='display: flex; align-items: center; gap: 8px;'><span style='background-color: ${color.color.toRgbString()}; display: inline-block; width: 24px; height: 24px;'></span>${color.color.toHslString()}</div>
          </p>`;
                if (isChecked || (hasSelectedOption(option.key) && getSelectedOptionValue(option.key) === option_value)) {
                    setSelectedOptionValue(option.key, option_value);
                    setVariantOptions(option);
                }
                isChecked = false;
            } else {
                message += `<p>Grade ${colorGrade}:</p> <div style='display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px;'>`;
                for (const color of cList[colorGrade]) {
                    const option_value = `${colorGrade}_${color.color.toHexString()}`;
                    message += `<label style='display: flex; align-items: center; gap: 8px;'><input ${isChecked || (hasSelectedOption(option.key) && getSelectedOptionValue(option.key) === option_value) ? 'checked' : ''} type='radio' name='step_value' value='${option_value}'><span style='background-color: ${color.color.toRgbString()}; display: inline-block; width: 32px; height: 32px;'></span> ${color.color.toHslString()}</label>`;
                    if (isChecked || (hasSelectedOption(option.key) && getSelectedOptionValue(option.key) === option_value)) {
                        setSelectedOptionValue(option.key, option_value);
                        setVariantOptions(option);
                    }
                    isChecked = false;
                }
                message += '</div>';
            }
        }

        if (!option.key.startsWith('on_')) {
            message += '<h3>Can’t find your color shade?</h3>';
            message += `<label><input type='checkbox' name="isException" class="color-palette-exception" ${isException ? 'checked' : ''} ${option.key.startsWith('on_') ? 'disabled' : ''}>Add exception to the rule<br><span style='color:red'><small>By adding an exception you will break accessibility contrast ratio of 4.5. Please notify the team on the color choice.</small></span> </label>`;
        }
        message += '</div>';

        message += createPreviewWindow();
        message += '</div>';
    }
    if (option.type === 'radio') {
        message += "<div style='display: flex; flex-direction: column; gap: 8px;'>";
        for (const optionValue of stateOptions) {
            message += `<label style='display: flex; align-items: center; gap: 8px;'><input ${isChecked || (hasSelectedOption(option.key) && getSelectedOptionValue(option.key) === optionValue) ? 'checked' : ''} type='radio' name='step_value' value='${optionValue}'><span>${optionValue}</span></label>`;
            isChecked = false;
        }
        message += '</div>';
    }
    if (option.type === 'semantic_collection') {
        const semanticCollectionOptions = await figma.variables.getLocalVariableCollectionsAsync();
        message += "<div style='display: flex; flex-direction: column; gap: 8px;'>";
        for (const optionValue of semanticCollectionOptions) {
            message += `<label style='display: flex; align-items: center; gap: 8px;'><input ${isChecked || (hasSelectedOption(option.key) && getSelectedOptionValue(option.key) === optionValue.id) ? 'checked' : ''} type='radio' name='step_value' value='${optionValue.id}'><span>${optionValue.name}</span></label>`;
            isChecked = false;
        }
        message += '</div>';
    }
    if (option.type === 'fixed_linking_selection') {
        const fixedLinkingOptions = loadFixedLinkingOptions();
        message += "<div style='display: flex; flex-direction: column; gap: 8px;'>";
        for (const element of fixedLinkingOptions) {
            message += `<label style='display: flex; align-items: center; gap: 8px;'><input checked type='checkbox' class="input-checkbox" name='${element.key}' value='${element.value}'><span>${element.name}</span></label>`;
        }
        message += '</div>';
        message += `<div class='footer'>`;
        message += `<button class='button-linking-selection'>Create Default Variables</button>`;
        //message += `<button class='button-prev-step'>Back</button>`;
        message += `<button class='button-cancel button-outline' id='cancel'>Cancel</button>`;
        message += `</div>`;

        figma.ui.postMessage({ message: message, type: 'step-update' });
        return;
    }
    if (option.type === 'color_palette') {
        figma.ui.postMessage({ message: 'Taking time... importing data', type: 'step-update' });

        const colorPaletteOptions = await getColorPaletteOptions(
            option.key === 'reference_file' ? 'reference_file' : 'color_mode',
            isSpeedMode || option.key !== 'reference_file',
        );

        message += "<div style='display: flex; flex-direction: column; gap: 8px;'>";
        if (option.key === 'reference_file') {
            for (const modeKey in colorPaletteOptions) {
                message += `<label style='display: flex; align-items: center; gap: 8px;'><input ${isChecked || (hasSelectedOption(option.key) && getSelectedOptionValue(option.key) === modeKey) ? 'checked' : ''} type='radio' name='step_value' value='${modeKey}'><span>${colorPaletteOptions[modeKey]}</span></label>`;
                isChecked = false;
            }
        } else {
            const [referenceKey, referenceModeKey, referenceSource] = getReferenceFile().split('_');
            for (const modeKey in colorPaletteOptions) {
                // Only show collections referencing the selected reference file
                if (modeKey.startsWith(referenceKey + '_' + referenceModeKey) && modeKey.endsWith(referenceSource)) {
                    message += `<label style='display: flex; align-items: center; gap: 8px;'><input ${isChecked || (hasSelectedOption(option.key) && getSelectedOptionValue(option.key) === modeKey) ? 'checked' : ''} type='radio' name='step_value' value='${modeKey}'><span>${colorPaletteOptions[modeKey]}</span></label>`;
                    isChecked = false;
                }
            }
        }
        message += '</div>';

        message += ``;
    }

    message += `<div class='footer'>`;
    message += `<button class='button-next-step'>Continue</button>`;
    //message += `<button class='button-prev-step'>Back</button>`;
    message += `<button class='button-cancel button-outline' id='cancel'>Cancel</button>`;
    message += `</div>`;

    figma.ui.postMessage({ message: message, type: 'step-update' });
}

function withCondition(options: string[], condition?: string) {
    if (condition == null) {
        return options;
    }
    const conditionParts = condition.split(' ');

    const command1 = conditionParts[0];
    if (command1 == 'up') {
        const reference = conditionParts[2];
        const value = getSelectedOptionValue(reference);
        const grade = parseInt(value.split('_')[0]);
        const gradePos = relLumTable.findIndex((obj) => obj.grade === grade) + parseInt(conditionParts[1]);
        const gradeNew = relLumTable[gradePos].grade;
        return options.filter((x) => parseInt(x) === gradeNew);
    }

    if (command1 == 'down') {
        const reference = conditionParts[2];
        const value = getSelectedOptionValue(reference);
        const grade = parseInt(value.split('_')[0]);
        const gradePos = relLumTable.findIndex((obj) => obj.grade === grade) - parseInt(conditionParts[1]);
        const gradeNew = relLumTable[gradePos].grade;
        return options.filter((x) => parseInt(x) === gradeNew);
    }

    function handlePlusMinusCommand(conditionParts: string[]) {
        const op = conditionParts[0];
        if (op != 'plus' && op != 'minus') {
            throw Error('Not defined');
        }
        const a = getSelectedOptionValue(conditionParts[1]);
        const grade = parseInt(a.split('_')[0]);
        const b = parseInt(conditionParts[2]);
        if (op == 'plus') return grade + b;
        return grade - b;
    }

    if (command1 == 'max') {
        const maxValue = handlePlusMinusCommand(conditionParts.slice(1));
        return options.filter((x) => parseInt(x) <= maxValue);
    }

    if (command1 == 'min') {
        const minValue = handlePlusMinusCommand(conditionParts.slice(1));
        return options.filter((x) => parseInt(x) >= minValue);
    }

    return [];
}

const allOptions = ['0', '5', '10', '20', '30', '40', '50', '60', '70', '80', '90', '100', '110', '120', '130', '140'];
let brandName = '';

let colorLists: Record<
    string,
    Record<
        string,
        {
            color: tinycolor.Instance;
            reference?: string;
            referenceName?: string;
        }[]
    >
> = {};
let colorListsValues: Record<string, string> = {};

let colorList: Record<string, { color: tinycolor.Instance; reference?: string; referenceName?: string }[]>;

const relLumTable = [
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

// This shows the HTML page in "ui.html".
figma.showUI(__html__, { width: 1024, height: 768, themeColors: true });

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = (msg: { type: string; data: string; isCacheResetChecked?: boolean }) => {
    handleMessage(msg)
        .then(() => {
            // Ignore
        })
        .catch(console.error);
};
