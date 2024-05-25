"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadLocalObjectCommand = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const node_fs_1 = __importDefault(require("node:fs"));
const Command_1 = require("./Command");
class UploadLocalObjectCommand {
    localObject;
    bucket;
    abortSignal;
    commandInput;
    monitor;
    constructor(input) {
        this.localObject = input.localObject;
        this.bucket = input.bucket;
        this.abortSignal = input.abortSignal;
        this.commandInput = input.commandInput;
        this.monitor = input.monitor;
    }
    async execute(client) {
        const stream = node_fs_1.default.createReadStream(this.localObject.path);
        const putObjectCommandInput = (0, Command_1.mergeInput)({
            Bucket: this.bucket,
            Key: this.localObject.id,
            Body: stream,
            ContentLength: this.localObject.size,
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
        await Promise.all([
            new Promise((resolve, reject) => {
                stream.on('error', reject);
                stream.on('end', resolve);
            }),
            client.send(new client_s3_1.PutObjectCommand(putObjectCommandInput), {
                abortSignal: this.abortSignal,
            }),
        ]);
    }
}
exports.UploadLocalObjectCommand = UploadLocalObjectCommand;
//# sourceMappingURL=UploadLocalObjectCommand.js.map