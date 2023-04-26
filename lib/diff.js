"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
const common_1 = require("./common");
async function run(diff, repo) {
    const digest = (0, common_1.shaDigest)([diff.markdown || '', diff.public_url || '']);
    const body = buildCommentBody(repo.docDigest, diff, digest);
    console.log(body);
    return repo.createOrUpdateComment(body, digest);
}
exports.run = run;
function buildCommentBody(docDigest, diff, digest) {
    const emptySpace = '';
    const poweredByBump = '> _Powered by [Bump](https://bump.sh)_';
    return [title(diff)]
        .concat([emptySpace, diff.markdown || ''])
        .concat([poweredByBump, (0, common_1.bumpDiffComment)(docDigest, digest)])
        .join('\n');
}
function title(diff) {
    const commentTitle = '🤖 API change detected:';
    const breakingTitle = '🚨 Breaking API change detected:';
    return diff.breaking ? breakingTitle : commentTitle;
}
