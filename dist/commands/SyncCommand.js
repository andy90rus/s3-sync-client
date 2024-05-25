"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncCommand = void 0;
const SyncBucketWithBucketCommand_1 = require("./SyncBucketWithBucketCommand");
const SyncBucketWithLocalCommand_1 = require("./SyncBucketWithLocalCommand");
const SyncLocalWithBucketCommand_1 = require("./SyncLocalWithBucketCommand");
class SyncCommand {
    source;
    target;
    options;
    constructor(input) {
        const { source, target, ...options } = input;
        this.source = source;
        this.target = target;
        this.options = options;
    }
    async execute(client) {
        const sourceIsBucket = this.source.startsWith('s3://');
        const targetIsBucket = this.target.startsWith('s3://');
        if (!sourceIsBucket && !targetIsBucket) {
            throw new Error('localDir to localDir sync is not supported, make sure to use s3:// prefix for buckets');
        }
        if (sourceIsBucket && targetIsBucket) {
            return new SyncBucketWithBucketCommand_1.SyncBucketWithBucketCommand({
                sourceBucketPrefix: this.source.substring(5),
                targetBucketPrefix: this.target.substring(5),
                ...this.options,
            }).execute(client);
        }
        if (sourceIsBucket && !targetIsBucket) {
            return new SyncLocalWithBucketCommand_1.SyncLocalWithBucketCommand({
                bucketPrefix: this.source.substring(5),
                localDir: this.target,
                ...this.options,
            }).execute(client);
        }
        return new SyncBucketWithLocalCommand_1.SyncBucketWithLocalCommand({
            localDir: this.source,
            bucketPrefix: this.target.substring(5),
            ...this.options,
        }).execute(client);
    }
}
exports.SyncCommand = SyncCommand;
//# sourceMappingURL=SyncCommand.js.map