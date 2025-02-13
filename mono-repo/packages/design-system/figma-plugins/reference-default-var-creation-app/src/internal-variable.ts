export type InternalVariable = {
    name: string;
    type: VariableResolvedDataType;
    value: VariableValue;
    category: 'TYPOGRAPHY' | 'SPACE' | 'RADIUS' | 'SIZE';
};
