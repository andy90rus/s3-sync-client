"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeInput = void 0;
function isFunction(properties) {
    return typeof properties === 'function';
}
function mergeInput(commandInput, properties) {
    return {
        ...commandInput,
        ...(isFunction(properties)
            ? properties(commandInput)
            : properties),
    };
}
exports.mergeInput = mergeInput;
//# sourceMappingURL=Command.js.map