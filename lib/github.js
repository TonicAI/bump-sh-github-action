"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Repo = void 0;
const tslib_1 = require("tslib");
const core = (0, tslib_1.__importStar)(require("@actions/core"));
const github = (0, tslib_1.__importStar)(require("@actions/github"));
const common_1 = require("./common");
const anyOctokit = github.getOctokit('any');
class Repo {
    constructor(docDigest, prNumber) {
        this.docDigest = docDigest;
        this.prNumber = prNumber;
        // Fetch GitHub Action context
        // from GITHUB_REPOSITORY & GITHUB_EVENT_PATH
        const { owner, repo } = github.context.repo;
        this.owner = owner;
        this.name = repo;
        this.octokit = this.getOctokit();
    }
    getOctokit() {
        const ghToken = core.getInput('github-token') || process.env['GITHUB_TOKEN'];
        if (!ghToken) {
            throw new Error('No GITHUB_TOKEN env variable available. Are you sure to run this package from a Github Action?');
        }
        return github.getOctokit(ghToken);
    }
    async createOrUpdateComment(body, digest) {
        if (!this.prNumber) {
            core.info('Not a pull request, nothing more to do.');
            return;
        }
        const { owner, name: repo, prNumber: issue_number, octokit, docDigest } = this;
        const existingComment = await this.findExistingComment(issue_number);
        core.debug(`[createOrUpdatecomment] Launching for doc ${docDigest} ...`);
        if (existingComment) {
            // We force types because of findExistingComment call which ensures
            // body & digest exists if the comment exists but the TS compiler can't guess.
            const existingDigest = (0, common_1.extractBumpDigest)(docDigest, existingComment.body);
            core.debug(`[Repo#createOrUpdatecomment] Update comment (digest=${existingDigest}) for doc ${docDigest}`);
            if (digest !== existingDigest) {
                await octokit.rest.issues.updateComment({
                    owner,
                    repo,
                    comment_id: existingComment.id,
                    body,
                });
            }
        }
        else {
            core.debug(`[Repo#createOrUpdatecomment] Create comment for doc ${docDigest}`);
            await octokit.rest.issues.createComment({
                owner,
                repo,
                issue_number,
                body,
            });
        }
    }
    async findExistingComment(issue_number) {
        const comments = await this.octokit.rest.issues.listComments({
            owner: this.owner,
            repo: this.name,
            issue_number,
        });
        return comments.data.find((comment) => (0, common_1.extractBumpDigest)(this.docDigest, comment.body || ''));
    }
    async deleteExistingComment() {
        if (!this.prNumber) {
            core.info('Not a pull request, nothing more to do.');
            return;
        }
        const { owner, name: repo, prNumber: issue_number, octokit } = this;
        const existingComment = await this.findExistingComment(issue_number);
        if (existingComment) {
            await octokit.rest.issues.deleteComment({
                owner,
                repo,
                comment_id: existingComment.id,
            });
        }
    }
}
exports.Repo = Repo;
