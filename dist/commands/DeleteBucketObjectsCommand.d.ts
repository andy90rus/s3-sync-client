import { S3Client } from '@aws-sdk/client-s3';
export type DeleteBucketObjectsCommandInput = {
    bucket: string;
    keys: string[];
};
export declare class DeleteBucketObjectsCommand {
    bucket: string;
    keys: string[];
    constructor(input: DeleteBucketObjectsCommandInput);
    execute(client: S3Client): Promise<number>;
}
