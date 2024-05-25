"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toLocalPath = exports.toPosixPath = void 0;
const node_path_1 = __importDefault(require("node:path"));
function toPosixPath(filePath) {
    return filePath.split(node_path_1.default.sep).join(node_path_1.default.posix.sep);
}
exports.toPosixPath = toPosixPath;
function toLocalPath(filePath) {
    return filePath.split(node_path_1.default.posix.sep).join(node_path_1.default.sep);
}
exports.toLocalPath = toLocalPath;
//# sourceMappingURL=path.js.map