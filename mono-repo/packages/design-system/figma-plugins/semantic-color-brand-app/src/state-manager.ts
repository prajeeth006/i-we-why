import { states, states_disabled, states_fixedlinking, states_supporting } from './states';

let currentState = 0;
let selectedOptions: Record<string, string> = {};

export function getMyStates() {
    if (!('variant' in selectedOptions)) {
        return states;
    }
    if (selectedOptions['variant'] === 'Disabled') {
        return states_disabled;
    }
    if (selectedOptions['variant'] === 'Supporting') {
        return states_supporting;
    }
    if (selectedOptions['variant'] === 'Social/Spacing/Radius/Size/Typography') {
        return states_fixedlinking;
    }
    return states;
}

export function getCurrentState() {
    return getMyStates()[currentState];
}
export function getColorMode() {
    return selectedOptions['color_mode'];
}
export function getVariant() {
    return selectedOptions['variant'];
}
export function getTheme() {
    return selectedOptions['theme'];
}
export function getReferenceFile() {
    return selectedOptions['reference_file'];
}
export function isDarkMode() {
    return 'theme' in selectedOptions && selectedOptions['theme'] === 'Dark Mode';
}
export function hasInverseNo() {
    return 'has_inverse' in selectedOptions && selectedOptions['has_inverse'] === 'no';
}
export function hasInverseYes() {
    return 'has_inverse' in selectedOptions && selectedOptions['has_inverse'] === 'yes';
}
export function setSelectedOptionValue(key: string, value: string) {
    selectedOptions[key] = value;
}
export function getSelectedOptionValue(key: string) {
    return selectedOptions[key];
}
export function resetState() {
    selectedOptions = {};
    currentState = 0;
}
export function setState(state: number) {
    currentState = state;
}
export function nextState() {
    currentState++;
}
export function prevState() {
    currentState--;
    if (currentState < 0) {
        currentState = 0;
    }
}
export function getCurrentStateIndex() {
    return currentState;
}
export function usesDisabledStates() {
    return 'variant' in selectedOptions && getVariant() === 'Disabled';
}
export function usesSupportingStates() {
    return 'variant' in selectedOptions && getVariant() === 'Supporting';
}
export function hasSelectedOption(key: string) {
    return key in selectedOptions;
}
