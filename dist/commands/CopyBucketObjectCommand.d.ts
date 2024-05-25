import { CopyObjectCommandInput, S3Client } from '@aws-sdk/client-s3';
import { AbortSignal } from '@aws-sdk/abort-controller';
import { TransferMonitor } from '../TransferMonitor';
import { BucketObject } from '../fs/BucketObject';
import { CommandInput } from './Command';
export type CopyBucketObjectCommandInput = {
    bucketObject: BucketObject;
    targetBucket: string;
    abortSignal?: AbortSignal;
    commandInput?: CommandInput<CopyObjectCommandInput>;
    monitor?: TransferMonitor;
};
export declare class CopyBucketObjectCommand {
    bucketObject: BucketObject;
    targetBucket: string;
    abortSignal?: AbortSignal;
    commandInput?: CommandInput<CopyObjectCommandInput>;
    monitor?: TransferMonitor;
    constructor(input: CopyBucketObjectCommandInput);
    execute(client: S3Client): Promise<void>;
}
