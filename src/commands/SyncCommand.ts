import { S3Client } from '@aws-sdk/client-s3';
import {
  SyncBucketWithBucketCommand,
  SyncBucketWithBucketCommandInput,
  SyncBucketWithBucketCommandOutput,
} from './SyncBucketWithBucketCommand';
import {
  SyncBucketWithLocalCommand,
  SyncBucketWithLocalCommandInput,
  SyncBucketWithLocalCommandOutput,
} from './SyncBucketWithLocalCommand';
import {
  SyncLocalWithBucketCommand,
  SyncLocalWithBucketCommandInput,
  SyncLocalWithBucketCommandOutput,
} from './SyncLocalWithBucketCommand';

export type SyncBucketWithBucketOptions = Omit<
  SyncBucketWithBucketCommandInput,
  'sourceBucketPrefix' | 'targetBucketPrefix'
>;

export type SyncBucketWithLocalOptions = Omit<
  SyncBucketWithLocalCommandInput,
  'localDir' | 'bucketPrefix'
>;

export type SyncLocalWithBucketOptions = Omit<
  SyncLocalWithBucketCommandInput,
  'bucketPrefix' | 'localDir'
>;
export type SyncOptions =
  | SyncBucketWithBucketOptions
  | SyncBucketWithLocalOptions
  | SyncLocalWithBucketOptions;

export type SyncCommandInput = {
  source: string;
  target: string;
} & SyncOptions;

export type SyncCommandOutput =
  | SyncBucketWithBucketCommandOutput
  | SyncBucketWithLocalCommandOutput
  | SyncLocalWithBucketCommandOutput;

export class SyncCommand {
  source: string;
  target: string;
  options: SyncOptions;

  constructor(input: SyncCommandInput) {
    const { source, target, ...options } = input;
    this.source = source;
    this.target = target;
    this.options = options;
  }

  private protocolRegexp = /^(s3:\/\/|http:\/\/|https:\/\/)/;

  async execute(client: S3Client): Promise<SyncCommandOutput> {
    const sourceIsBucket = this.protocolRegexp.test(this.source);
    const targetIsBucket = this.protocolRegexp.test(this.target);
    if (!sourceIsBucket && !targetIsBucket) {
      throw new Error(
        'localDir to localDir sync is not supported, make sure to use s3:// prefix for buckets'
      );
    }
    if (sourceIsBucket && targetIsBucket) {
      return new SyncBucketWithBucketCommand({

        sourceBucketPrefix: this.getBucketPrefix(this.source),
        targetBucketPrefix: this.getBucketPrefix(this.target),
        ...this.options,
      } as SyncBucketWithBucketCommandInput).execute(client);
    }
    if (sourceIsBucket && !targetIsBucket) {
      return new SyncLocalWithBucketCommand({
        bucketPrefix: this.getBucketPrefix(this.source),
        localDir: this.target,
        ...this.options,
      } as SyncLocalWithBucketCommandInput).execute(client);
    }
    return new SyncBucketWithLocalCommand({
      localDir: this.source,
      bucketPrefix: this.getBucketPrefix(this.target),
      ...this.options,
    } as SyncBucketWithLocalCommandInput).execute(client);
  }

  private getBucketPrefix(url: string): string {
    if (url.startsWith('s3://')) {
      return url.substring(5);
    }

    const httpCaptureRegexp = /^[^\/]+\/\/[^\/]+\/(.*)/;
    const match = url.match(httpCaptureRegexp);

    if (match && match[1]) {
      return match[1];
    } else {
      throw new Error("No match found");
    }
  }
}
