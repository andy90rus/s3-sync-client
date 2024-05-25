import { S3Client, UploadPartCommandInput } from '@aws-sdk/client-s3';
import { AbortSignal } from '@aws-sdk/abort-controller';
import { CommandInput } from './Command';
import { LocalObject } from '../fs/LocalObject';
import { TransferMonitor } from '../TransferMonitor';
export type UploadLocalObjectPartCommandInput = {
    localObject: LocalObject;
    startOffset: number;
    endOffset: number;
    partNumber: number;
    uploadId: string;
    bucket: string;
    abortSignal?: AbortSignal;
    monitor?: TransferMonitor;
    commandInput?: CommandInput<UploadPartCommandInput>;
};
export type UploadedPart = {
    eTag: string;
    partNumber: number;
};
export declare class UploadLocalObjectPartCommand {
    localObject: LocalObject;
    startOffset: number;
    endOffset: number;
    partNumber: number;
    uploadId: string;
    bucket: string;
    abortSignal?: AbortSignal;
    monitor?: TransferMonitor;
    commandInput?: CommandInput<UploadPartCommandInput>;
    constructor(input: UploadLocalObjectPartCommandInput);
    execute(client: S3Client): Promise<UploadedPart>;
}
