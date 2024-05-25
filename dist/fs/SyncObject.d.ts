import { Relocation, Filter } from '../commands/Command';
export type SyncObjectOptions = {
    id: string;
    size: number;
    lastModified: number;
};
export type Diff = {
    created: SyncObject[];
    updated: SyncObject[];
    deleted: SyncObject[];
};
export type DiffOptions = {
    sizeOnly?: boolean;
    deleteExcluded?: boolean;
};
export declare abstract class SyncObject {
    id: string;
    size: number;
    lastModified: number;
    private isExcluded;
    constructor(options: SyncObjectOptions);
    static diff(sourceObjects: SyncObject[], targetObjects: SyncObject[], options?: DiffOptions): Diff;
    get isIncluded(): boolean;
    applyFilters(filters: Filter[]): void;
    applyLegacyRelocation(sourcePrefix: any, targetPrefix: any): void;
    applyRelocation(relocation: Relocation): void;
    applyRelocations(relocations: Relocation[]): void;
}
