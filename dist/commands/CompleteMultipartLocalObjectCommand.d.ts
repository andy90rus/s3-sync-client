import { S3Client } from '@aws-sdk/client-s3';
import { UploadedPart } from './UploadLocalObjectPartCommand';
import { LocalObject } from '../fs/LocalObject';
export type CompleteMultipartLocalObjectCommandInput = {
    localObject: LocalObject;
    bucket: string;
    uploadId: string;
    parts: UploadedPart[];
};
export declare class CompleteMultipartLocalObjectCommand {
    localObject: LocalObject;
    bucket: string;
    uploadId: string;
    parts: UploadedPart[];
    constructor(input: CompleteMultipartLocalObjectCommandInput);
    execute(client: S3Client): Promise<void>;
}
