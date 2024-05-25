"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3SyncClient = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const SyncCommand_1 = require("./commands/SyncCommand");
class S3SyncClient {
    client;
    constructor(options) {
        this.client = options?.client ?? new client_s3_1.S3Client(options);
        this.sync = this.sync.bind(this);
    }
    async sync(source, target, options) {
        return new SyncCommand_1.SyncCommand({
            source,
            target,
            ...options,
        }).execute(this.client);
    }
    async send(command) {
        return command.execute(this.client);
    }
}
exports.S3SyncClient = S3SyncClient;
exports.default = S3SyncClient;
//# sourceMappingURL=S3SyncClient.js.map