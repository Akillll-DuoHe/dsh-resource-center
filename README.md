# dsh-resource-center

一个侧边栏入口，把 DeepSeek Harness 里 **已安装的插件包** 和 **正在运行的功能模块** 按类别列清楚。

> 中文 | [English](#english)

DSH 的「插件」页能装、能停、能配，但很难一眼看清"我现在到底跑了些什么"。资源中心把 Host 已有的插件清单整理成一页只读总览：多少插件包、多少功能模块、哪些在跑、哪些停了、哪些有问题，按内置 / 官方 / 第三方 / 实验性分组，点一下就能跳到对应的插件管理页。

## 截图

<!-- 上架前补一张：打开侧边栏「资源中心」截图，放到 docs/screenshot.png，然后取消下一行注释 -->
<!-- ![资源中心](./docs/screenshot.png) -->

（截图待补。）

## 安装

**从 GitHub 直接装（现在就能用）**：

```sh
dsh plugin --profile web add github:Akillll-DuoHe/dsh-resource-center
```

首次安装会提示 `allowBuilds`：把命令打印出来的那一行加进 profile 的 `pnpm-workspace.yaml`，再跑一次即可。

**官方桌面客户端（DeepSeek Harness Desktop）**：打开 **设置 → 插件**，在市场里搜索 `dsh-resource-center`（上架后可见），点安装，然后重启客户端。

**npm 包（待发布）**：

```sh
dsh plugin --profile web add dsh-resource-center
```

装完重启 `dsh web`，侧边栏会出现「资源中心」入口。

## 国内镜像（Gitee）

GitHub 在部分网络下不稳定，国内可直接用 Gitee 镜像：

**https://gitee.com/Akillll-DuoHe/dsh-resource-center**

```sh
dsh plugin --profile web add git+https://gitee.com/Akillll-DuoHe/dsh-resource-center.git
```

## 能做什么

- **一页总览**：插件包数、功能模块数、运行中 / 已停用 / 异常的数量。
- **按类别归档**：内置、实验性、官方可选、第三方、已停用、异常，各自成组。
- **搜索与筛选**：按名称、包名、说明搜索；按全部 / 已启用 / 已停用 / 异常筛选。
- **点一下就跳转**：点插件包卡片或功能模块行，直接打开它所属的插件管理页。
- **只读、干净**：不写配置、不动运行中的插件，数据全部来自 Host 的 `pluginManager.listPlugins()` / `listBundles()`，随插件安装与启停自动刷新。
- **中英双语**：跟随界面语言，自带 `zh` / `en` 词典。

## 兼容性

- 需要 **DSH >= 0.2.1-rc.2**（`dsh.engines.dsh`）。
- 只面向 Web GUI（`dsh.client.platform: web`），桌面客户端与 `dsh web` 都适用。

## 卸载

```sh
dsh plugin --profile web remove dsh-resource-center
```

桌面客户端里在 **设置 → 插件** 中卸载，重启后生效。

## 本地开发

```sh
# 软链安装到指定 profile，改完重启 dsh 即可
dsh plugin --profile web add link:/path/to/dsh-resource-center
```

## 许可

[MIT](./LICENSE)

---

## English

**dsh-resource-center** — one sidebar entry for the DSH web GUI that inventories what a profile actually runs: installed plugin bundles and every live feature module, grouped by kind.

DSH's Plugins page can install, stop and configure, but it is hard to see at a glance what is running. Resource Center turns the Host's existing plugin inventory into one read-only overview: how many bundles, how many feature modules, which are running, paused or broken — grouped into builtin / official / third-party / experimental and linked straight to the shipped Plugins page.

### Install

From GitHub (works today):

```sh
dsh plugin --profile web add github:Akillll-DuoHe/dsh-resource-center
```

The first install asks to allow the build script: add the line pnpm prints to the profile's `pnpm-workspace.yaml` and run it again.

In DSH Desktop: **Settings → Plugins**, search `dsh-resource-center` in the market (visible once listed), install, restart.

From npm (pending publish):

```sh
dsh plugin --profile web add dsh-resource-center
```

### Gitee mirror (China)

**https://gitee.com/Akillll-DuoHe/dsh-resource-center**

```sh
dsh plugin --profile web add git+https://gitee.com/Akillll-DuoHe/dsh-resource-center.git
```

### Requirements

DSH >= 0.2.1-rc.2, web GUI (`platform: web`).

### License

MIT
