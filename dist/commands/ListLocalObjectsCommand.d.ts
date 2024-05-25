import { LocalObject } from '../fs/LocalObject';
export type ListLocalObjectsCommandInput = {
    directory: string;
    followSymlinks?: boolean;
    noFollowSymlinks?: boolean;
};
export declare class ListLocalObjectsCommand {
    directory: string;
    followSymlinks: boolean;
    constructor(input: ListLocalObjectsCommandInput);
    execute(): Promise<LocalObject[]>;
    private listObjectsRecursively;
}
