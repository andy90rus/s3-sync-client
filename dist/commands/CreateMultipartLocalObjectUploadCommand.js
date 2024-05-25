"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateMultipartLocalObjectUploadCommand = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const Command_1 = require("./Command");
class CreateMultipartLocalObjectUploadCommand {
    localObject;
    bucket;
    commandInput;
    constructor(input) {
        this.localObject = input.localObject;
        this.bucket = input.bucket;
        this.commandInput = input.commandInput;
    }
    async execute(client) {
        const uploadCommandInput = (0, Command_1.mergeInput)({
            Bucket: this.bucket,
            Key: this.localObject.id,
        }, this.commandInput);
        const result = await client.send(new client_s3_1.CreateMultipartUploadCommand(uploadCommandInput));
        return result.UploadId;
    }
}
exports.CreateMultipartLocalObjectUploadCommand = CreateMultipartLocalObjectUploadCommand;
//# sourceMappingURL=CreateMultipartLocalObjectUploadCommand.js.map