"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DownloadBucketObjectCommand = void 0;
const node_path_1 = __importDefault(require("node:path"));
const fs_1 = require("fs");
const client_s3_1 = require("@aws-sdk/client-s3");
const node_fs_1 = __importDefault(require("node:fs"));
const Command_1 = require("./Command");
const path_1 = require("../helpers/path");
class DownloadBucketObjectCommand {
    bucketObject;
    localDir;
    abortSignal;
    commandInput;
    monitor;
    constructor(input) {
        this.bucketObject = input.bucketObject;
        this.localDir = input.localDir;
        this.abortSignal = input.abortSignal;
        this.commandInput = input.commandInput;
        this.monitor = input.monitor;
    }
    async execute(client) {
        const relativePath = (0, path_1.toLocalPath)(this.bucketObject.id);
        const filePath = node_path_1.default.join(this.localDir, relativePath);
        await fs_1.promises.mkdir(node_path_1.default.dirname(filePath), { recursive: true });
        const getObjectCommandInput = (0, Command_1.mergeInput)({
            Bucket: this.bucketObject.bucket,
            Key: this.bucketObject.key,
        }, this.commandInput);
        const response = await client.send(new client_s3_1.GetObjectCommand(getObjectCommandInput), { abortSignal: this.abortSignal });
        const readStream = response.Body;
        const { LastModified } = response;
        const writeStream = readStream.pipe(node_fs_1.default.createWriteStream(filePath));
        if (this.monitor) {
            readStream.on('data', (data) => {
                this.monitor.emit('size', data.length);
            });
            writeStream.on('finish', () => {
                this.monitor.emit('object');
            });
        }
        await new Promise((resolve, reject) => {
            writeStream.on('error', reject);
            writeStream.on('finish', () => {
                node_fs_1.default.utimes(filePath, LastModified, LastModified, (err) => {
                    if (err)
                        reject(err);
                    else
                        resolve();
                });
            });
        });
    }
}
exports.DownloadBucketObjectCommand = DownloadBucketObjectCommand;
//# sourceMappingURL=DownloadBucketObjectCommand.js.map