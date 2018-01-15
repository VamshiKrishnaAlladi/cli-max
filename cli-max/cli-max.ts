import { ForbiddenActionError } from '@vka/ts-utils/errors/forbidden-action-error';

export class CLIMax {
    constructor() {
        throw new ForbiddenActionError('CLIMax is intended to be used as a Static class. Do not instantiate it.');
    }
}
