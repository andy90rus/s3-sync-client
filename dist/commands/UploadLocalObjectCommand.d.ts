import { PutObjectCommandInput, S3Client } from '@aws-sdk/client-s3';
import { AbortSignal } from '@aws-sdk/abort-controller';
import { TransferMonitor } from '../TransferMonitor';
import { LocalObject } from '../fs/LocalObject';
import { CommandInput } from './Command';
export type UploadLocalObjectCommandInput = {
    localObject: LocalObject;
    bucket: string;
    abortSignal?: AbortSignal;
    commandInput?: CommandInput<PutObjectCommandInput>;
    monitor?: TransferMonitor;
};
export declare class UploadLocalObjectCommand {
    localObject: LocalObject;
    bucket: string;
    abortSignal?: AbortSignal;
    commandInput?: CommandInput<PutObjectCommandInput>;
    monitor?: TransferMonitor;
    constructor(input: UploadLocalObjectCommandInput);
    execute(client: S3Client): Promise<void>;
}
