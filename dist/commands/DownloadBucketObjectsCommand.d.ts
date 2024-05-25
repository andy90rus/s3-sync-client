import { GetObjectCommandInput, S3Client } from '@aws-sdk/client-s3';
import { AbortSignal } from '@aws-sdk/abort-controller';
import { BucketObject } from '../fs/BucketObject';
import { TransferMonitor } from '../TransferMonitor';
import { CommandInput } from './Command';
export type DownloadBucketObjectsCommandInput = {
    bucketObjects: BucketObject[];
    localDir: string;
    abortSignal?: AbortSignal;
    commandInput?: CommandInput<GetObjectCommandInput>;
    monitor?: TransferMonitor;
    maxConcurrentTransfers?: number;
};
export declare class DownloadBucketObjectsCommand {
    bucketObjects: BucketObject[];
    localDir: string;
    abortSignal?: AbortSignal;
    commandInput?: CommandInput<GetObjectCommandInput>;
    monitor?: TransferMonitor;
    maxConcurrentTransfers: number;
    constructor(input: DownloadBucketObjectsCommandInput);
    execute(client: S3Client): Promise<void>;
}
