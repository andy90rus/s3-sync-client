import { S3Client } from '@aws-sdk/client-s3';
import { SyncBucketWithBucketCommandInput, SyncBucketWithBucketCommandOutput } from './SyncBucketWithBucketCommand';
import { SyncBucketWithLocalCommandInput, SyncBucketWithLocalCommandOutput } from './SyncBucketWithLocalCommand';
import { SyncLocalWithBucketCommandInput, SyncLocalWithBucketCommandOutput } from './SyncLocalWithBucketCommand';
export type SyncBucketWithBucketOptions = Omit<SyncBucketWithBucketCommandInput, 'sourceBucketPrefix' | 'targetBucketPrefix'>;
export type SyncBucketWithLocalOptions = Omit<SyncBucketWithLocalCommandInput, 'localDir' | 'bucketPrefix'>;
export type SyncLocalWithBucketOptions = Omit<SyncLocalWithBucketCommandInput, 'bucketPrefix' | 'localDir'>;
export type SyncOptions = SyncBucketWithBucketOptions | SyncBucketWithLocalOptions | SyncLocalWithBucketOptions;
export type SyncCommandInput = {
    source: string;
    target: string;
} & SyncOptions;
export type SyncCommandOutput = SyncBucketWithBucketCommandOutput | SyncBucketWithLocalCommandOutput | SyncLocalWithBucketCommandOutput;
export declare class SyncCommand {
    source: string;
    target: string;
    options: SyncOptions;
    constructor(input: SyncCommandInput);
    private protocolRegexp;
    execute(client: S3Client): Promise<SyncCommandOutput>;
    private getBucketPrefix;
}
