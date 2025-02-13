const LABELS = [
    'bwin.com',
    'bwin.de',
    'bwin.es',
    'bwin.it',
    'gamebookers.com',
    'giocodigitale.it',
    'ladbrokes.de',
    'ladbrokes.com',
    'coral.co.uk',
    'sportingbet.com',
    'partycasino.com',
    'partypoker.com',
];

const LABELS_LAST_INDEX = LABELS.length - 1;

export const getLabel = (iteration) => {
    return LABELS[LABELS_LAST_INDEX === 0 ? 0 : iteration % LABELS_LAST_INDEX];
};
