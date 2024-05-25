"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncBucketWithBucketCommand = void 0;
const constants_1 = require("./constants");
const SyncObject_1 = require("../fs/SyncObject");
const bucket_1 = require("../helpers/bucket");
const CopyBucketObjectsCommand_1 = require("./CopyBucketObjectsCommand");
const ListBucketObjectsCommand_1 = require("./ListBucketObjectsCommand");
const DeleteBucketObjectsCommand_1 = require("./DeleteBucketObjectsCommand");
class SyncBucketWithBucketCommand {
    sourceBucketPrefix;
    targetBucketPrefix;
    dryRun;
    del;
    deleteExcluded;
    sizeOnly;
    relocations;
    filters;
    abortSignal;
    commandInput;
    monitor;
    maxConcurrentTransfers;
    constructor(input) {
        this.sourceBucketPrefix = input.sourceBucketPrefix;
        this.targetBucketPrefix = input.targetBucketPrefix;
        this.dryRun = input.dryRun ?? false;
        this.del = input.del ?? false;
        this.deleteExcluded = input.deleteExcluded ?? false;
        this.sizeOnly = input.sizeOnly ?? false;
        this.relocations = input.relocations ?? [];
        this.filters = input.filters ?? [];
        this.abortSignal = input.abortSignal;
        this.commandInput = input.commandInput;
        this.monitor = input.monitor;
        this.maxConcurrentTransfers =
            input.maxConcurrentTransfers ?? constants_1.DEFAULT_MAX_CONCURRENT_TRANSFERS;
    }
    async execute(client) {
        const { bucket: sourceBucket, prefix: sourcePrefix } = (0, bucket_1.parsePrefix)(this.sourceBucketPrefix);
        const { bucket: targetBucket, prefix: targetPrefix } = (0, bucket_1.parsePrefix)(this.targetBucketPrefix);
        const [sourceObjects, targetObjects] = await Promise.all([
            new ListBucketObjectsCommand_1.ListBucketObjectsCommand({
                bucket: sourceBucket,
                prefix: sourcePrefix,
            }).execute(client),
            new ListBucketObjectsCommand_1.ListBucketObjectsCommand({
                bucket: targetBucket,
                prefix: targetPrefix,
            }).execute(client),
        ]);
        if (targetPrefix !== '')
            this.relocations = [
                (currentPath) => `${targetPrefix}/${currentPath}`,
                ...this.relocations,
            ];
        if (sourcePrefix !== '')
            this.relocations = [
                (currentPath) => currentPath.startsWith(`${sourcePrefix}/`)
                    ? currentPath.replace(`${sourcePrefix}/`, '')
                    : currentPath,
                ...this.relocations,
            ];
        sourceObjects.forEach((sourceObject) => {
            sourceObject.applyFilters(this.filters);
            sourceObject.applyRelocations(this.relocations);
        });
        const diff = SyncObject_1.SyncObject.diff(sourceObjects, targetObjects, {
            sizeOnly: this.sizeOnly,
            deleteExcluded: this.deleteExcluded,
        });
        const commands = [];
        if (!this.dryRun) {
            commands.push(new CopyBucketObjectsCommand_1.CopyBucketObjectsCommand({
                bucketObjects: [...diff.created, ...diff.updated],
                targetBucket,
                abortSignal: this.abortSignal,
                commandInput: this.commandInput,
                monitor: this.monitor,
                maxConcurrentTransfers: this.maxConcurrentTransfers,
            }).execute(client));
        }
        if (this.del) {
            if (!this.dryRun) {
                commands.push(new DeleteBucketObjectsCommand_1.DeleteBucketObjectsCommand({
                    bucket: targetBucket,
                    keys: diff.deleted.map((object) => object.key),
                }).execute(client));
            }
        }
        await Promise.all(commands);
        return {
            created: diff.created,
            updated: diff.updated,
            deleted: this.del ? diff.deleted : [],
        };
    }
}
exports.SyncBucketWithBucketCommand = SyncBucketWithBucketCommand;
//# sourceMappingURL=SyncBucketWithBucketCommand.js.map