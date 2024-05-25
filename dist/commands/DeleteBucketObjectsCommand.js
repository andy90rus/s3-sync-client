"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteBucketObjectsCommand = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
class DeleteBucketObjectsCommand {
    bucket;
    keys;
    constructor(input) {
        this.bucket = input.bucket;
        this.keys = input.keys;
    }
    async execute(client) {
        let deleted = 0;
        while (deleted < this.keys.length) {
            const chunk = this.keys.slice(deleted, deleted + 1000);
            await client.send(new client_s3_1.DeleteObjectsCommand({
                Bucket: this.bucket,
                Delete: {
                    Objects: chunk.map((key) => ({ Key: key })),
                },
            }));
            deleted += chunk.length;
        }
        return deleted;
    }
}
exports.DeleteBucketObjectsCommand = DeleteBucketObjectsCommand;
//# sourceMappingURL=DeleteBucketObjectsCommand.js.map