import { GetObjectCommandInput, S3Client } from '@aws-sdk/client-s3';
import { AbortSignal } from '@aws-sdk/abort-controller';
import { CommandInput } from './Command';
import { TransferMonitor } from '../TransferMonitor';
import { BucketObject } from '../fs/BucketObject';
export type DownloadBucketObjectCommandInput = {
    bucketObject: BucketObject;
    localDir: string;
    abortSignal?: AbortSignal;
    commandInput?: CommandInput<GetObjectCommandInput>;
    monitor?: TransferMonitor;
};
export declare class DownloadBucketObjectCommand {
    bucketObject: BucketObject;
    localDir: string;
    abortSignal?: AbortSignal;
    commandInput?: CommandInput<GetObjectCommandInput>;
    monitor?: TransferMonitor;
    constructor(input: DownloadBucketObjectCommandInput);
    execute(client: S3Client): Promise<void>;
}
