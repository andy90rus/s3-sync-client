"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListLocalObjectsCommand = void 0;
const node_fs_1 = require("node:fs");
const path = __importStar(require("node:path"));
const path_1 = require("../helpers/path");
const LocalObject_1 = require("../fs/LocalObject");
class ListLocalObjectsCommand {
    directory;
    followSymlinks;
    constructor(input) {
        this.directory = input.directory;
        const noFollowSymlinks = input.noFollowSymlinks ?? false;
        this.followSymlinks = input.followSymlinks ?? !noFollowSymlinks;
    }
    async execute() {
        return this.listObjectsRecursively(this.directory);
    }
    async listObjectsRecursively(currentDir) {
        let objects = [];
        const childPaths = await node_fs_1.promises.readdir(currentDir);
        for (const childPath of childPaths) {
            const filePath = path.join(currentDir, childPath);
            let stats = await node_fs_1.promises.lstat(filePath);
            if (stats.isSymbolicLink() && this.followSymlinks) {
                stats = await node_fs_1.promises.stat(filePath);
            }
            if (stats.isDirectory()) {
                objects = objects.concat(await this.listObjectsRecursively(filePath));
            }
            else if (stats.isFile()) {
                const id = (0, path_1.toPosixPath)(path.relative(this.directory, filePath));
                objects.push(new LocalObject_1.LocalObject({
                    id,
                    lastModified: stats.mtimeMs,
                    size: stats.size,
                    path: filePath,
                }));
            }
        }
        return objects;
    }
}
exports.ListLocalObjectsCommand = ListLocalObjectsCommand;
//# sourceMappingURL=ListLocalObjectsCommand.js.map