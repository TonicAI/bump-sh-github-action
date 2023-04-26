import { GetResponseDataTypeFromEndpointMethod } from '@octokit/types';
import { GitHub } from '@actions/github/lib/utils';
declare type Octokit = InstanceType<typeof GitHub>;
declare const anyOctokit: import("@octokit/core").Octokit & import("@octokit/plugin-rest-endpoint-methods/dist-types/types").Api & {
    paginate: import("@octokit/plugin-paginate-rest").PaginateInterface;
};
declare type GitHubComment = GetResponseDataTypeFromEndpointMethod<typeof anyOctokit.rest.issues.createComment>;
export declare class Repo {
    docDigest: string;
    private prNumber;
    readonly octokit: Octokit;
    readonly owner: string;
    readonly name: string;
    constructor(docDigest: string, prNumber: number);
    getOctokit(): Octokit;
    createOrUpdateComment(body: string, digest: string): Promise<void>;
    findExistingComment(issue_number: number): Promise<GitHubComment | undefined>;
    deleteExistingComment(): Promise<void>;
}
export {};
