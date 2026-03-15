import path from 'path';
import fs from 'fs';
import {QUESTION_BASE, PLAYGROUND_BASE, CACHE_BASE} from './constants.mjs'

function readFile(filePath) {
  return fs
    .readFileSync(filePath)
    .toString('utf-8')
}

function getPath (parts, options = {}) {
  let result = path.resolve(...parts)
  result = options.basePath ? path.relative(options.basePath, result) : result;
  result = options.transform ? result.split(path.sep).join('/') : result;
  return result;
}

function getPlaygroundCodePath (problem, options) {
  return getPath([PLAYGROUND_BASE, `${problem}.js`], options)
}

function getDescriptionPath(problem, options) {
  return getPath([QUESTION_BASE, problem, 'README.md'], options)
}

function getTemplateCodePath (problem, options) {
  return getPath([QUESTION_BASE, problem, 'template.js'], options)
}

function getTestCodePath (problem, options) {
  return getPath([QUESTION_BASE, problem, 'test.js'], options)
}

function getVitestTestPath (problem, options) {
  return getPath([CACHE_BASE, `${problem}.test.js`], options)
}

export function getProblem(key, options = {}) {
  if (!key) return null;

  let problems = fs.readdirSync(QUESTION_BASE);
  let problem = problems.find((str) => str.startsWith(key));
  if (!problem) {
    throw new Error(`题目 "${key}" 不存在。请使用 'list' 命令查看所有可用题目。`);
  }
  return getProblemByFullName(problem, options);
}

export function getProblemByFullName (problem, options = {}) {
  if (!problem) return null;

  let [id, ...others] = problem.split('-');
  const problemPath = path.join(QUESTION_BASE, problem);

  return {
    id,
    title: others.join('-'),
    fullName: problem,
    path: problemPath,
    descriptionPath: getDescriptionPath(problem, options),
    playgroundCodePath: getPlaygroundCodePath(problem, options),
    testCodePath: getTestCodePath(problem, options),
    templateCodePath: getTemplateCodePath(problem, options),
    vitestTestPath: getVitestTestPath(problem, options),
    hasPlaygroundCode: fs.existsSync(getPlaygroundCodePath(problem, options)),
    hasTemplate: fs.existsSync(getTemplateCodePath(problem, options)),
    hasTest: fs.existsSync(getTestCodePath(problem, options))
  }
}

// 生成vitest测试文件
export function generateTestCode (problemFullName) {
  const info = getProblemByFullName(problemFullName);
  
  if (!info.hasPlaygroundCode) {
    throw new Error(`请先使用 'create ${info.id}' 命令创建练习代码`);
  }

  if (!info.hasTest) {
    throw new Error(`题目 ${problemFullName} 缺少测试文件`);
  }

  // 计算从 .cache 目录到 playground / questions 的相对导入路径
  const solutionImportPath = './' + path
    .relative(CACHE_BASE, info.playgroundCodePath)
    .split(path.sep)
    .join('/');

  const testImportPath = './' + path
    .relative(CACHE_BASE, info.testCodePath)
    .split(path.sep)
    .join('/');

  // 生成 vitest 测试文件：通过 ESM import 引入用户代码和测试函数
  const vitestTestCode = `
import { describe, it, expect } from 'vitest';
import solution from '${solutionImportPath}';
import test from '${testImportPath}';

// 运行测试 - 适配现有的测试格式
test(describe, it, expect, solution);
`;

  const targetPath = path.resolve(CACHE_BASE, `${info.fullName}.test.js`);
  
  if (!fs.existsSync(CACHE_BASE)) {
    fs.mkdirSync(CACHE_BASE, { recursive: true });
  }
  
  fs.writeFileSync(targetPath, vitestTestCode);
  return targetPath;
}

export function generatePlaygroundCode (problemFullName, force) {
  const info = getProblemByFullName(problemFullName);
  
  if (!info.hasTemplate) {
    throw new Error(`题目 ${problemFullName} 缺少模板文件`);
  }
  
  if (!force && info.hasPlaygroundCode) {
    throw new Error('练习代码已存在。请使用 --force 选项覆盖现有文件。')
  }
  
  if (!fs.existsSync(PLAYGROUND_BASE)) {
    fs.mkdirSync(PLAYGROUND_BASE, { recursive: true });
  }
  
  const templateContent = readFile(info.templateCodePath);
  fs.writeFileSync(info.playgroundCodePath, templateContent);
  
  return info.playgroundCodePath;
}

