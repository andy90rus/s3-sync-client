"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompleteMultipartLocalObjectCommand = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
class CompleteMultipartLocalObjectCommand {
    localObject;
    bucket;
    uploadId;
    parts;
    constructor(input) {
        this.localObject = input.localObject;
        this.bucket = input.bucket;
        this.uploadId = input.uploadId;
        this.parts = input.parts;
    }
    async execute(client) {
        const parts = [...this.parts]
            .sort((a, b) => a.partNumber - b.partNumber)
            .map((part) => ({
            ETag: part.eTag,
            PartNumber: part.partNumber,
        }));
        await client.send(new client_s3_1.CompleteMultipartUploadCommand({
            Bucket: this.bucket,
            Key: this.localObject.id,
            UploadId: this.uploadId,
            MultipartUpload: { Parts: parts },
        }));
    }
}
exports.CompleteMultipartLocalObjectCommand = CompleteMultipartLocalObjectCommand;
//# sourceMappingURL=CompleteMultipartLocalObjectCommand.js.map