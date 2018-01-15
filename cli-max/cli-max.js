"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var forbidden_action_error_1 = require("@vka/ts-utils/errors/forbidden-action-error");
var CLIMax = /** @class */ (function () {
    function CLIMax() {
        throw new forbidden_action_error_1.ForbiddenActionError('CLIMax is intended to be used as a Static class. Do not instantiate it.');
    }
    return CLIMax;
}());
exports.CLIMax = CLIMax;
