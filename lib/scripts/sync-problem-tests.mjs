/**
 * 为每道题写入「定制化」测试入口：import { createProblemTest } ... export default createProblemTest('<目录名>')
 * 跳过 1-promise-all（保留手写测试）
 *
 * 用法: node lib/scripts/sync-problem-tests.mjs
 */
import fs from 'fs';
import path from 'path';
import { QUESTION_BASE } from '../node/constants.mjs';

const SKIP = new Set(['1-promise-all']);

const HEADER = `/**
 * 自动同步自 sync-problem-tests：具体断言由 lib/test/problem-registry.mjs 按题目目录名分发
 * 可改 lib/test/runners/ 或本题 testcases.json（未命中定制 Runner 时）
 */
`;

function main() {
  const dirs = fs
    .readdirSync(QUESTION_BASE)
    .filter((d) => fs.statSync(path.join(QUESTION_BASE, d)).isDirectory())
    .sort();

  let n = 0;
  for (const dir of dirs) {
    if (SKIP.has(dir)) continue;
    const testPath = path.join(QUESTION_BASE, dir, 'test.js');
    const body = `${HEADER}import { createProblemTest } from '../../lib/test/create-problem-test.mjs';
export default createProblemTest('${dir.replace(/'/g, "\\'")}');
`;
    fs.writeFileSync(testPath, body, 'utf-8');
    n++;
  }

  console.log(`✅ 已写入 ${n} 个题目的 test.js（跳过 ${SKIP.size} 个: ${[...SKIP].join(', ')})`);
}

main();
