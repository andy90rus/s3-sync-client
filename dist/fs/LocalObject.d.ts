import { SyncObject, SyncObjectOptions } from './SyncObject';
export type LocalObjectOptions = {
    path: string;
} & SyncObjectOptions;
export declare class LocalObject extends SyncObject {
    path: string;
    constructor(options: LocalObjectOptions);
}
