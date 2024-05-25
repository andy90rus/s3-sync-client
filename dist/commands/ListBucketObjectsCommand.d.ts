import { S3Client } from '@aws-sdk/client-s3';
import { BucketObject } from '../fs/BucketObject';
export type ListBucketObjectsCommandInput = {
    bucket: string;
    prefix?: string;
};
export declare class ListBucketObjectsCommand {
    bucket: string;
    prefix?: string;
    constructor(input: ListBucketObjectsCommandInput);
    execute(client: S3Client): Promise<BucketObject[]>;
}
