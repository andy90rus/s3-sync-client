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
    protocolRegexp = /^(s3:\/\/|http:\/\/|https:\/\/)/;
    async execute(client) {
        const sourceIsBucket = this.protocolRegexp.test(this.source);
        const targetIsBucket = this.protocolRegexp.test(this.target);
        if (!sourceIsBucket && !targetIsBucket) {
            throw new Error('localDir to localDir sync is not supported, make sure to use s3:// prefix for buckets');
        }
        if (sourceIsBucket && targetIsBucket) {
            return new SyncBucketWithBucketCommand_1.SyncBucketWithBucketCommand({
                sourceBucketPrefix: this.getBucketPrefix(this.source),
                targetBucketPrefix: this.getBucketPrefix(this.target),
                ...this.options,
            }).execute(client);
        }
        if (sourceIsBucket && !targetIsBucket) {
            return new SyncLocalWithBucketCommand_1.SyncLocalWithBucketCommand({
                bucketPrefix: this.getBucketPrefix(this.source),
                localDir: this.target,
                ...this.options,
            }).execute(client);
        }
        return new SyncBucketWithLocalCommand_1.SyncBucketWithLocalCommand({
            localDir: this.source,
            bucketPrefix: this.getBucketPrefix(this.target),
            ...this.options,
        }).execute(client);
    }
    getBucketPrefix(url) {
        if (url.startsWith('s3://')) {
            return url.substring(5);
        }
        const httpCaptureRegexp = /^[^\/]+\/\/[^\/]+\/(.*)/;
        const match = url.match(httpCaptureRegexp);
        if (match && match[1]) {
            return match[1];
        }
        else {
            throw new Error("No match found");
        }
    }
}
exports.SyncCommand = SyncCommand;
//# sourceMappingURL=SyncCommand.js.map