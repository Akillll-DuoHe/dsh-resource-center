/**
 * Resource Center — the browser half of `dsh-resource-center`.
 *
 * One sidebar entry that opens a global main panel inventorying what this
 * profile actually runs: installed plugin bundles and every live feature
 * module, grouped by kind. The page is read-only; management stays on the
 * shipped Plugins page, which the page links to.
 *
 * Data comes from the Remote endpoints the Plugins page already uses:
 * `pluginManager.listPlugins()` and `pluginManager.listBundles()`.
 */
window.__ModuleLoader__.load({
  id: 'dsh-resource-center',
  factory(require) {
    const React = require('react');
    const h = React.createElement;

    /** Dictionary namespace owned by this plugin. */
    const NS = 'resourceCenter';
    /** The id shared by the sidebar entry and the main panel it opens. */
    const PANEL_ID = 'resource-center';
    /** The shipped Plugins main panel this page links to. */
    const PLUGINS_PANEL_ID = 'plugins';

    const zh = {
      panel: '资源中心',
      title: '资源中心',
      subtitle: '看清我们正在使用的东西：已安装的插件包与正在运行的功能模块，按类别归档。',
      refresh: '刷新',
      refreshing: '读取中…',
      openPlugins: '插件管理',
      loading: '正在读取本机的插件清单…',
      errorTitle: '读取插件清单失败',
      errorHint: '可以稍后重试；如果一直失败，可能是 Host 尚未就绪。',
      retry: '重试',
      unavailableTitle: '当前部署没有可管理的 profile',
      unavailableHint: '这个页面依赖 Host 的插件清单服务来展示内容。',
      searchPlaceholder: '搜索名称、包名、说明…',
      searchLabel: '搜索资源',
      filterLabel: '按状态筛选',
      filterAll: '全部',
      filterEnabled: '已启用',
      filterDisabled: '已停用',
      filterProblem: '异常',
      statBundles: '插件包',
      statModules: '功能模块',
      statRunning: '运行中',
      statPaused: '已停用',
      statProblems: '异常',
      bundlesTitle: '插件包',
      bundlesHint: '按来源和状态分组，点击卡片打开插件管理',
      modulesTitle: '功能模块',
      modulesHint: '按用途分区；点击一行可打开它所属的插件包',
      groupBuiltin: '内置插件包',
      groupExperimental: '实验性插件包',
      groupOfficial: '官方可选插件包',
      groupThirdParty: '已安装的第三方插件包',
      groupPaused: '已停用',
      groupProblem: '异常',
      tagOfficial: '官方',
      tagExperimental: '实验',
      tagThirdParty: '第三方',
      tagBuiltin: '内置',
      tagPaused: '已停用',
      tagProblem: '异常',
      tagActive: '运行中',
      statusOff: '已停用',
      statusFailed: '失败',
      noResults: '没有匹配的内容，换个关键词或筛选条件试试。',
      noBundles: '还没有安装任何插件包。',
      noModules: '没有读到任何功能模块。',
      expandMore: '展开剩余',
      collapseGroup: '收起',
      countUnit: '个',
      crash: '这个页面渲染时出错了。',
      footNote: '数据来自本机 Host 的插件清单，随插件安装、启停自动刷新。',
      catInterface: '界面与交互',
      catTools: '工具与执行',
      catSkills: '技能与知识',
      catAgents: '智能体与编排',
      catModels: '模型与账号',
      catWeb: '网络与检索',
      catSession: '会话与存储',
      catSystem: '系统与服务',
      catOther: '其它',
    };

    const en = {
      panel: 'Resource Center',
      title: 'Resource Center',
      subtitle: 'See what this profile actually runs: installed plugin bundles and live feature modules, grouped by kind.',
      refresh: 'Refresh',
      refreshing: 'Reading…',
      openPlugins: 'Plugins',
      loading: 'Reading the local plugin inventory…',
      errorTitle: 'Could not read the plugin inventory',
      errorHint: 'Try again shortly. A failing read can mean the Host is not ready yet.',
      retry: 'Retry',
      unavailableTitle: 'This deployment has no managed profile',
      unavailableHint: 'This page needs the Host plugin inventory service to show anything.',
      searchPlaceholder: 'Search names, packages, descriptions…',
      searchLabel: 'Search resources',
      filterLabel: 'Filter by state',
      filterAll: 'All',
      filterEnabled: 'Enabled',
      filterDisabled: 'Disabled',
      filterProblem: 'Problems',
      statBundles: 'Bundles',
      statModules: 'Modules',
      statRunning: 'Running',
      statPaused: 'Disabled',
      statProblems: 'Problems',
      bundlesTitle: 'Plugin bundles',
      bundlesHint: 'Grouped by source and state; click a card to open Plugins',
      modulesTitle: 'Feature modules',
      modulesHint: 'Grouped by purpose; click a row to open its bundle',
      groupBuiltin: 'Built-in bundles',
      groupExperimental: 'Experimental bundles',
      groupOfficial: 'Optional official bundles',
      groupThirdParty: 'Installed third-party bundles',
      groupPaused: 'Disabled',
      groupProblem: 'Problems',
      tagOfficial: 'Official',
      tagExperimental: 'Experimental',
      tagThirdParty: 'Third-party',
      tagBuiltin: 'Built-in',
      tagPaused: 'Disabled',
      tagProblem: 'Problem',
      tagActive: 'Running',
      statusOff: 'Disabled',
      statusFailed: 'Failed',
      noResults: 'Nothing matches. Try another keyword or filter.',
      noBundles: 'No plugin bundle is installed yet.',
      noModules: 'No feature module was reported.',
      expandMore: 'Show remaining',
      collapseGroup: 'Collapse',
      countUnit: '',
      crash: 'This page failed to render.',
      footNote: 'Read from the local Host plugin inventory; refreshes when plugins are installed, enabled, or disabled.',
      catInterface: 'Interface',
      catTools: 'Tools & execution',
      catSkills: 'Skills & knowledge',
      catAgents: 'Agents & orchestration',
      catModels: 'Models & accounts',
      catWeb: 'Web & search',
      catSession: 'Sessions & storage',
      catSystem: 'System & services',
      catOther: 'Other',
    };

    /**
     * Module categories, most specific first. The matcher reads a normalized
     * module name: scope stripped, `dsh-` and `cordis-plugin-` prefixes
     * removed, so it stays stable across package renames.
     */
    const CATEGORIES = [
      { id: 'skills', label: 'catSkills', test: /^skill/ },
      { id: 'tools', label: 'catTools', test: /^(tool-|tools$|command|workflow|ptc-|bash|pwsh|sandbox|terminal|job|office|spill|file-reference|image-offload|repeat-tool-reminder)/ },
      { id: 'agents', label: 'catAgents', test: /^(agent|subagent|preset|goal|plan|compaction|system-prompt|token-meter|user-|approval|scope$)/ },
      { id: 'web', label: 'catWeb', test: /^(web|fetch|search)/ },
      { id: 'models', label: 'catModels', test: /^(llm|deepseek|model|credential|authorization|account|speech|translator|cot-)/ },
      { id: 'session', label: 'catSession', test: /^(session|storage|projection|attachment|workspace|working-|directory|fs|file-|checkpoint|query|log|schema|title)/ },
      { id: 'interface', label: 'catInterface', test: /(client|ui-|^ui$|slots|theme|layout|sidebar|locale|markdown|renderer|primitives|conversation|chat|composer|web-app|web-base)/ },
      { id: 'system', label: 'catSystem', test: /^(boot|hmr|config|settings|plugin|host|brand|otel|telemetry|subprocess|shell|permission|timeout|deque|util|atomic|package|app|mcp|experimental|base$)/ },
    ];

    const CATEGORY_ORDER = ['interface', 'tools', 'skills', 'agents', 'models', 'web', 'session', 'system', 'other'];
    const CATEGORY_LABELS = {};
    for (const category of CATEGORIES) CATEGORY_LABELS[category.id] = category.label;
    CATEGORY_LABELS.other = 'catOther';

    /** Bundle groups rendered in this order. */
    const BUNDLE_GROUPS = ['builtin', 'experimental', 'official', 'thirdParty', 'paused', 'problem'];
    const BUNDLE_GROUP_LABELS = {
      builtin: 'groupBuiltin',
      experimental: 'groupExperimental',
      official: 'groupOfficial',
      thirdParty: 'groupThirdParty',
      paused: 'groupPaused',
      problem: 'groupProblem',
    };

    /** How many module rows one group shows before its expand control. */
    const GROUP_LIMIT = 24;

    function normalizeModuleName(name) {
      const text = String(name || '');
      const slash = text.indexOf('/');
      const unscoped = slash >= 0 && text.charAt(0) === '@' ? text.slice(slash + 1) : text;
      return unscoped.replace(/^cordis-plugin-/, '').replace(/^dsh-/, '').toLowerCase();
    }

    function categoryOf(moduleName) {
      const base = normalizeModuleName(moduleName);
      for (const category of CATEGORIES) {
        if (category.test.test(base)) return category.id;
      }
      return 'other';
    }

    const CSS = [
      '.rc-root{display:flex;flex-direction:column;height:100%;min-height:0;background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);overflow:hidden}',
      '.rc-scroll{flex:1 1 auto;min-height:0;overflow-y:auto;overscroll-behavior:contain}',
      '.rc-inner{max-width:1120px;margin:0 auto;padding:calc(var(--dsh-frame-top-clearance,0px) + 26px) 28px 56px}',
      '.rc-head{display:flex;align-items:flex-start;gap:12px}',
      '.rc-mark{width:34px;height:34px;border-radius:10px;flex:none;display:flex;align-items:center;justify-content:center;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-brand-primary)}',
      '.rc-head-text{min-width:0}',
      '.rc-title{margin:0;font-size:20px;line-height:1.35;font-weight:600}',
      '.rc-sub{margin:4px 0 0;font-size:13px;line-height:1.55;color:var(--dsw-alias-label-secondary)}',
      '.rc-head-actions{margin-left:auto;flex:none;display:flex;gap:8px}',
      '.rc-btn{height:30px;padding:0 12px;border-radius:8px;border:1px solid var(--dsw-alias-border-l1);background:transparent;color:var(--dsw-alias-label-primary);font:inherit;font-size:13px;cursor:pointer;white-space:nowrap;display:inline-flex;align-items:center;justify-content:center}',
      '.rc-btn:hover{background:var(--dsw-alias-bg-layer-2)}',
      '.rc-btn:disabled{opacity:.55;cursor:default}',
      '.rc-btn--primary{background:var(--dsw-alias-brand-primary);border-color:transparent;color:#fff}',
      '.rc-btn:focus-visible,.rc-chip:focus-visible,.rc-card:focus-visible,.rc-more:focus-visible,.rc-row:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:2px}',
      '.rc-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;margin-top:22px}',
      '.rc-stat{padding:12px 14px;border:1px solid var(--dsw-alias-border-l1);border-radius:12px;background:var(--dsw-alias-bg-layer-1)}',
      '.rc-stat-num{font-size:22px;line-height:1.2;font-weight:600;font-variant-numeric:tabular-nums}',
      '.rc-stat-label{margin-top:3px;font-size:12px;color:var(--dsw-alias-label-secondary)}',
      '.rc-stat--warn .rc-stat-num{color:var(--dsw-alias-state-error-primary)}',
      '.rc-toolbar{position:sticky;top:0;z-index:3;display:flex;flex-wrap:wrap;align-items:center;gap:10px;margin-top:24px;padding:12px 0;background:var(--dsw-alias-bg-base)}',
      '.rc-search{flex:1 1 240px;min-width:180px;display:flex;align-items:center;gap:8px;height:32px;padding:0 10px;border:1px solid var(--dsw-alias-border-l1);border-radius:8px;background:var(--dsw-alias-bg-layer-1)}',
      '.rc-search input{flex:1 1 auto;min-width:0;border:0;outline:none;background:transparent;color:var(--dsw-alias-label-primary);font:inherit;font-size:13px}',
      '.rc-chips{display:flex;flex-wrap:wrap;gap:6px}',
      '.rc-chip{height:28px;padding:0 11px;border-radius:999px;border:1px solid var(--dsw-alias-border-l1);background:transparent;color:var(--dsw-alias-label-secondary);font:inherit;font-size:12px;cursor:pointer;display:inline-flex;align-items:center;gap:6px}',
      '.rc-chip[data-active="true"]{background:var(--dsw-alias-bg-layer-2);border-color:var(--dsw-alias-border-l2);color:var(--dsw-alias-label-primary)}',
      '.rc-chip-n{font-variant-numeric:tabular-nums;opacity:.72}',
      '.rc-section{margin-top:26px}',
      '.rc-section-head{display:flex;align-items:baseline;gap:8px;margin-bottom:10px}',
      '.rc-section-title{margin:0;font-size:14px;font-weight:600}',
      '.rc-section-hint{font-size:12px;color:var(--dsw-alias-label-secondary)}',
      '.rc-group{margin-top:18px}',
      '.rc-group-head{display:flex;align-items:baseline;gap:8px;margin-bottom:8px}',
      '.rc-group-title{margin:0;font-size:12px;font-weight:600;color:var(--dsw-alias-label-secondary)}',
      '.rc-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:10px}',
      '.rc-card{display:flex;flex-direction:column;gap:8px;padding:12px 14px;border:1px solid var(--dsw-alias-border-l1);border-radius:12px;background:var(--dsw-alias-bg-layer-1);color:inherit;font:inherit;text-align:left;cursor:pointer}',
      '.rc-card:hover{border-color:var(--dsw-alias-border-l2)}',
      '.rc-card-top{display:flex;align-items:center;gap:10px;min-width:0}',
      '.rc-card-icon{width:30px;height:30px;border-radius:8px;flex:none;display:flex;align-items:center;justify-content:center;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-secondary);font-size:12px;font-weight:600;overflow:hidden}',
      '.rc-card-icon img{width:100%;height:100%;object-fit:contain;display:block}',
      '.rc-card-title{min-width:0;flex:1 1 auto}',
      '.rc-card-name{font-size:13px;font-weight:600;line-height:1.4;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
      '.rc-card-pkg{font-size:11px;color:var(--dsw-alias-label-secondary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
      '.rc-card-desc{margin:0;font-size:12px;line-height:1.55;color:var(--dsw-alias-label-secondary);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}',
      '.rc-card-foot{display:flex;align-items:center;gap:6px;margin-top:auto;flex-wrap:wrap}',
      '.rc-tag{display:inline-flex;align-items:center;height:18px;padding:0 6px;border-radius:6px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-secondary);font-size:11px;line-height:1;white-space:nowrap}',
      '.rc-tag--error{background:transparent;border:1px solid var(--dsw-alias-state-error-primary);color:var(--dsw-alias-state-error-primary)}',
      '.rc-tag--ok{color:var(--dsw-alias-state-success-primary)}',
      '.rc-rows{display:flex;flex-direction:column;gap:2px}',
      '.rc-row{display:flex;align-items:center;gap:10px;min-width:0;padding:7px 10px;border-radius:9px}',
      '.rc-row--link{cursor:pointer}',
      '.rc-row--link:hover{background:var(--dsw-alias-bg-layer-1)}',
      '.rc-row-main{display:flex;flex-direction:column;gap:1px;min-width:0;flex:1 1 auto}',
      '.rc-row-title{font-size:13px;line-height:1.4;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
      '.rc-mono{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:11px;line-height:1.4;color:var(--dsw-alias-label-secondary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
      '.rc-dot{width:7px;height:7px;border-radius:50%;flex:none;background:var(--dsw-alias-state-idle-primary)}',
      '.rc-dot[data-state="active"]{background:var(--dsw-alias-state-success-primary)}',
      '.rc-dot[data-state="loading"]{background:var(--dsw-alias-state-warn-primary)}',
      '.rc-dot[data-state="error"]{background:var(--dsw-alias-state-error-primary)}',
      '.rc-more{align-self:flex-start;margin-top:6px;height:26px;padding:0 10px;border-radius:7px;border:1px dashed var(--dsw-alias-border-l1);background:transparent;color:var(--dsw-alias-label-secondary);font:inherit;font-size:12px;cursor:pointer}',
      '.rc-more:hover{border-style:solid;color:var(--dsw-alias-label-primary)}',
      '.rc-empty{margin-top:14px;padding:22px 18px;border:1px dashed var(--dsw-alias-border-l1);border-radius:12px;color:var(--dsw-alias-label-secondary);font-size:13px;line-height:1.6;text-align:center}',
      '.rc-error-detail{margin-top:10px;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:11px;line-height:1.5;color:var(--dsw-alias-label-secondary);word-break:break-word;text-align:left}',
      '.rc-foot{margin-top:34px;padding-top:14px;border-top:1px solid var(--dsw-alias-border-l1);font-size:12px;line-height:1.6;color:var(--dsw-alias-label-secondary)}',
      '.rc-fatal{margin:24px;padding:16px;border:1px solid var(--dsw-alias-state-error-primary);border-radius:12px;color:var(--dsw-alias-state-error-primary);font-size:13px;line-height:1.6}',
    ].join('\n');

    /** Localized text values arrive as a string or a `{ en, zh }` map. */
    function resolveLocalized(value, active, fallback) {
      if (value === undefined || value === null) return fallback || '';
      if (typeof value === 'string') return value || fallback || '';
      if (typeof value !== 'object') return fallback || '';
      const order = [active, active ? String(active).split('-')[0] : '', 'en', 'zh'];
      for (const key of order) {
        if (key && typeof value[key] === 'string' && value[key]) return value[key];
      }
      for (const key of Object.keys(value)) {
        if (typeof value[key] === 'string' && value[key]) return value[key];
      }
      return fallback || '';
    }

    function toArray(value) {
      return Array.isArray(value) ? value : [];
    }

    /**
     * Remote reads answer with the payload, but a generated namespace may wrap
     * a result (`value`/`data`) or report a failure object. Stay tolerant so a
     * shape change degrades to an empty list instead of a blank page.
     */
    function unwrapList(value) {
      if (Array.isArray(value)) return value;
      if (!value || typeof value !== 'object') return [];
      if (Array.isArray(value.value)) return value.value;
      if (Array.isArray(value.data)) return value.data;
      if (Array.isArray(value.items)) return value.items;
      return [];
    }

    function countOf(value) {
      return toArray(value).length;
    }

    /** The shell's own panel icon: a 2x2 grid standing for the page's sections. */
    function PanelIcon(props) {
      const size = props && typeof props.size === 'number' ? props.size : 20;
      return h(
        'svg',
        {
          width: size,
          height: size,
          viewBox: '0 0 20 20',
          fill: 'none',
          'aria-hidden': 'true',
          focusable: 'false',
          style: { display: 'block' },
        },
        h('rect', { x: 2.75, y: 2.75, width: 6, height: 6, rx: 1.7, stroke: 'currentColor', strokeWidth: 1.5 }),
        h('rect', { x: 11.25, y: 2.75, width: 6, height: 6, rx: 1.7, stroke: 'currentColor', strokeWidth: 1.5 }),
        h('rect', { x: 2.75, y: 11.25, width: 6, height: 6, rx: 1.7, stroke: 'currentColor', strokeWidth: 1.5 }),
        h('rect', { x: 11.25, y: 11.25, width: 6, height: 6, rx: 1.7, stroke: 'currentColor', strokeWidth: 1.5 }),
      );
    }

    /**
     * Keeps one broken component from blanking the whole slot entry.
     */
    class Boundary extends React.Component {
      constructor(props) {
        super(props);
        this.state = { error: null };
      }

      static getDerivedStateFromError(error) {
        return { error };
      }

      componentDidCatch(error) {
        try {
          console.error('[resource-center] render failed', error);
        } catch (_ignored) {
          /* logging is best effort */
        }
      }

      render() {
        if (this.state.error) {
          const message = this.state.error && this.state.error.message ? this.state.error.message : String(this.state.error);
          return h(
            'div',
            { className: 'rc-fatal', role: 'alert' },
            this.props.crashText,
            h('div', { className: 'rc-error-detail' }, message),
          );
        }
        return this.props.children;
      }
    }

    const inject = ['slots', 'locale', 'remote', 'remote.pluginManager', 'layout'];

    function apply(ctx) {
      /** Register this plugin's dictionaries; the disposer rides the fiber. */
      ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'resource-center: dictionaries');

      let translate = null;
      try {
        translate = ctx.locale.bind(NS);
      } catch (_ignored) {
        translate = null;
      }

      /** Translate one page string, falling back to the Chinese dictionary. */
      function t(key) {
        try {
          if (translate) {
            const value = translate(key);
            if (value !== undefined && value !== null && value !== '') return value;
          }
        } catch (_ignored) {
          /* fall through to the dictionary */
        }
        return zh[key] !== undefined ? zh[key] : key;
      }

      /** Current UI language, used to resolve Host-provided localized metadata. */
      function activeLocale() {
        try {
          const snapshot = ctx.locale.getSnapshot ? ctx.locale.getSnapshot() : ctx.locale.getLocale();
          return (snapshot && snapshot.active) || 'zh';
        } catch (_ignored) {
          return 'zh';
        }
      }

      function pluginManager() {
        try {
          return (ctx.remote && ctx.remote.pluginManager) || null;
        } catch (_ignored) {
          return null;
        }
      }

      function openBundle(packageName) {
        const navigation = (() => {
          try {
            return ctx.get ? ctx.get('pluginNavigation') : undefined;
          } catch (_ignored) {
            return undefined;
          }
        })();
        if (navigation && typeof navigation.openBundle === 'function') {
          try {
            navigation.openBundle(packageName);
            return;
          } catch (_ignored) {
            /* fall back to the panel itself */
          }
        }
        try {
          ctx.layout.selectPanel(PLUGINS_PANEL_ID);
        } catch (_ignored) {
          /* a profile without the Plugins page keeps the current panel */
        }
      }

      function openPlugins() {
        try {
          ctx.layout.selectPanel(PLUGINS_PANEL_ID);
        } catch (_ignored) {
          /* nothing to select */
        }
      }

      function bundleGroupOf(bundle) {
        if (bundle.error || bundle.availability === 'missing') return 'problem';
        if (!bundle.enabled) return 'paused';
        if (bundle.experimental) return 'experimental';
        if (bundle.official && bundle.availability === 'installation') return 'builtin';
        if (bundle.official) return 'official';
        return 'thirdParty';
      }

      function normalizeBundle(raw) {
        const meta = raw && raw.meta ? raw.meta : null;
        const name = String((raw && raw.name) || '');
        const title = resolveLocalized(meta && meta.title, activeLocale(), '') || name;
        const description =
          resolveLocalized(meta && meta.description, activeLocale(), '') ||
          (raw && raw.description ? String(raw.description) : '');
        const item = {
          name,
          title,
          description,
          version: raw && raw.version ? String(raw.version) : '',
          icon: meta && typeof meta.icon === 'string' && meta.icon ? meta.icon : '',
          official: !!(raw && raw.official),
          experimental: /^@deepseek-ai\/dsh-experimental-/.test(name),
          availability: raw && raw.availability ? raw.availability : '',
          enabled: !!(raw && raw.enabled),
          installed: !!(raw && raw.installed),
          removable: !!(raw && raw.removable),
          rows: toArray(raw && raw.rows),
          problem: raw && raw.error ? String(raw.error.diagnostic || raw.error.code || '') : '',
          readOnlyReason: raw && raw.readOnlyReason ? String(raw.readOnlyReason) : '',
          metaError: meta && meta.error ? String(meta.error) : '',
        };
        item.group = bundleGroupOf(item);
        return item;
      }

      function normalizePlugin(raw) {
        const meta = raw && raw.meta ? raw.meta : null;
        const moduleName = String((raw && raw.moduleName) || '');
        return {
          entryId: String((raw && raw.entryId) || ''),
          moduleName,
          title: resolveLocalized(meta && meta.title, activeLocale(), '') || moduleName || String((raw && raw.entryId) || ''),
          description: resolveLocalized(meta && meta.description, activeLocale(), ''),
          enabled: !!(raw && raw.enabled),
          phase: raw && raw.fiberPhase ? String(raw.fiberPhase) : '',
          patchId: raw && raw.patchId ? String(raw.patchId) : '',
          readOnlyReason: raw && raw.readOnlyReason ? String(raw.readOnlyReason) : '',
          failed: !!(raw && raw.fiberPhase === 'failed'),
          category: categoryOf(moduleName),
          metaError: meta && meta.error ? String(meta.error) : '',
        };
      }

      function dotState(row) {
        if (row.failed) return 'error';
        if (!row.enabled) return 'off';
        if (row.phase === 'loading' || row.phase === 'pending' || row.phase === 'unloading') return 'loading';
        return 'active';
      }

      function runBadge(row) {
        if (row.failed) return t('statusFailed');
        if (!row.enabled) return t('statusOff');
        return t('tagActive');
      }

      /** The whole panel. Defined inside `apply` so it closes over the services. */
      function ResourceCenterPage() {
        const [tick, setTick] = React.useState(0);
        const [phase, setPhase] = React.useState('loading');
        const [busy, setBusy] = React.useState(false);
        const [error, setError] = React.useState('');
        const [rawPlugins, setRawPlugins] = React.useState([]);
        const [rawBundles, setRawBundles] = React.useState([]);
        const [query, setQuery] = React.useState('');
        const [filter, setFilter] = React.useState('all');
        const [expanded, setExpanded] = React.useState({});
        const [brokenIcons, setBrokenIcons] = React.useState({});
        const loadSeq = React.useRef(0);

        const bump = React.useCallback(() => setTick((value) => value + 1), []);

        const load = React.useCallback(() => {
          const seq = loadSeq.current + 1;
          loadSeq.current = seq;
          setBusy(true);
          const manager = pluginManager();
          if (!manager) {
            setPhase('unavailable');
            setBusy(false);
            return;
          }
          Promise.all([manager.listPlugins(), manager.listBundles()])
            .then((result) => {
              if (loadSeq.current !== seq) return;
              setRawPlugins(unwrapList(result && result[0]));
              setRawBundles(unwrapList(result && result[1]));
              setError('');
              setPhase('ready');
              setBusy(false);
            })
            .catch((failure) => {
              if (loadSeq.current !== seq) return;
              setError(failure && failure.message ? String(failure.message) : String(failure));
              setPhase('error');
              setBusy(false);
            });
        }, []);

        React.useEffect(() => {
          load();
        }, [load]);

        React.useEffect(() => {
          const disposers = [];
          try {
            if (ctx.locale && ctx.locale.subscribe) disposers.push(ctx.locale.subscribe(bump));
          } catch (_ignored) {
            /* locale sync is optional */
          }
          try {
            if (ctx.remote && ctx.remote.$on) disposers.push(ctx.remote.$on('plugin-manager/changed', load));
          } catch (_ignored) {
            /* forwarded events are optional */
          }
          try {
            if (ctx.on) disposers.push(ctx.on('connection/reset', load));
          } catch (_ignored) {
            /* reconnect sync is optional */
          }
          return () => {
            for (const dispose of disposers) {
              try {
                dispose();
              } catch (_ignored) {
                /* best effort */
              }
            }
          };
        }, [bump, load]);

        const view = React.useMemo(() => {
          void tick;
          const bundles = rawBundles.map(normalizeBundle);
          const plugins = rawPlugins.map(normalizePlugin);

          const ownerOf = new Map();
          for (const bundle of bundles) {
            for (const row of bundle.rows) {
              if (row && row.entryId) ownerOf.set(String(row.entryId), bundle.name);
            }
          }
          for (const plugin of plugins) plugin.owner = ownerOf.get(plugin.entryId) || '';

          const enabledPlugins = plugins.filter((plugin) => plugin.enabled);
          const failedPlugins = plugins.filter((plugin) => plugin.failed);
          const failedBundles = bundles.filter((bundle) => bundle.problem);
          const stats = {
            bundles: bundles.length,
            modules: plugins.length,
            running: enabledPlugins.length,
            paused: plugins.length - enabledPlugins.length,
            problems: failedPlugins.length + failedBundles.length,
          };
          return { bundles, plugins, stats };
        }, [rawBundles, rawPlugins, tick]);

        const needle = query.trim().toLowerCase();

        function rowMatches(row) {
          if (needle) {
            const haystack = (row.title + ' ' + row.moduleName + ' ' + row.description).toLowerCase();
            if (haystack.indexOf(needle) < 0) return false;
          }
          if (filter === 'enabled') return row.enabled;
          if (filter === 'disabled') return !row.enabled;
          if (filter === 'problem') return row.failed;
          return true;
        }

        function bundleMatches(bundle) {
          if (needle) {
            const haystack = (bundle.title + ' ' + bundle.name + ' ' + bundle.description).toLowerCase();
            if (haystack.indexOf(needle) < 0) return false;
          }
          if (filter === 'enabled') return bundle.enabled;
          if (filter === 'disabled') return !bundle.enabled;
          if (filter === 'problem') return !!bundle.problem;
          return true;
        }

        const shownBundles = view.bundles.filter(bundleMatches);
        const bundleGroups = {};
        for (const group of BUNDLE_GROUPS) bundleGroups[group] = [];
        for (const bundle of shownBundles) {
          const group = bundle.group;
          (bundleGroups[group] || bundleGroups.paused).push(bundle);
        }

        const moduleGroups = {};
        for (const category of CATEGORY_ORDER) moduleGroups[category] = [];
        let shownModuleCount = 0;
        for (const row of view.plugins) {
          if (!rowMatches(row)) continue;
          shownModuleCount += 1;
          if (!moduleGroups[row.category]) moduleGroups[row.category] = [];
          moduleGroups[row.category].push(row);
        }
        for (const category of CATEGORY_ORDER) {
          moduleGroups[category].sort((left, right) => left.title.localeCompare(right.title));
        }

        function renderSearch() {
          return h(
            'div',
            { className: 'rc-search' },
            h('span', { 'aria-hidden': 'true', style: { display: 'flex' } }, searchGlyph()),
            h('input', {
              type: 'search',
              value: query,
              placeholder: t('searchPlaceholder'),
              'aria-label': t('searchLabel'),
              onChange: (event) => setQuery(event.target.value),
            }),
          );
        }

        function renderFilters() {
          const options = [
            { id: 'all', label: 'filterAll' },
            { id: 'enabled', label: 'filterEnabled' },
            { id: 'disabled', label: 'filterDisabled' },
            { id: 'problem', label: 'filterProblem' },
          ];
          return h(
            'div',
            { className: 'rc-chips', role: 'group', 'aria-label': t('filterLabel') },
            options.map((option) =>
              h(
                'button',
                {
                  type: 'button',
                  key: option.id,
                  className: 'rc-chip',
                  'data-active': String(filter === option.id),
                  'aria-pressed': filter === option.id,
                  onClick: () => setFilter(option.id),
                },
                t(option.label),
              ),
            ),
          );
        }

        function renderBundleCard(bundle) {
          const icon = bundle.icon && !brokenIcons[bundle.icon];
          const fallback = bundle.title ? bundle.title.charAt(0).toUpperCase() : '?';
          return h(
            'button',
            {
              type: 'button',
              className: 'rc-card',
              key: bundle.name,
              onClick: () => openBundle(bundle.name),
              title: bundle.description || bundle.name,
            },
            h(
              'span',
              { className: 'rc-card-top' },
              h(
                'span',
                { className: 'rc-card-icon', 'aria-hidden': 'true' },
                icon
                  ? h('img', {
                      src: bundle.icon,
                      alt: '',
                      onError: () =>
                        setBrokenIcons((previous) => {
                          const next = Object.assign({}, previous);
                          next[bundle.icon] = true;
                          return next;
                        }),
                    })
                  : fallback,
              ),
              h(
                'span',
                { className: 'rc-card-title' },
                h('span', { className: 'rc-card-name' }, bundle.title),
                h('span', { className: 'rc-card-pkg', title: bundle.name }, bundle.name + (bundle.version ? '  v' + bundle.version : '')),
              ),
            ),
            bundle.description ? h('p', { className: 'rc-card-desc' }, bundle.description) : null,
            h(
              'span',
              { className: 'rc-card-foot' },
              bundle.experimental
                ? h('span', { className: 'rc-tag' }, t('tagExperimental'))
                : bundle.official
                  ? h('span', { className: 'rc-tag' }, t('tagOfficial'))
                  : h('span', { className: 'rc-tag' }, t('tagThirdParty')),
              bundle.enabled ? null : h('span', { className: 'rc-tag' }, t('tagPaused')),
              bundle.problem ? h('span', { className: 'rc-tag rc-tag--error' }, t('tagProblem')) : null,
              h(
                'span',
                { className: 'rc-tag' },
                h('span', { className: 'rc-dot', 'data-state': bundle.enabled ? 'active' : 'off', style: { marginRight: '4px' } }),
                countOf(bundle.rows) + ' ' + t('countUnit'),
              ),
            ),
          );
        }

        function renderBundleSection() {
          const total = view.bundles.length;
          if (total === 0) {
            return h(
              'section',
              { className: 'rc-section' },
              sectionHead(t('bundlesTitle'), total, t('bundlesHint')),
              h('div', { className: 'rc-empty' }, t('noBundles')),
            );
          }
          return h(
            'section',
            { className: 'rc-section' },
            sectionHead(t('bundlesTitle'), total, t('bundlesHint')),
            shownBundles.length === 0
              ? h('div', { className: 'rc-empty' }, t('noResults'))
              : BUNDLE_GROUPS.map((group) => {
                  const items = bundleGroups[group] || [];
                  if (items.length === 0) return null;
                  return h(
                    'div',
                    { className: 'rc-group', key: group },
                    h(
                      'div',
                      { className: 'rc-group-head' },
                      h('h3', { className: 'rc-group-title' }, t(BUNDLE_GROUP_LABELS[group])),
                      h('span', { className: 'rc-chip-n' }, String(items.length)),
                    ),
                    h('div', { className: 'rc-grid' }, items.map(renderBundleCard)),
                  );
                }),
          );
        }

        function renderModuleRow(row) {
          const clickable = !!row.owner;
          return h(
            'div',
            {
              className: 'rc-row' + (clickable ? ' rc-row--link' : ''),
              key: row.entryId || row.moduleName,
              role: clickable ? 'button' : undefined,
              tabIndex: clickable ? 0 : undefined,
              title: row.description || row.moduleName,
              onClick: clickable ? () => openBundle(row.owner) : undefined,
              onKeyDown: clickable
                ? (event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      openBundle(row.owner);
                    }
                  }
                : undefined,
            },
            h('span', { className: 'rc-dot', 'data-state': dotState(row) }),
            h(
              'span',
              { className: 'rc-row-main' },
              h('span', { className: 'rc-row-title' }, row.title),
              h('span', { className: 'rc-mono' }, row.moduleName || row.entryId),
            ),
            row.patchId ? h('span', { className: 'rc-tag' }, row.patchId) : null,
            row.enabled && !row.failed ? null : h('span', { className: 'rc-tag' + (row.failed ? ' rc-tag--error' : '') }, runBadge(row)),
          );
        }

        function renderModuleGroup(category) {
          const rows = moduleGroups[category] || [];
          if (rows.length === 0) return null;
          const isExpanded = !!expanded[category];
          const visible = isExpanded ? rows : rows.slice(0, GROUP_LIMIT);
          const hidden = rows.length - visible.length;
          return h(
            'div',
            { className: 'rc-group', key: category },
            h(
              'div',
              { className: 'rc-group-head' },
              h('h3', { className: 'rc-group-title' }, t(CATEGORY_LABELS[category] || 'catOther')),
              h('span', { className: 'rc-chip-n' }, String(rows.length)),
            ),
            h('div', { className: 'rc-rows' }, visible.map(renderModuleRow)),
            hidden > 0 || isExpanded
              ? h(
                  'button',
                  {
                    type: 'button',
                    className: 'rc-more',
                    onClick: () =>
                      setExpanded((previous) => {
                        const next = Object.assign({}, previous);
                        next[category] = !previous[category];
                        return next;
                      }),
                  },
                  isExpanded ? t('collapseGroup') : t('expandMore') + ' ' + String(hidden),
                )
              : null,
          );
        }

        function renderModuleSection() {
          const total = view.plugins.length;
          if (total === 0) {
            return h(
              'section',
              { className: 'rc-section' },
              sectionHead(t('modulesTitle'), 0, t('modulesHint')),
              h('div', { className: 'rc-empty' }, t('noModules')),
            );
          }
          return h(
            'section',
            { className: 'rc-section' },
            sectionHead(t('modulesTitle'), total, t('modulesHint')),
            shownModuleCount === 0
              ? h('div', { className: 'rc-empty' }, t('noResults'))
              : CATEGORY_ORDER.map(renderModuleGroup),
          );
        }

        function sectionHead(title, count, hint) {
          return h(
            'div',
            { className: 'rc-section-head' },
            h('h2', { className: 'rc-section-title' }, title),
            h('span', { className: 'rc-chip-n' }, String(count)),
            h('span', { className: 'rc-section-hint' }, hint),
          );
        }

        function renderStats() {
          const stats = view.stats;
          const tiles = [
            { label: 'statBundles', value: stats.bundles },
            { label: 'statModules', value: stats.modules },
            { label: 'statRunning', value: stats.running },
            { label: 'statPaused', value: stats.paused },
            { label: 'statProblems', value: stats.problems, warn: stats.problems > 0 },
          ];
          return h(
            'div',
            { className: 'rc-stats' },
            tiles.map((tile) =>
              h(
                'div',
                { className: 'rc-stat' + (tile.warn ? ' rc-stat--warn' : ''), key: tile.label },
                h('div', { className: 'rc-stat-num' }, String(tile.value)),
                h('div', { className: 'rc-stat-label' }, t(tile.label)),
              ),
            ),
          );
        }

        function renderStatus() {
          if (phase === 'loading') {
            return h('div', { className: 'rc-empty' }, t('loading'));
          }
          if (phase === 'unavailable') {
            return h(
              'div',
              { className: 'rc-empty' },
              h('div', null, t('unavailableTitle')),
              h('div', { style: { marginTop: '6px' } }, t('unavailableHint')),
            );
          }
          if (phase === 'error') {
            return h(
              'div',
              { className: 'rc-empty' },
              h('div', null, t('errorTitle')),
              h('div', { style: { marginTop: '6px' } }, t('errorHint')),
              error ? h('div', { className: 'rc-error-detail' }, error) : null,
              h(
                'div',
                { style: { marginTop: '12px' } },
                h('button', { type: 'button', className: 'rc-btn', onClick: load, disabled: busy }, t('retry')),
              ),
            );
          }
          return null;
        }

        const ready = phase === 'ready';

        return h(
          'div',
          { className: 'rc-root' },
          h('style', { key: 'resource-center-styles' }, CSS),
          h(
            'div',
            { className: 'rc-scroll' },
            h(
              'div',
              { className: 'rc-inner' },
              h(
                'header',
                { className: 'rc-head' },
                h('span', { className: 'rc-mark' }, h(PanelIcon, { size: 22 })),
                h(
                  'div',
                  { className: 'rc-head-text' },
                  h('h1', { className: 'rc-title' }, t('title')),
                  h('p', { className: 'rc-sub' }, t('subtitle')),
                ),
                h(
                  'div',
                  { className: 'rc-head-actions' },
                  h(
                    'button',
                    { type: 'button', className: 'rc-btn', onClick: load, disabled: busy || !ready },
                    busy ? t('refreshing') : t('refresh'),
                  ),
                  h('button', { type: 'button', className: 'rc-btn rc-btn--primary', onClick: openPlugins }, t('openPlugins')),
                ),
              ),
              ready ? renderStats() : null,
              ready
                ? h('div', { className: 'rc-toolbar' }, renderSearch(), renderFilters())
                : null,
              ready ? null : renderStatus(),
              ready ? renderBundleSection() : null,
              ready ? renderModuleSection() : null,
              ready ? h('div', { className: 'rc-foot' }, t('footNote')) : null,
            ),
          ),
        );
      }

      function searchGlyph() {
        return h(
          'svg',
          { width: 14, height: 14, viewBox: '0 0 16 16', fill: 'none', 'aria-hidden': 'true' },
          h('circle', { cx: 7, cy: 7, r: 4.25, stroke: 'currentColor', strokeWidth: 1.4 }),
          h('path', { d: 'M10.2 10.2 13 13', stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round' }),
        );
      }

      const Page = function ResourceCenterPageEntry() {
        return h(Boundary, { crashText: t('crash') }, h(ResourceCenterPage));
      };

      ctx.slots.inject('main', () =>
        ctx.slots.register(
          { name: 'main', key: PANEL_ID, locale: NS },
          Page,
        ),
      );

      ctx.slots.inject('sidebar.panellist', () =>
        ctx.slots.register(
          {
            name: 'sidebar.panellist',
            id: PANEL_ID,
            order: 20,
            label: () => t('panel'),
            locale: NS,
          },
          PanelIcon,
        ),
      );
    }

    return { inject, apply };
  },
});
