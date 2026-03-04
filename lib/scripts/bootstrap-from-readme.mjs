import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createNewProblem } from '../node/utils.mjs';
import { ROOT_BASE, QUESTION_BASE } from '../node/constants.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const README_PATH = path.resolve(ROOT_BASE, 'README.md');

function slugify(title) {
  return title
    .trim()
    .replace(/[\[\]\(\)【】]/g, '')
    .replace(/[./·、]/g, ' ')
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function parseProblemsFromReadme(content) {
  const lines = content.split('\n');
  let currentCategory = '';
  const problems = [];

  for (const line of lines) {
    const headingMatch = line.match(/^##\s+(.*)/);
    if (headingMatch) {
      currentCategory = headingMatch[1].trim();
      continue;
    }

    const itemMatch = line.match(/^- \[(.+?)\]\((https?:\/\/[^\s)]+)\)/);
    if (!itemMatch) continue;

    const [, title, url] = itemMatch;
    const idMatch = url.match(/issues\/(\d+)/);
    if (!idMatch) continue;

    const id = idMatch[1];
    const slug = slugify(title || `problem-${id}`);
    const name = `${id}-${slug}`;

    problems.push({
      id,
      title,
      url,
      name,
      category: currentCategory || 'general',
    });
  }

  return problems;
}

function main() {
  if (!fs.existsSync(README_PATH)) {
    console.error('❌ README.md 不存在，无法生成题目');
    process.exit(1);
  }

  const readmeContent = fs.readFileSync(README_PATH, 'utf-8');
  const problems = parseProblemsFromReadme(readmeContent);

  if (problems.length === 0) {
    console.error('❌ 未从 README.md 中解析到任何题目条目');
    process.exit(1);
  }

  if (!fs.existsSync(QUESTION_BASE)) {
    fs.mkdirSync(QUESTION_BASE, { recursive: true });
  }

  let created = 0;
  let skipped = 0;

  for (const problem of problems) {
    const problemPath = path.join(QUESTION_BASE, problem.name);
    if (fs.existsSync(problemPath)) {
      skipped++;
      continue;
    }

    try {
      createNewProblem(problem.name, {
        category: problem.category,
        difficulty: 'medium',
      });
      created++;
      console.log(`✅ 已创建题目: ${problem.name} (${problem.title})`);
    } catch (e) {
      console.error(`❌ 创建题目失败: ${problem.name} (${problem.title})`, e.message);
    }
  }

  console.log('\n📊 生成完成:');
  console.log(`   新创建题目: ${created}`);
  console.log(`   已存在跳过: ${skipped}`);
}

main();

