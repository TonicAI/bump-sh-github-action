import { Repo } from './github';
import { DiffResponse } from 'bump-cli';
export declare function run(diff: DiffResponse, repo: Repo): Promise<void>;
