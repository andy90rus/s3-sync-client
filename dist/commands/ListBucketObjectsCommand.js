"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListBucketObjectsCommand = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const BucketObject_1 = require("../fs/BucketObject");
class ListBucketObjectsCommand {
    bucket;
    prefix;
    constructor(input) {
        this.bucket = input.bucket;
        this.prefix = input.prefix;
    }
    async execute(client) {
        const objects = [];
        let response;
        let nextContinuationToken;
        do {
            response = await client.send(new client_s3_1.ListObjectsV2Command({
                Bucket: this.bucket,
                Prefix: this.prefix,
                ContinuationToken: nextContinuationToken,
            }));
            nextContinuationToken = response.NextContinuationToken;
            if (response.Contents !== undefined) {
                response.Contents.forEach(({ Key, LastModified, Size }) => {
                    if (!Key.endsWith('/')) {
                        objects.push(new BucketObject_1.BucketObject({
                            id: Key,
                            lastModified: LastModified.getTime(),
                            size: Size,
                            key: Key,
                            bucket: this.bucket,
                        }));
                    }
                });
            }
        } while (response.IsTruncated);
        return objects;
    }
}
exports.ListBucketObjectsCommand = ListBucketObjectsCommand;
//# sourceMappingURL=ListBucketObjectsCommand.js.map