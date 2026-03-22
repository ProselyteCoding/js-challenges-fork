/**
 * 1) 为每道题从 template.js 生成 playground 占位（默认不覆盖已有练习）
 * 2) 为标准题型写入统一 test.js + testcases.json（保留 1-promise-all 自定义测试）
 *
 * 用法:
 *   node lib/scripts/bootstrap-practice.mjs
 *   node lib/scripts/bootstrap-practice.mjs --force-playground   # 用模板覆盖 playground（会清空你的作答）
 *   node lib/scripts/bootstrap-practice.mjs --force-tests        # 覆盖 test.js（统一测试入口）
 *   node lib/scripts/bootstrap-practice.mjs --force-testcases    # 用种子覆盖 testcases.json
 *   node lib/scripts/bootstrap-practice.mjs --dry-run
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { QUESTION_BASE, PLAYGROUND_BASE } from '../node/constants.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SEED_PATH = path.join(__dirname, '../test/seed-testcases.json');

const SKIP_TEST_REWRITE = new Set(['1-promise-all']);

const STANDARD_TEST_JS = `/**
 * 测试入口（由 bootstrap-practice 生成，可改同目录 testcases.json）
 */
import { buildStandardSolutionTests } from '../../lib/test/build-standard-tests.mjs';
import testcases from './testcases.json';

export default function test(describe, it, expect, solution) {
  buildStandardSolutionTests(describe, it, expect, solution, testcases);
}
`;

function isStandardSolutionTemplate(templateSrc) {
  return (
    /function\s+solution\s*\(/.test(templateSrc) &&
    /export\s+default\s+solution\s*;?\s*$/m.test(templateSrc.trim())
  );
}

function loadSeed() {
  if (!fs.existsSync(SEED_PATH)) return {};
  const raw = JSON.parse(fs.readFileSync(SEED_PATH, 'utf-8'));
  delete raw._readme;
  delete raw._comment;
  return raw;
}

function main() {
  const args = process.argv.slice(2);
  const forcePlayground = args.includes('--force-playground');
  const forceTests = args.includes('--force-tests');
  const forceTestcases = args.includes('--force-testcases');
  const dryRun = args.includes('--dry-run');

  const seed = loadSeed();
  const dirs = fs
    .readdirSync(QUESTION_BASE)
    .filter((d) => fs.statSync(path.join(QUESTION_BASE, d)).isDirectory())
    .sort();

  let pgCreated = 0;
  let pgSkipped = 0;
  let testsWritten = 0;
  let testsSkipped = 0;

  for (const dir of dirs) {
    const base = path.join(QUESTION_BASE, dir);
    const templatePath = path.join(base, 'template.js');
    const testPath = path.join(base, 'test.js');
    const tcPath = path.join(base, 'testcases.json');
    const pgPath = path.join(PLAYGROUND_BASE, `${dir}.js`);

    if (!fs.existsSync(templatePath)) {
      console.warn(`⚠️  跳过（无 template）: ${dir}`);
      continue;
    }

    const templateSrc = fs.readFileSync(templatePath, 'utf-8');

    // --- playground ---
    if (!fs.existsSync(PLAYGROUND_BASE)) {
      if (!dryRun) fs.mkdirSync(PLAYGROUND_BASE, { recursive: true });
    }
    if (!fs.existsSync(pgPath) || forcePlayground) {
      if (dryRun) {
        console.log(`[dry-run] playground: ${dir}.js`);
      } else {
        fs.writeFileSync(pgPath, templateSrc, 'utf-8');
        pgCreated++;
      }
    } else {
      pgSkipped++;
    }

    // --- test.js + testcases.json ---
    if (SKIP_TEST_REWRITE.has(dir)) {
      testsSkipped++;
      continue;
    }

    if (!isStandardSolutionTemplate(templateSrc)) {
      console.warn(`⚠️  非标准 solution 模板，保留原 test.js: ${dir}`);
      testsSkipped++;
      continue;
    }

    const id = dir.split('-')[0];
    const seedCases = seed[id]?.cases;
    const testcasesPayload = {
      cases: Array.isArray(seedCases) ? seedCases : [],
    };

    if (dryRun) {
      console.log(`[dry-run] test + testcases: ${dir}`);
      testsWritten++;
      continue;
    }

    const writeTestJs = !fs.existsSync(testPath) || forceTests;
    const writeTc =
      !fs.existsSync(tcPath) || forceTestcases;

    if (writeTestJs) {
      fs.writeFileSync(testPath, STANDARD_TEST_JS, 'utf-8');
    }
    if (writeTc) {
      fs.writeFileSync(tcPath, `${JSON.stringify(testcasesPayload, null, 2)}\n`, 'utf-8');
    }
    if (writeTestJs || writeTc) {
      testsWritten++;
    }
  }

  console.log('\n✅ bootstrap-practice 完成');
  console.log(`   playground: 新建/覆盖 ${pgCreated}，已存在跳过 ${pgSkipped}${forcePlayground ? '（--force-playground）' : ''}`);
  console.log(`   测试文件: 写入 ${testsWritten}，跳过 ${testsSkipped}（含非标准模板与 ${SKIP_TEST_REWRITE.size} 道保留题）`);
  console.log(`   种子用例见: lib/test/seed-testcases.json（可按题号补充）`);
  if (dryRun) console.log('   （dry-run 未写文件）\n');
}

main();
