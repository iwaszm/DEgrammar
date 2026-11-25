# Deutsche Grammatik

一个无需后端的德语语法速查站。页面通过 URL hash 定位章节，例如 `#pronomen`、`#artikel`、`#plural-regeln`、`#substantiv-familien`、`#v2n`、`#a2n` 和 `#verb-combo`。旧链接 `#basis` 和 `#nomen-bildung` 会跳转到对应的新页面。

## 本地开发

使用静态 Web 服务器提供仓库根目录，再打开 `index.html`。页面使用浏览器 ES Modules，因此不要直接用 `file://` 打开。

```sh
npm install
npm run build:css
npm test
```

## 文件分工

| 路径 | 职责 |
| --- | --- |
| `index.html` | 页面结构、静态语法说明、空表格容器 |
| `assets/js/app.js` | 初始化入口 |
| `assets/js/navigation.js` | URL hash、页面切换、菜单状态 |
| `assets/js/features/` | 各语法栏目筛选与渲染 |
| `assets/js/utils/` | HTML 安全输出与表格空状态 |
| `assets/data/` | 语法条目与词族释义 |
| `assets/css/` | 自定义样式及生成的 Tailwind CSS |

修改动态表格内容时，请编辑 `assets/data/` 中对应的数据文件。表格行由功能模块生成，不在 `index.html` 中重复维护。若新增 Tailwind 类名，运行 `npm run build:css` 并提交生成的 CSS。
