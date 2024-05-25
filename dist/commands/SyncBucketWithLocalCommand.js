"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncBucketWithLocalCommand = void 0;
const UploadLocalObjectsCommand_1 = require("./UploadLocalObjectsCommand");
const DeleteBucketObjectsCommand_1 = require("./DeleteBucketObjectsCommand");
const SyncObject_1 = require("../fs/SyncObject");
const bucket_1 = require("../helpers/bucket");
const constants_1 = require("./constants");
const ListLocalObjectsCommand_1 = require("./ListLocalObjectsCommand");
const ListBucketObjectsCommand_1 = require("./ListBucketObjectsCommand");
class SyncBucketWithLocalCommand {
    localDir;
    bucketPrefix;
    dryRun;
    del;
    deleteExcluded;
    sizeOnly;
    followSymlinks;
    relocations;
    filters;
    abortSignal;
    commandInput;
    monitor;
    maxConcurrentTransfers;
    partSize;
    constructor(input) {
        this.localDir = input.localDir;
        this.bucketPrefix = input.bucketPrefix;
        this.dryRun = input.dryRun ?? false;
        this.del = input.del ?? false;
        this.deleteExcluded = input.deleteExcluded ?? false;
        this.sizeOnly = input.sizeOnly ?? false;
        const noFollowSymlinks = input.noFollowSymlinks ?? false;
        this.followSymlinks = input.followSymlinks ?? !noFollowSymlinks;
        this.relocations = input.relocations ?? [];
        this.filters = input.filters ?? [];
        this.abortSignal = input.abortSignal;
        this.commandInput = input.commandInput;
        this.monitor = input.monitor;
        this.maxConcurrentTransfers =
            input.maxConcurrentTransfers ?? constants_1.DEFAULT_MAX_CONCURRENT_TRANSFERS;
        this.partSize = input.partSize ?? constants_1.DEFAULT_PART_SIZE;
    }
    async execute(client) {
        const { bucket, prefix } = (0, bucket_1.parsePrefix)(this.bucketPrefix);
        const [sourceObjects, targetObjects] = await Promise.all([
            new ListLocalObjectsCommand_1.ListLocalObjectsCommand({
                directory: this.localDir,
                followSymlinks: this.followSymlinks,
            }).execute(),
            new ListBucketObjectsCommand_1.ListBucketObjectsCommand({ bucket, prefix }).execute(client),
        ]);
        if (prefix !== '')
            this.relocations = [
                (currentPath) => `${prefix}/${currentPath}`,
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
            commands.push(new UploadLocalObjectsCommand_1.UploadLocalObjectsCommand({
                localObjects: [...diff.created, ...diff.updated],
                bucket,
                abortSignal: this.abortSignal,
                commandInput: this.commandInput,
                monitor: this.monitor,
                maxConcurrentTransfers: this.maxConcurrentTransfers,
                partSize: this.partSize,
            }).execute(client));
        }
        if (this.del) {
            if (!this.dryRun) {
                commands.push(new DeleteBucketObjectsCommand_1.DeleteBucketObjectsCommand({
                    bucket,
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
exports.SyncBucketWithLocalCommand = SyncBucketWithLocalCommand;
//# sourceMappingURL=SyncBucketWithLocalCommand.js.map