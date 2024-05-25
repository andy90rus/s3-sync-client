export type ParsedBucket = {
    bucket: string;
    prefix?: string;
};
export declare function parsePrefix(bucketPrefix: string): ParsedBucket;
