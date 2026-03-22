/**
 * 按题目目录名（fullName）选择测试 Runner；未命中则使用 testcases.json + 标准接口
 */
import fs from 'fs';
import path from 'path';
import { QUESTION_BASE } from '../node/constants.mjs';
import { buildStandardSolutionTests } from './build-standard-tests.mjs';
import * as ap from './runners/array-prototype.mjs';
import * as pr from './runners/promise-polyfill.mjs';

function loadTestcases(fullName) {
  const p = path.join(QUESTION_BASE, fullName, 'testcases.json');
  if (!fs.existsSync(p)) return { cases: [] };
  try {
    return JSON.parse(fs.readFileSync(p, 'utf-8'));
  } catch {
    return { cases: [] };
  }
}

function fallbackJson(fullName) {
  return (describe, it, expect, solution) => {
    buildStandardSolutionTests(describe, it, expect, solution, loadTestcases(fullName));
  };
}

/** 顺序：先匹配更具体的规则 */
const RULES = [
  { match: (n) => n.includes('实现-promise-allsettled'), run: pr.runPromiseAllSettled },
  { match: (n) => n.includes('实现-promise-race'), run: pr.runPromiseRace },
  { match: (n) => n.includes('实现-promise-prototype-finally'), run: pr.runPromisePrototypeFinally },
  { match: (n) => n.includes('实现-promise-prototype-catch'), run: pr.runPromisePrototypeCatch },
  { match: (n) => /(^|-)promise-resolve$/.test(n) || n.endsWith('-promise-resolve'), run: pr.runPromiseResolve },
  { match: (n) => /(^|-)promise-reject$/.test(n) || n.endsWith('-promise-reject'), run: pr.runPromiseReject },

  { match: (n) => n.endsWith('array-prototype-flat'), run: ap.runFlat },
  { match: (n) => n.endsWith('array-prototype-map'), run: ap.runMap },
  { match: (n) => n.endsWith('array-prototype-filter'), run: ap.runFilter },
  { match: (n) => n.endsWith('array-prototype-reduce'), run: ap.runReduce },
  { match: (n) => n.endsWith('array-prototype-foreach'), run: ap.runForEach },
  { match: (n) => n.endsWith('array-prototype-fill'), run: ap.runFill },
  { match: (n) => n.endsWith('array-prototype-includes'), run: ap.runIncludes },
  { match: (n) => n.endsWith('array-prototype-push'), run: ap.runPush },
  { match: (n) => n.endsWith('array-prototype-unshift'), run: ap.runUnshift },
  { match: (n) => n.endsWith('array-prototype-copy'), run: ap.runCopy },
  { match: (n) => n.endsWith('array-prototype-getlevel'), run: ap.runGetLevel },
  { match: (n) => n.endsWith('array-prototype-sort'), run: ap.runSort },
  { match: (n) => n.endsWith('array-prototype-interator'), run: ap.runIterator },
];

/**
 * @typedef {(describe: any, it: any, expect: any, solution: any, fullName: string) => void} ProblemRunner
 */

export function getRunnerForProblem(fullName) {
  for (const r of RULES) {
    if (r.match(fullName)) return r.run;
  }
  return fallbackJson(fullName);
}
