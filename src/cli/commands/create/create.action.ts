import { Action } from '../../../lib';

export const createAction: Action = ({ parameters, flags }) => {
    const [projectName = flags['project-name'], ...params] = parameters;

    console.log(flags);
    console.log({ projectName });
};
