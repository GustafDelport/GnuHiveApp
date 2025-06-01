import { BooleanInput } from '@angular/cdk/coercion';

export const parseBooleanInput = (input: BooleanInput): boolean => {
    switch (input) {
        case '':
            return true;
        case null:
            return false;
        case false:
            return false;
        case undefined:
            return false;
        default:
            return !!input;
    }
};