export function listProblems(options = {}) {
  const problems = fs.readdirSync(QUESTION_BASE)
    .filter(name => fs.statSync(path.join(QUESTION_BASE, name)).isDirectory())
    .map(name => {
      const problemPath = path.join(QUESTION_BASE, name);
      const readmePath = path.join(problemPath, 'README.md');
      const [id, ...titleParts] = name.split('-');
      
      let description = '';
      let difficulty = 'medium';
      let category = 'general';
      
      if (fs.existsSync(readmePath)) {
        const content = fs.readFileSync(readmePath, 'utf-8');
        const firstLine = content.split('\n')[0];
        description = firstLine.replace(/^#\s*/, '').trim();
        
        // 尝试从内容中提取难度和分类信息
        const lines = content.split('\n');
        for (const line of lines) {
          if (line.includes('难度') || line.includes('Difficulty')) {
            if (line.toLowerCase().includes('easy') || line.includes('简单')) difficulty = 'easy';
            else if (line.toLowerCase().includes('hard') || line.includes('困难')) difficulty = 'hard';
          }
          if (line.includes('分类') || line.includes('Category')) {
            const match = line.match(/(?:分类|Category)[:：]\s*(\w+)/);
            if (match) category = match[1].toLowerCase();
          }
        }
      }
      
      const info = getProblemByFullName(name);
      
      return {
        id,
        name,
        title: titleParts.join('-'),
        path: problemPath,
        description,
        difficulty,
        category,
        hasPlayground: info.hasPlaygroundCode,
        status: info.hasPlaygroundCode ? '✅ 已创建' : '⭕ 未开始'
      };
    })
    .sort((a, b) => parseInt(a.id) - parseInt(b.id));

  // 应用筛选条件
  let filteredProblems = problems;
  
  if (options.category) {
    filteredProblems = filteredProblems.filter(p => 
      p.category.toLowerCase().includes(options.category.toLowerCase()) ||
      p.description.toLowerCase().includes(options.category.toLowerCase())
    );
  }
  
  if (options.difficulty) {
    filteredProblems = filteredProblems.filter(p => 
      p.difficulty.toLowerCase() === options.difficulty.toLowerCase()
    );
  }
  
  if (options.status) {
    const hasPlayground = options.status === 'created';
    filteredProblems = filteredProblems.filter(p => p.hasPlayground === hasPlayground);
  }
  
  return filteredProblems;
}

export function validateProblem(problemName) {
  const problemPath = path.join(QUESTION_BASE, problemName);
  
  if (!fs.existsSync(problemPath)) {
    return false;
  }
  
  const requiredFiles = ['README.md', 'template.js', 'test.js'];
  
  for (const file of requiredFiles) {
    const filePath = path.join(problemPath, file);
    if (!fs.existsSync(filePath)) {
      console.error(`Missing file: ${file} in ${problemName}`);
      return false;
    }
  }
  
  return true;
}

export function createNewProblem(name, options = {}) {
  const { category = 'general', difficulty = 'medium', template = 'basic' } = options;
  const problemPath = path.join(QUESTION_BASE, name);
  
  if (fs.existsSync(problemPath)) {
    throw new Error(`题目 ${name} 已存在`);
  }
  
  fs.mkdirSync(problemPath, { recursive: true });
  
  // 创建 README.md
  const readmeContent = `# ${name}

> 分类: ${category} | 难度: ${difficulty}

## 题目描述

请在这里描述题目要求...

## 示例

\`\`\`javascript
// 示例输入
const input = [];

// 示例输出  
const output = [];
\`\`\`

## 要求

- 时间复杂度：O(?)
- 空间复杂度：O(?)

## 提示

请在这里添加解题提示...
`;
  
  // 创建 template.js
  const templateContent = `/**
 * ${name}
 * @param {any} input - 输入参数
 * @returns {any} - 返回结果
 */
function solution(input) {
    // 请在这里实现您的解决方案
    
}

// 导出解决方案
export default solution;
`;
  
  // 创建 test.js
  const testContent = `/**
 * 测试用例 - 使用 Vitest
 */
export default function test(describe, it, expect, code) {
    describe('${name}', () => {
        it('应该处理基本情况', () => {
            const input = null; // 替换为实际输入
            const expected = null; // 替换为期望输出
            expect(code(input)).toEqual(expected);
        });
        
        it('应该处理边界情况', () => {
            // 添加边界情况测试
        });
        
        it('应该处理异常情况', () => {
            // 添加异常情况测试
        });
    });
}
`;
  
  fs.writeFileSync(path.join(problemPath, 'README.md'), readmeContent);
  fs.writeFileSync(path.join(problemPath, 'template.js'), templateContent);
  fs.writeFileSync(path.join(problemPath, 'test.js'), testContent);
  
  return problemPath;
}

// 获取题目统计信息
export function getStats() {
  const problems = listProblems();
  const total = problems.length;
  const created = problems.filter(p => p.hasPlayground).length;
  const byDifficulty = problems.reduce((acc, p) => {
    acc[p.difficulty] = (acc[p.difficulty] || 0) + 1;
    return acc;
  }, {});
  
  return {
    total,
    created,
    remaining: total - created,
    byDifficulty,
    progress: total > 0 ? Math.round((created / total) * 100) : 0
  };
}