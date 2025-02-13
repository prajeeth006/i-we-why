import { Transform } from 'style-dictionary/types';

const transformDeprecatedName: Transform = {
    name: 'custom/deprecated-name',
    type: 'name',
    filter: (token) => token.path.some((p) => p.includes('--<|deprecated-token|>') || p.includes('--<|deprecated-group|>')),
    transform: (token) => token.name.replace('-deprecated-token', '').replace('-deprecated-group', ''),
};

const zeroWithoutUnit: Transform = {
    name: 'custom/length-zero-no-unit',
    type: 'value',
    transitive: true, // otherwise partially referenced values are not covered
    filter: () => true, // /^0[a-zA-Z]+$/.test(token['$value']),
    transform: (token) => {
        // Note the use of prop.original.value,
        // before any transforms are performed, the build system
        // clones the original token to the 'original' attribute.
        if (typeof token.$value === 'object') {
            Object.keys(token.$value).forEach((key) => {
                if (/^0[a-zA-Z]+$/.test(token.$value[key])) {
                    // eslint-disable-next-line no-param-reassign
                    token.$value[key] = '0';
                }
            });
        } else if (/^0[a-zA-Z]+$/.test(token.$value)) {
            return '0';
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return token.$value;
    },
};

const addUnitWhereMissing: Transform = {
    name: 'custom/length-add-unit-where-missing',
    type: 'value',
    filter: (token) => token.$type === 'number',
    transform: (token) => {
        if (token.$value === 0) {
            //Convert to string
            return `${token.$value}`;
        }

        return `${token.$value}px`;
    },
};

const escapeFontFamily: Transform = {
    name: 'custom/escape-font-family',
    type: 'value',
    filter: (token) => token.$type === 'fontFamily',
    transform: (token) =>
        token.$value
            .split(',')
            .map((x: any) => (x.includes(' ') ? `"${x}"` : `${x}`))
            .join(',') as string,
};

const transforms: Transform[] = [zeroWithoutUnit, transformDeprecatedName, addUnitWhereMissing, escapeFontFamily];

export default transforms;
