"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncLocalWithBucketCommand = void 0;
const node_fs_1 = require("node:fs");
const constants_1 = require("./constants");
const DownloadBucketObjectsCommand_1 = require("./DownloadBucketObjectsCommand");
const SyncObject_1 = require("../fs/SyncObject");
const bucket_1 = require("../helpers/bucket");
const ListBucketObjectsCommand_1 = require("./ListBucketObjectsCommand");
const ListLocalObjectsCommand_1 = require("./ListLocalObjectsCommand");
class SyncLocalWithBucketCommand {
    bucketPrefix;
    localDir;
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
    constructor(input) {
        this.bucketPrefix = input.bucketPrefix;
        this.localDir = input.localDir;
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
    }
    async execute(client) {
        const { bucket, prefix } = (0, bucket_1.parsePrefix)(this.bucketPrefix);
        await node_fs_1.promises.mkdir(this.localDir, { recursive: true });
        const [sourceObjects, targetObjects] = await Promise.all([
            new ListBucketObjectsCommand_1.ListBucketObjectsCommand({ bucket, prefix }).execute(client),
            new ListLocalObjectsCommand_1.ListLocalObjectsCommand({
                directory: this.localDir,
                followSymlinks: this.followSymlinks,
            }).execute(),
        ]);
        if (prefix !== '')
            this.relocations = [
                (currentPath) => currentPath.startsWith(`${prefix}/`)
                    ? currentPath.replace(`${prefix}/`, '')
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
            commands.push(new DownloadBucketObjectsCommand_1.DownloadBucketObjectsCommand({
                bucketObjects: [...diff.created, ...diff.updated],
                localDir: this.localDir,
                abortSignal: this.abortSignal,
                commandInput: this.commandInput,
                monitor: this.monitor,
                maxConcurrentTransfers: this.maxConcurrentTransfers,
            }).execute(client));
        }
        if (this.del) {
            if (!this.dryRun) {
                commands.push(Promise.all(diff.deleted.map((object) => node_fs_1.promises.unlink(object.path))));
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
exports.SyncLocalWithBucketCommand = SyncLocalWithBucketCommand;
//# sourceMappingURL=SyncLocalWithBucketCommand.js.map