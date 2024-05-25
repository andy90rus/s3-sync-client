import { CopyObjectCommandInput, S3Client } from '@aws-sdk/client-s3';
import { AbortSignal } from '@aws-sdk/abort-controller';
import { Relocation, Filter, CommandInput } from './Command';
import { TransferMonitor } from '../TransferMonitor';
import { BucketObject } from '../fs/BucketObject';
export type SyncBucketWithBucketCommandInput = {
    sourceBucketPrefix: string;
    targetBucketPrefix: string;
    dryRun?: boolean;
    del?: boolean;
    deleteExcluded?: boolean;
    sizeOnly?: boolean;
    relocations?: Relocation[];
    filters?: Filter[];
    abortSignal?: AbortSignal;
    commandInput?: CommandInput<CopyObjectCommandInput>;
    monitor?: TransferMonitor;
    maxConcurrentTransfers?: number;
};
export type SyncBucketWithBucketCommandOutput = {
    created: BucketObject[];
    updated: BucketObject[];
    deleted: BucketObject[];
};
export declare class SyncBucketWithBucketCommand {
    sourceBucketPrefix: string;
    targetBucketPrefix: string;
    dryRun: boolean;
    del: boolean;
    deleteExcluded: boolean;
    sizeOnly: boolean;
    relocations: Relocation[];
    filters: Filter[];
    abortSignal?: AbortSignal;
    commandInput?: CommandInput<CopyObjectCommandInput>;
    monitor?: TransferMonitor;
    maxConcurrentTransfers: number;
    constructor(input: SyncBucketWithBucketCommandInput);
    execute(client: S3Client): Promise<SyncBucketWithBucketCommandOutput>;
}
