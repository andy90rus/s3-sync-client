import { GetObjectCommandInput, S3Client } from '@aws-sdk/client-s3';
import { AbortSignal } from '@aws-sdk/abort-controller';
import { Relocation, Filter, CommandInput } from './Command';
import { TransferMonitor } from '../TransferMonitor';
import { BucketObject } from '../fs/BucketObject';
import { LocalObject } from '../fs/LocalObject';
export type SyncLocalWithBucketCommandInput = {
    bucketPrefix: string;
    localDir: string;
    dryRun?: boolean;
    del?: boolean;
    deleteExcluded?: boolean;
    sizeOnly?: boolean;
    followSymlinks?: boolean;
    noFollowSymlinks?: boolean;
    relocations?: Relocation[];
    filters?: Filter[];
    abortSignal?: AbortSignal;
    commandInput?: CommandInput<GetObjectCommandInput>;
    monitor?: TransferMonitor;
    maxConcurrentTransfers?: number;
};
export type SyncLocalWithBucketCommandOutput = {
    created: BucketObject[];
    updated: BucketObject[];
    deleted: LocalObject[];
};
export declare class SyncLocalWithBucketCommand {
    bucketPrefix: string;
    localDir: string;
    dryRun: boolean;
    del: boolean;
    deleteExcluded: boolean;
    sizeOnly: boolean;
    followSymlinks: boolean;
    relocations: Relocation[];
    filters: Filter[];
    abortSignal?: AbortSignal;
    commandInput?: CommandInput<GetObjectCommandInput>;
    monitor?: TransferMonitor;
    maxConcurrentTransfers: number;
    constructor(input: SyncLocalWithBucketCommandInput);
    execute(client: S3Client): Promise<SyncLocalWithBucketCommandOutput>;
}
