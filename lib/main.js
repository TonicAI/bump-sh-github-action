"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core = (0, tslib_1.__importStar)(require("@actions/core"));
const config_1 = require("@oclif/config");
const request_error_1 = require("@octokit/request-error");
const path_1 = (0, tslib_1.__importDefault)(require("path"));
const bump = (0, tslib_1.__importStar)(require("bump-cli"));
const diff = (0, tslib_1.__importStar)(require("./diff"));
const github_1 = require("./github");
const common_1 = require("./common");
async function run() {
    try {
        const file1 = core.getInput('file1', { required: true });
        const file2 = core.getInput('file2', { required: true });
        const prNumber = parseInt(core.getInput('pr-number', { required: true }));
        core.debug(`File 1: ${file1}`);
        core.debug(`File 2: ${file2}`);
        core.debug(`PR Number: ${prNumber}`);
        const config = new config_1.Config({ root: path_1.default.resolve(__dirname, '../') });
        await config.load();
        (0, common_1.setUserAgent)();
        // debug is only output if you set the secret `ACTIONS_RUNNER_DEBUG` to true
        core.debug(`Waiting for bump diff...`);
        core.debug(new Date().toTimeString());
        const docDigest = (0, common_1.shaDigest)(['Tonic']);
        const repo = new github_1.Repo(docDigest, prNumber);
        await new bump.Diff(config)
            .run(file1, file2, undefined, undefined, undefined, undefined, 'markdown', undefined)
            .then((result) => {
            if (result && 'markdown' in result) {
                diff.run(result, repo).catch(handleErrors);
            }
            else {
                core.info('No diff found, nothing more to do.');
                repo.deleteExistingComment();
            }
        });
        core.debug(new Date().toTimeString());
    }
    catch (error) {
        handleErrors(error);
    }
}
function handleErrors(error) {
    let msg = 'Unknown error';
    if (error instanceof request_error_1.RequestError) {
        msg = [
            `[GitHub HttpError ${error.status}] ${error.message}`,
            '',
            'Please check your GitHub Action workflow file or Actions repository settings.',
            'Especially if running the action on a fork PR: https://github.blog/2020-08-03-github-actions-improvements-for-fork-and-pull-request-workflows/',
        ].join('\n');
    }
    else if (error instanceof Error) {
        msg = error.message;
        if (error.stack) {
            msg += '\n' + error.stack;
        }
    }
    core.setFailed(msg);
}
exports.default = run;
run();
