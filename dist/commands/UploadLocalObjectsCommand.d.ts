import { CreateMultipartUploadCommandInput, PutObjectCommandInput, S3Client } from '@aws-sdk/client-s3';
import { AbortSignal } from '@aws-sdk/abort-controller';
import { LocalObject } from '../fs/LocalObject';
import { TransferMonitor } from '../TransferMonitor';
import { CommandInput } from './Command';
export type UploadLocalObjectsCommandInput = {
    localObjects: LocalObject[];
    bucket: string;
    abortSignal?: AbortSignal;
    commandInput?: CommandInput<PutObjectCommandInput> | CommandInput<CreateMultipartUploadCommandInput>;
    monitor?: TransferMonitor;
    maxConcurrentTransfers?: number;
    partSize?: number;
};
export declare class UploadLocalObjectsCommand {
    localObjects: LocalObject[];
    bucket: string;
    abortSignal?: AbortSignal;
    commandInput?: CommandInput<PutObjectCommandInput> | CommandInput<CreateMultipartUploadCommandInput>;
    monitor?: TransferMonitor;
    maxConcurrentTransfers: number;
    partSize: number;
    constructor(input: UploadLocalObjectsCommandInput);
    execute(client: S3Client): Promise<void>;
    deferDirectUpload(client: S3Client, localObject: LocalObject): Function;
    deferMultipartUpload(client: S3Client, localObject: LocalObject): Function[];
}
