import { CopyObjectCommandInput, S3Client } from '@aws-sdk/client-s3';
import { AbortSignal } from '@aws-sdk/abort-controller';
import { BucketObject } from '../fs/BucketObject';
import { TransferMonitor } from '../TransferMonitor';
import { CommandInput } from './Command';
export type CopyBucketObjectsCommandInput = {
    bucketObjects: BucketObject[];
    targetBucket: string;
    abortSignal?: AbortSignal;
    commandInput?: CommandInput<CopyObjectCommandInput>;
    monitor?: TransferMonitor;
    maxConcurrentTransfers?: number;
};
export declare class CopyBucketObjectsCommand {
    bucketObjects: BucketObject[];
    targetBucket: string;
    abortSignal?: AbortSignal;
    commandInput?: CommandInput<CopyObjectCommandInput>;
    monitor?: TransferMonitor;
    maxConcurrentTransfers: number;
    constructor(input: CopyBucketObjectsCommandInput);
    execute(client: S3Client): Promise<void>;
}
