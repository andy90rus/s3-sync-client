import { SyncObject, SyncObjectOptions } from './SyncObject';
export type BucketObjectOptions = {
    bucket: string;
    key: string;
} & SyncObjectOptions;
export declare class BucketObject extends SyncObject {
    bucket: string;
    key: string;
    constructor(options: BucketObjectOptions);
}
