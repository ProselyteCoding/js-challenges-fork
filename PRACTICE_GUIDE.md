## js-challenges 使用与做题指南

本项目已经内置了一套 CLI 和题目结构，这里说明如何：

- **一键从 `README.md` 生成所有题目目录**
- **为某个题目创建练习代码并开始做题**
- **运行 / 监听测试用例**

---

## 一、从 README 一键生成题目目录

项目根目录下新增了脚本：

- `lib/scripts/bootstrap-from-readme.mjs`

它会：

- 读取根目录的 `README.md`
- 解析所有形如 `- [题目名](https://github.com/.../issues/123)` 的条目
- 从链接中提取 issue 编号 `123`
- 根据题目名生成一个 slug，例如：
  - `实现 Promise.all` → `promise-all`
  - 最终目录名为：`123-promise-all`
- 在 `questions` 目录下为每道题创建标准结构：
  - `questions/<id-slug>/README.md`
  - `questions/<id-slug>/template.js`
  - `questions/<id-slug>/test.js`
- 已存在的目录会**自动跳过，不会覆盖**

### 1. 运行初始化脚本

在项目根目录执行：

```bash
npm run bootstrap:questions
```

脚本会输出类似信息：

```text
✅ 已创建题目: 2-promise-prototype-finally (实现 Promise.prototype.finally)
✅ 已创建题目: 3-promise-allsettled (实现 Promise.allSettled)
...

📊 生成完成:
   新创建题目: X
   已存在跳过: Y
```

执行完毕后，你可以在 `questions` 目录下看到所有生成的题目子目录。

> 说明：题目的 `分类` 会写成当前所在的 README 二级标题（例如 `实现 Promise （hot）`），`难度` 默认填 `medium`，可自行在对应题目的 `README.md` 中调整。

---

## 二、题目目录结构说明

以题目 `1-promise-all` 为例，标准结构为：

```text
questions/
  1-promise-all/
    README.md     # 题目描述
    template.js   # 代码模板（用于生成练习代码）
    test.js       # Vitest 测试用例
```

项目内的 CLI 会基于以上结构，为你在 `playground` 目录生成一份可编辑的练习代码。

---

## 三、为某个题目创建练习代码

CLI 入口脚本：`lib/node/app.mjs`  
在 `package.json` 中已经配置：

```json
{
  "scripts": {
    "cli": "node ./lib/node/app.mjs"
  }
}
```

### 1. 创建练习代码

以题号 `1` 为例（对应目录前缀 `1-...`）：

```bash
npm run cli create 1
```

这条命令会：

- 找到 `questions` 中**以 `1-` 开头**的题目目录，例如 `1-promise-all`
- 读取该目录下的 `template.js`
- 在 `playground` 目录中生成一份练习代码文件，例如：
  - `playground/1-promise-all.js`

命令执行成功后，终端会提示：

```text
✅ 练习代码已创建!
📁 文件位置: /绝对路径/.../playground/1-promise-all.js
```

### 2. 在 playground 中实现代码

打开提示路径下的 `playground/*.js` 文件，补全其中的 `solution` 函数（或模板中暴露的函数）。  
你只需要修改 `playground` 里的代码，`questions` 目录下的 `template.js` 会保持为模板。

---

## 四、运行 / 监听测试

### 1. 运行指定题目的测试

继续以题号 `1` 为例：

```bash
npm run cli test 1
```

CLI 会完成以下工作：

- 根据题号 `1` 找到对应题目（例如 `1-promise-all`）
- 读取 `playground` 中你写好的练习代码
- 读取 `questions/1-promise-all/test.js` 中的测试定义
- 在 `.cache` 目录生成一个 Vitest 测试文件
- 调用 `vitest run` 执行测试

测试通过时，你会在终端看到类似输出：

```text
🧪 运行测试: 1-promise-all
📁 测试文件: /.../.cache/1-promise-all.test.js

Test Files  1 passed (1)
      Tests  所有用例通过
```

### 2. 监听模式（边写边测）

如果希望在修改代码后自动重新运行测试，可以加上 `--watch`：

```bash
npm run cli test 1 --watch
```

---

## 五、查看题目信息 / 列表 / 校验结构

### 1. 列出所有题目

```bash
npm run cli list
```

支持简单筛选：

- 按分类：`npm run cli list --category "Promise"`
- 按难度：`npm run cli list --difficulty easy`
- 按状态：`npm run cli list --status created`（已生成 playground 的题目）

### 2. 查看指定题目的详细信息

```bash
npm run cli info 1
```

会显示：

- 题目名称 / 路径
- 是否存在模板 / 测试 / 练习代码
- 题目 `README.md` 的内容（题面描述）
- 快速操作建议命令

### 3. 校验题目结构是否完整

```bash
# 校验所有题目
npm run cli validate

# 只校验题号 1 对应的题目
npm run cli validate 1
```

用于检查每个题目是否都存在 `README.md / template.js / test.js` 三个文件。

---

## 六、建议的刷题流程（推荐）

以题号 `1` 为例：

1. **初始化题目目录（首次使用时）**

   ```bash
   npm run bootstrap:questions
   ```

2. **查看有哪些题目可做**

   ```bash
   npm run cli list
   # 或者
   npm run cli info 1
   ```

3. **为题目创建练习代码**

   ```bash
   npm run cli create 1
   ```

4. **在 `playground/*.js` 中实现题解**

5. **运行测试 / 监听测试**

   ```bash
   npm run cli test 1
   # 或
   npm run cli test 1 --watch
   ```

6. **根据测试结果不断修正，直到全部通过**

这样，你就可以完全基于 `README.md` 中的题目列表 + `questions` 目录 + `lib` 中的 CLI 工具，高效地刷题与验证自己的解法。

