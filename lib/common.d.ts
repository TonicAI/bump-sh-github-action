declare function bumpDiffComment(docDigest: string, digest: string): string;
declare const setUserAgent: () => void;
declare function extractBumpDigest(docDigest: string, body: string): string | undefined;
declare function shaDigest(texts: string[]): string;
export { bumpDiffComment, extractBumpDigest, setUserAgent, shaDigest };
