/// <reference types="node" />
import { EventEmitter } from 'node:events';
export type TransferStatus = {
    size: {
        current: number;
        total: number;
    };
    count: {
        current: number;
        total: number;
    };
};
export declare class TransferMonitor extends EventEmitter {
    private transferredObjectCount;
    private totalObjectCount;
    private transferredDataSize;
    private totalDataSize;
    constructor();
    setMetadata(totalDataSize: number, totalObjectCount: number): void;
    updateDataSize(size: number): void;
    updateObjectCount(count?: number): void;
    getStatus(): TransferStatus;
}
export default TransferMonitor;
