"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadLocalObjectPartCommand = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const node_fs_1 = __importDefault(require("node:fs"));
const Command_1 = require("./Command");
class UploadLocalObjectPartCommand {
    localObject;
    startOffset;
    endOffset;
    partNumber;
    uploadId;
    bucket;
    abortSignal;
    monitor;
    commandInput;
    constructor(input) {
        this.localObject = input.localObject;
        this.startOffset = input.startOffset;
        this.endOffset = input.endOffset;
        this.partNumber = input.partNumber;
        this.uploadId = input.uploadId;
        this.bucket = input.bucket;
        this.abortSignal = input.abortSignal;
        this.monitor = input.monitor;
        this.commandInput = input.commandInput;
    }
    async execute(client) {
        const stream = node_fs_1.default.createReadStream(this.localObject.path, {
            start: this.startOffset,
            end: this.endOffset,
        });
        const uploadPartCommandInput = (0, Command_1.mergeInput)({
            Bucket: this.bucket,
            Key: this.localObject.id,
            UploadId: this.uploadId,
            PartNumber: this.partNumber,
            Body: stream,
            ContentLength: this.endOffset - this.startOffset + 1,
        }, this.commandInput);
        if (this.monitor) {
            stream.on('data', (data) => {
                this.monitor.emit('size', data.length);
            });
            stream.pause();
            stream.on('end', () => {
                this.monitor.emit('object');
            });
        }
        const [, result] = await Promise.all([
            new Promise((resolve, reject) => {
                stream.on('error', reject);
                stream.on('end', resolve);
            }),
            client.send(new client_s3_1.UploadPartCommand(uploadPartCommandInput), {
                abortSignal: this.abortSignal,
            }),
        ]);
        return {
            eTag: result.ETag,
            partNumber: this.partNumber,
        };
    }
}
exports.UploadLocalObjectPartCommand = UploadLocalObjectPartCommand;
//# sourceMappingURL=UploadLocalObjectPartCommand.js.map