import { CreateMultipartUploadCommandInput, S3Client } from '@aws-sdk/client-s3';
import { CommandInput } from './Command';
import { LocalObject } from '../fs/LocalObject';
export type CreateMultipartLocalObjectUploadCommandInput = {
    localObject: LocalObject;
    bucket: string;
    commandInput?: CommandInput<CreateMultipartUploadCommandInput>;
};
export declare class CreateMultipartLocalObjectUploadCommand {
    localObject: LocalObject;
    bucket: string;
    commandInput?: CommandInput<CreateMultipartUploadCommandInput>;
    constructor(input: CreateMultipartLocalObjectUploadCommandInput);
    execute(client: S3Client): Promise<string>;
}
