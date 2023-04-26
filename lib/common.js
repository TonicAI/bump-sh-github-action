"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shaDigest = exports.setUserAgent = exports.extractBumpDigest = exports.bumpDiffComment = void 0;
const tslib_1 = require("tslib");
const crypto_1 = (0, tslib_1.__importDefault)(require("crypto"));
function bumpDiffRegexp(docDigest) {
    return new RegExp(`<!-- Bump.sh.*digest=([^\\s]+)(?: doc=${docDigest})? -->`);
}
function bumpDiffComment(docDigest, digest) {
    return `<!-- Bump.sh digest=${digest} doc=${docDigest} -->`;
}
exports.bumpDiffComment = bumpDiffComment;
// Set User-Agent for github-action
const setUserAgent = () => {
    process.env.BUMP_USER_AGENT = 'bump-github-action';
    return;
};
exports.setUserAgent = setUserAgent;
function extractBumpDigest(docDigest, body) {
    var _a;
    return (_a = (body.match(bumpDiffRegexp(docDigest)) || [])) === null || _a === void 0 ? void 0 : _a.pop();
}
exports.extractBumpDigest = extractBumpDigest;
function shaDigest(texts) {
    const hash = crypto_1.default.createHash('sha1');
    texts.forEach((text) => text && hash.update(text, 'utf8'));
    return hash.digest('hex');
}
exports.shaDigest = shaDigest;
