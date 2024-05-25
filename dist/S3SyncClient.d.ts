import { S3Client, S3ClientConfig } from '@aws-sdk/client-s3';
import { SyncCommandOutput, SyncOptions } from './commands/SyncCommand';
import { ICommand } from './commands/Command';
export type S3SyncClientConfig = {
    client: S3Client;
} & S3ClientConfig;
export declare class S3SyncClient {
    private client;
    constructor(options: S3SyncClientConfig);
    sync(source: string, target: string, options?: SyncOptions): Promise<SyncCommandOutput>;
    send(command: ICommand): Promise<any>;
}
export default S3SyncClient;
