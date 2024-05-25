import { S3Client } from '@aws-sdk/client-s3';
export type Relocation = [sourcePrefix: string, targetPrefix: string] | ((currentPath: string) => string);
export type Filter = {
    exclude?: (key: any) => boolean;
    include?: (key: any) => boolean;
};
export type CommandInput<T> = Partial<T> | ((properties: Partial<T>) => Partial<T>);
export declare function mergeInput<T>(commandInput: T, properties: CommandInput<T>): T;
export interface ICommand {
    execute(client?: S3Client): any;
}
