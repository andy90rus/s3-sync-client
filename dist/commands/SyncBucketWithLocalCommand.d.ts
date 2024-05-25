import { CreateMultipartUploadCommandInput, PutObjectCommandInput, S3Client } from '@aws-sdk/client-s3';
import { AbortSignal } from '@aws-sdk/abort-controller';
import { Relocation, Filter, CommandInput } from './Command';
import { TransferMonitor } from '../TransferMonitor';
import { LocalObject } from '../fs/LocalObject';
import { BucketObject } from '../fs/BucketObject';
export type SyncBucketWithLocalCommandInput = {
    localDir: string;
    bucketPrefix: string;
    dryRun?: boolean;
    del?: boolean;
    deleteExcluded?: boolean;
    sizeOnly?: boolean;
    followSymlinks?: boolean;
    noFollowSymlinks?: boolean;
    relocations?: Relocation[];
    filters?: Filter[];
    abortSignal?: AbortSignal;
    commandInput?: CommandInput<PutObjectCommandInput> | CommandInput<CreateMultipartUploadCommandInput>;
    monitor?: TransferMonitor;
    maxConcurrentTransfers?: number;
    partSize?: number;
};
export type SyncBucketWithLocalCommandOutput = {
    created: LocalObject[];
    updated: LocalObject[];
    deleted: BucketObject[];
};
export declare class SyncBucketWithLocalCommand {
    localDir: string;
    bucketPrefix: string;
    dryRun: boolean;
    del: boolean;
    deleteExcluded: boolean;
    sizeOnly: boolean;
    followSymlinks: boolean;
    relocations: Relocation[];
    filters: Filter[];
    abortSignal?: AbortSignal;
    commandInput?: CommandInput<PutObjectCommandInput> | CommandInput<CreateMultipartUploadCommandInput>;
    monitor?: TransferMonitor;
    maxConcurrentTransfers: number;
    partSize: number;
    constructor(input: SyncBucketWithLocalCommandInput);
    execute(client: S3Client): Promise<SyncBucketWithLocalCommandOutput>;
}
