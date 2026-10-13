import React, { useState, useEffect } from 'react';
import {
  DOCS_GROUPS,
  findDocItemById,
  CLI_COMMAND_GROUPS,
  CLI_GLOBAL_FLAGS,
  CLI_EXIT_CODES,
  findCliCommandById,
  INTEGRATIONS_CATALOG,
  REST_API_ENDPOINTS,
  CLIENT_SDKS_CATALOG
} from './docsData.js';
import {
  Shield,
  Search,
  Zap,
  Layers,
  Terminal,
  CodeXml,
  Globe,
  Lock,
  Sparkles,
  Copy,
  Check,
  ArrowRight,
  ArrowLeft,
  LayoutDashboard,
  Home,
  Menu,
  X,
  Info,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  KeyRound,
  FileCode2,
  Cpu,
  Layers2,
  GitBranch,
  Cloud,
  Package,
  BookOpen
} from 'lucide-react';
import { navigate, getQueryParam } from '../../utils/router';

export const DocsPage = ({ isAuthenticated = false }) => {
  const [activeItemId, setActiveItemId] = useState(() => {
    return getQueryParam('section') || 'overview';
  });

  // Enforce single-open accordion: strictly only ONE dropdown category is open at a time
  const [openGroupId, setOpenGroupId] = useState(() => {
    const initialId = getQueryParam('section') || 'overview';
    const { group } = findDocItemById(initialId);
    return group ? group.id : 'getting-started';
  });

  // Nested CLI command category state (auto-expands matching group for active command)
  const [cliSubGroupId, setCliSubGroupId] = useState(() => {
    const initialId = getQueryParam('section') || 'overview';
    const { item } = findDocItemById(initialId);
    return item && item.cliGroupId ? item.cliGroupId : (CLI_COMMAND_GROUPS[0]?.groupId || 'cli-overview-group');
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [cliCatalogQuery, setCliCatalogQuery] = useState('');
  const [cliInstallTab, setCliInstallTab] = useState('npm');
  const [copiedCodeId, setCopiedCodeId] = useState(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [selectedPkgManager, setSelectedPkgManager] = useState('npm');
  const [catalogSearchQuery, setCatalogSearchQuery] = useState('');
  const [catalogCategoryFilter, setCatalogCategoryFilter] = useState('ALL');
  const [apiSearchQuery, setApiSearchQuery] = useState('');
  const [apiMethodFilter, setApiMethodFilter] = useState('ALL');
  const [activeSdkLanguage, setActiveSdkLanguage] = useState('sdk-java-core');
  const [expandedEndpointId, setExpandedEndpointId] = useState(null);

  // Synchronize on browser history popstate and custom navigation event
  useEffect(() => {
    const handleLocationChange = () => {
      const sec = getQueryParam('section') || 'overview';
      setActiveItemId(sec);
      const { item, group } = findDocItemById(sec);
      if (group) {
        setOpenGroupId(group.id);
      }
      if (item && item.cliGroupId) {
        setCliSubGroupId(item.cliGroupId);
      }
    };
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('secretvault-client-navigation', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('secretvault-client-navigation', handleLocationChange);
    };
  }, []);

  // When search query changes, open the first group that has matching items
  useEffect(() => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      // Check CLI command groups first
      const matchingCliGroup = CLI_COMMAND_GROUPS.find((g) =>
        g.groupTitle.toLowerCase().includes(q) ||
        g.commands.some(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            c.summary.toLowerCase().includes(q) ||
            c.syntax.toLowerCase().includes(q) ||
            (c.aliases && c.aliases.some((a) => a.toLowerCase().includes(q))) ||
            c.options.some((o) => o.flag.toLowerCase().includes(q) || o.desc.toLowerCase().includes(q))
        )
      );
      if (matchingCliGroup) {
        setOpenGroupId('cli');
        setCliSubGroupId(matchingCliGroup.groupId);
        return;
      }

      const matchingGroup = DOCS_GROUPS.find((g) =>
        g.title.toLowerCase().includes(q) ||
        g.items.some(
          (it) =>
            it.title.toLowerCase().includes(q) ||
            (it.summary && it.summary.toLowerCase().includes(q))
        )
      );
      if (matchingGroup) {
        setOpenGroupId(matchingGroup.id);
      }
    }
  }, [searchQuery]);

  // Accordion toggle: clicking the currently open group closes it; clicking another closes previous and opens new
  const toggleGroup = (groupId) => {
    setOpenGroupId((prev) => (prev === groupId ? null : groupId));
  };

  const handleSelectItem = (itemId, groupId) => {
    setActiveItemId(itemId);
    setOpenGroupId(groupId); // Keep ONLY this group open
    const { item } = findDocItemById(itemId);
    if (item && item.cliGroupId) {
      setCliSubGroupId(item.cliGroupId);
    }
    setIsMobileSidebarOpen(false);
    navigate(`/docs?section=${itemId}`, { preserveScroll: true });
    try {
      if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (e) {
      // Ignore in headless test environments (jsdom)
    }
  };

  const handleCopy = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const { item: activeItem, group: activeGroup } = findDocItemById(activeItemId);

  // Flatten all items for previous/next navigation
  const allItems = DOCS_GROUPS.flatMap((g) =>
    g.items.map((it) => ({ ...it, parentGroupId: g.id, parentGroupTitle: g.title }))
  );
  const currentFlatIndex = allItems.findIndex((it) => it.id === activeItem.id);
  const prevItem = currentFlatIndex > 0 ? allItems[currentFlatIndex - 1] : null;
  const nextItem = currentFlatIndex < allItems.length - 1 ? allItems[currentFlatIndex + 1] : null;

  const getGroupIcon = (iconName) => {
    switch (iconName) {
      case 'zap':
        return <Zap className="w-4 h-4" />;
      case 'terminal':
        return <Terminal className="w-4 h-4" />;
      case 'code-xml':
        return <CodeXml className="w-4 h-4" />;
      case 'layers':
        return <Layers className="w-4 h-4" />;
      case 'git-branch':
        return <GitBranch className="w-4 h-4" />;
      case 'cpu':
        return <Cpu className="w-4 h-4" />;
      case 'shield':
        return <Shield className="w-4 h-4" />;
      case 'cloud':
        return <Cloud className="w-4 h-4" />;
      case 'package':
        return <Package className="w-4 h-4" />;
      case 'book-open':
        return <BookOpen className="w-4 h-4" />;
      case 'lock':
        return <Lock className="w-4 h-4" />;
      case 'globe':
        return <Globe className="w-4 h-4" />;
      default:
        return <Zap className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#26000B] text-white font-sans selection:bg-[#FF2D6D] selection:text-white relative overflow-x-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-tr from-[#FF2D6D]/15 via-[#760031]/15 to-transparent blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[20%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-gradient-to-br from-[#FF2D6D]/10 via-[#30000F]/20 to-transparent blur-[100px] pointer-events-none z-0" />

      {/* Top Mobile Bar */}
      <div className="md:hidden sticky top-0 z-50 h-16 bg-[#1E000A]/95 backdrop-blur-xl border-b border-[#FFB4C8]/15 px-4 flex items-center justify-between">
        <button
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="p-2 rounded-lg bg-[#30000F] border border-[#FFB4C8]/15 text-[#F4B5C8] hover:text-white"
        >
          {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 bg-transparent border-none cursor-pointer"
        >
          <div className="w-7 h-7 rounded-lg bg-[#3F0016] border border-[#FF2D6D]/30 flex items-center justify-center">
            <Shield className="w-4 h-4 text-[#FF2D6D]" />
          </div>
          <span className="font-mono font-bold text-white text-base">
            Secret<span className="text-[#FF2D6D] font-black italic">Vault</span>
          </span>
        </button>

        <button
          onClick={() => navigate('/app')}
          className="p-2 rounded-lg bg-[#FF2D6D]/15 text-[#FF85A2] border border-[#FF2D6D]/30 text-xs font-mono font-bold hover:bg-[#FF2D6D]/25"
        >
          Console
        </button>
      </div>

      <div className="relative flex min-h-screen z-10">
        {/* =========================================================================
            LEFT FIXED GLASSMORPHIC SIDEBAR (ACCORDION / COLLECTION STYLE)
           ========================================================================= */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-72 bg-[#1E000A]/95 backdrop-blur-2xl border-r border-[#FFB4C8]/15 flex flex-col transition-all duration-300 md:translate-x-0 ${
            isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Logo Header */}
          <div className="h-16 flex items-center px-6 border-b border-[#FFB4C8]/10 flex-shrink-0">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2.5 font-bold text-lg tracking-tight hover:opacity-90 transition-opacity bg-transparent border-none cursor-pointer p-0"
            >
              <div className="h-8 w-8 rounded-lg bg-[#3F0016] border border-[#FF2D6D]/30 flex items-center justify-center shadow-inner">
                <Shield className="w-4 h-4 text-[#FF2D6D]" />
              </div>
              <span className="text-white font-mono tracking-tight font-extrabold text-base">
                Secret<span className="text-[#FF2D6D] font-black italic">Vault</span>
                <span className="ml-1 text-[10px] font-sans text-[#A26377] font-normal">Docs</span>
              </span>
            </button>
          </div>

          {/* Search Input with ⌘K Badge */}
          <div className="px-4 py-4 flex-shrink-0">
            <div className="relative group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#A26377] group-focus-within:text-[#FF2D6D] transition-colors pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search documentation..."
                className="w-full bg-[#0D0106]/90 hover:bg-[#0D0106] border border-[#FFB4C8]/15 text-xs font-mono rounded-xl pl-9 pr-10 py-2.5 focus:border-[#FF2D6D]/70 focus:ring-1 focus:ring-[#FF2D6D]/20 transition-all outline-none text-white placeholder:text-[#A26377]"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none opacity-50 group-focus-within:opacity-100 transition-opacity">
                <kbd className="font-mono text-[9px] text-[#A26377] bg-[#30000F] px-1.5 py-0.5 rounded border border-[#FFB4C8]/15">
                  ⌘K
                </kbd>
              </div>
            </div>
          </div>

          {/* =====================================================================
              COLLAPSIBLE DROPDOWN / ACCORDION COLLECTION LIST (SINGLE-OPEN ONLY)
             ===================================================================== */}
          <nav className="flex-1 min-h-0 flex flex-col gap-2 px-3 overflow-y-auto custom-scrollbar pb-6">
            {DOCS_GROUPS.map((group) => {
              const isExpanded = openGroupId === group.id;
              const hasActiveChild = group.items.some((it) => it.id === activeItem.id);

              // Filter sub-items by search query if present
              const matchingItems = group.items.filter((it) => {
                if (!searchQuery.trim()) return true;
                const q = searchQuery.toLowerCase();
                return (
                  it.title.toLowerCase().includes(q) ||
                  it.summary.toLowerCase().includes(q) ||
                  group.title.toLowerCase().includes(q)
                );
              });

              if (searchQuery.trim() && matchingItems.length === 0) {
                return null;
              }

              return (
                <div
                  key={group.id}
                  className="rounded-xl overflow-hidden border border-[#FFB4C8]/15 bg-[#30000F]/60 flex-shrink-0 transition-all duration-200"
                >
                  {/* Category Header Row (Click to Expand / Collapse) */}
                  <button
                    onClick={() => toggleGroup(group.id)}
                    className={`w-full px-3.5 py-2.5 transition-all flex items-center justify-between text-xs font-bold cursor-pointer border-none text-left ${
                      hasActiveChild
                        ? 'text-[#FF85A2] bg-[#FF2D6D]/15'
                        : 'text-[#F4B5C8]/80 hover:text-white hover:bg-[#3F0016]/50 bg-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={hasActiveChild ? 'text-[#FF2D6D]' : 'text-[#A26377]'}>
                        {getGroupIcon(group.icon)}
                      </span>
                      <span className="truncate font-sans tracking-tight">{group.title}</span>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {group.badge && (
                        <span className="text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#4A001C] text-[#FF85A2] border border-[#FF2D6D]/30">
                          {group.badge}
                        </span>
                      )}
                      <ChevronRight
                        className={`w-3.5 h-3.5 text-[#A26377] transition-transform duration-200 ${
                          isExpanded ? 'rotate-90 text-[#FF2D6D]' : ''
                        }`}
                      />
                    </div>
                  </button>

                  {/* Sub-Items Dropdown List */}
                  {isExpanded && (
                    <div className="py-1.5 pl-3 pr-2 space-y-1 bg-[#1E000A]/90 border-t border-[#FFB4C8]/10">
                      {group.id === 'cli' ? (
                        <div className="space-y-1.5">
                          {/* CLI Root Overview */}
                          <button
                            onClick={() => handleSelectItem('cli-overview', 'cli')}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all cursor-pointer border-l-2 text-left ${
                              activeItem.id === 'cli-overview'
                                ? 'text-white bg-gradient-to-r from-[#FF2D6D]/20 via-[#FF2D6D]/10 to-transparent border-[#FF2D6D] font-bold shadow-[inset_0_0_12px_rgba(255,45,109,0.15)] pl-3.5'
                                : 'text-[#F4B5C8]/80 hover:text-white hover:bg-[#30000F]/50 border-transparent font-medium bg-transparent'
                            }`}
                          >
                            <span className="truncate pr-2 font-mono">CLI Overview &amp; Installation</span>
                            <span
                              className={`text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded flex-shrink-0 ${
                                activeItem.id === 'cli-overview'
                                  ? 'bg-[#FF2D6D] text-white font-bold'
                                  : 'bg-[#30000F] text-[#A26377]'
                              }`}
                            >
                              Root
                            </span>
                          </button>

                          {/* Nested Expandable Command Subsystems */}
                          <div className="space-y-1 pt-1 border-t border-[#FFB4C8]/10">
                            {CLI_COMMAND_GROUPS.map((cmdGroup) => {
                              const isSubOpen = cliSubGroupId === cmdGroup.groupId;
                              const hasActiveInSub = cmdGroup.commands.some((c) => c.id === activeItem.id);

                              const matchingCmds = cmdGroup.commands.filter((c) => {
                                if (!searchQuery.trim()) return true;
                                const q = searchQuery.toLowerCase();
                                return (
                                  c.name.toLowerCase().includes(q) ||
                                  c.summary.toLowerCase().includes(q) ||
                                  c.syntax.toLowerCase().includes(q) ||
                                  (c.aliases && c.aliases.some((a) => a.toLowerCase().includes(q))) ||
                                  c.options.some((o) => o.flag.toLowerCase().includes(q) || o.desc.toLowerCase().includes(q))
                                );
                              });

                              if (searchQuery.trim() && matchingCmds.length === 0) return null;

                              return (
                                <div
                                  key={cmdGroup.groupId}
                                  className="rounded-lg overflow-hidden border border-[#FFB4C8]/10 bg-[#25000D]/50"
                                >
                                  <button
                                    onClick={() => setCliSubGroupId((prev) => (prev === cmdGroup.groupId ? null : cmdGroup.groupId))}
                                    className={`w-full px-2.5 py-1.5 transition-all flex items-center justify-between text-[11px] font-semibold cursor-pointer border-none text-left ${
                                      hasActiveInSub
                                        ? 'text-[#FF85A2] bg-[#FF2D6D]/10'
                                        : 'text-[#F4B5C8]/70 hover:text-white hover:bg-[#30000F]/40 bg-transparent'
                                    }`}
                                  >
                                    <span className="truncate pr-1 font-sans">{cmdGroup.groupTitle}</span>
                                    <div className="flex items-center gap-1.5 flex-shrink-0">
                                      <span className="text-[9px] font-mono text-[#A26377] px-1 py-0.5 bg-[#30000F] rounded">
                                        {cmdGroup.commands.length}
                                      </span>
                                      <ChevronRight
                                        className={`w-3 h-3 text-[#A26377] transition-transform duration-200 ${
                                          isSubOpen ? 'rotate-90 text-[#FF2D6D]' : ''
                                        }`}
                                      />
                                    </div>
                                  </button>

                                  {isSubOpen && (
                                    <div className="py-1 pl-2 pr-1 space-y-0.5 bg-[#180007]/90 border-t border-[#FFB4C8]/10">
                                      {matchingCmds.map((cmd) => {
                                        const isCmdSelected = activeItem.id === cmd.id;
                                        return (
                                          <button
                                            key={cmd.id}
                                            onClick={() => handleSelectItem(cmd.id, 'cli')}
                                            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded text-[11px] font-mono transition-all cursor-pointer border-l-2 text-left ${
                                              isCmdSelected
                                                ? 'text-white bg-gradient-to-r from-[#FF2D6D]/20 via-[#FF2D6D]/10 to-transparent border-[#FF2D6D] font-bold pl-3'
                                                : 'text-[#F4B5C8]/70 hover:text-white hover:bg-[#30000F]/30 border-transparent bg-transparent'
                                            }`}
                                          >
                                            <span className="truncate pr-1.5">
                                              {cmd.name.replace(/^secretvault\s*/, '') || cmd.name}
                                            </span>
                                            <span
                                              className={`text-[8px] font-mono px-1 py-0.2 rounded uppercase ${
                                                isCmdSelected ? 'bg-[#FF2D6D] text-white font-bold' : 'text-[#A26377]'
                                              }`}
                                            >
                                              ✓
                                            </span>
                                          </button>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        matchingItems.map((item) => {
                          const isItemSelected = activeItem.id === item.id;
                          return (
                            <button
                              key={item.id}
                              onClick={() => handleSelectItem(item.id, group.id)}
                              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all cursor-pointer border-l-2 text-left ${
                                isItemSelected
                                  ? 'text-white bg-gradient-to-r from-[#FF2D6D]/20 via-[#FF2D6D]/10 to-transparent border-[#FF2D6D] font-bold shadow-[inset_0_0_12px_rgba(255,45,109,0.15)] pl-3.5'
                                  : 'text-[#F4B5C8]/80 hover:text-white hover:bg-[#30000F]/50 border-transparent font-medium bg-transparent'
                              }`}
                            >
                              <span className="truncate pr-2">{item.title}</span>
                              {item.badge && (
                                <span
                                  className={`text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded flex-shrink-0 ${
                                    isItemSelected
                                      ? 'bg-[#FF2D6D] text-white font-bold'
                                      : 'bg-[#30000F] text-[#A26377]'
                                  }`}
                                >
                                  {item.badge}
                                </span>
                              )}
                            </button>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Bottom Sidebar Footer */}
          <div className="p-4 border-t border-[#FFB4C8]/15 bg-[#180007] flex-shrink-0">
            <div className="flex flex-col gap-2">
              <button
                onClick={() => navigate(isAuthenticated ? '/app' : '/login')}
                className="text-xs font-bold text-[#FF85A2] hover:text-white transition-colors flex items-center gap-2 bg-[#FF2D6D]/15 hover:bg-[#FF2D6D]/25 py-2.5 px-3 rounded-xl border border-[#FF2D6D]/30 cursor-pointer w-full text-left"
              >
                <LayoutDashboard className="h-4 w-4 text-[#FF2D6D]" />
                <span>{isAuthenticated ? 'Go to Console Dashboard' : 'Sign In to Workspace'}</span>
              </button>
              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => navigate('/')}
                  className="text-[11px] font-mono text-[#A26377] hover:text-[#FF85A2] flex items-center gap-1.5 bg-transparent border-none cursor-pointer p-0"
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>Landing Page</span>
                </button>
                <div className="flex items-center gap-1.5 py-0.5 px-2 bg-[#26000B] rounded border border-[#FFB4C8]/15">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] animate-pulse" />
                  <span className="text-[10px] font-mono text-[#A26377]">v2.4.0</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile backdrop */}
        {isMobileSidebarOpen && (
          <div
            onClick={() => setIsMobileSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
          />
        )}

        {/* =========================================================================
            MAIN DETAIL CANVAS FOR SELECTED SUB-ITEM
           ========================================================================= */}
        <main className="flex-1 md:ml-72 xl:mr-64 relative min-w-0 z-10">
          <div className="max-w-5xl mx-auto px-6 sm:px-10 lg:px-12 pt-16 pb-32">
            {activeItem.isCliCommand ? (
              /* =====================================================================
                  CONCISE CLI COMMAND REFERENCE (STRICT SECTION 4: NO TUTORIAL PROSE)
                 ===================================================================== */
              <div className="space-y-8">
                {/* Breadcrumb Hierarchy */}
                <div className="flex items-center gap-2 text-xs font-mono text-[#A26377]">
                  <span className="hover:text-[#FF2D6D] cursor-pointer" onClick={() => handleSelectItem('overview', 'getting-started')}>
                    Docs
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#5E3240]" />
                  <span className="hover:text-[#FF2D6D] cursor-pointer text-[#F4B5C8]" onClick={() => handleSelectItem('cli-overview', 'cli')}>
                    CLI Reference
                  </span>
                  {activeItem.cliGroupTitle && (
                    <>
                      <ChevronRight className="w-3.5 h-3.5 text-[#5E3240]" />
                      <span className="text-[#F4B5C8]">{activeItem.cliGroupTitle}</span>
                    </>
                  )}
                  <ChevronRight className="w-3.5 h-3.5 text-[#5E3240]" />
                  <span className="text-[#FF2D6D] font-semibold">{activeItem.name}</span>
                </div>

                {/* Command Header */}
                <div className="space-y-3 pb-6 border-b border-[#FFB4C8]/15">
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-2xl sm:text-4xl font-black font-mono text-white tracking-tight">
                      {activeItem.name}
                    </h1>
                    <span className="px-2.5 py-1 text-xs font-mono font-bold rounded-lg bg-[#34D399]/10 text-[#34D399] border border-[#34D399]/20 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] animate-pulse" />
                      {activeItem.verificationStatus || 'Implemented and verified'}
                    </span>
                  </div>

                  {activeItem.aliases && activeItem.aliases.length > 0 && (
                    <div className="flex items-center gap-2 text-xs font-mono text-[#A26377]">
                      <span className="text-[#A26377]">Aliases:</span>
                      {activeItem.aliases.map((alias) => (
                        <code key={alias} className="px-1.5 py-0.5 rounded bg-[#30000F] text-[#FF85A2] border border-[#FFB4C8]/15">
                          {alias}
                        </code>
                      ))}
                    </div>
                  )}

                  <p className="text-[#F4B5C8]/80 text-sm font-mono leading-relaxed max-w-3xl">
                    {activeItem.summary}
                  </p>
                </div>

                {/* Syntax */}
                <section className="space-y-3">
                  <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#FF85A2]">
                    Syntax
                  </h2>
                  <div className="relative rounded-xl bg-[#0D0106] border border-[#FFB4C8]/15 p-4 font-mono text-xs text-[#FF85A2] overflow-x-auto shadow-inner flex items-center justify-between">
                    <code>{activeItem.syntax}</code>
                    <button
                      onClick={() => handleCopy(activeItem.syntax, `syntax-${activeItem.id}`)}
                      className="text-[#A26377] hover:text-white p-1.5 rounded-lg bg-[#30000F] border border-[#FFB4C8]/15 ml-3 flex-shrink-0 cursor-pointer"
                      title="Copy syntax"
                    >
                      {copiedCodeId === `syntax-${activeItem.id}` ? (
                        <Check className="w-3.5 h-3.5 text-[#34D399]" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </section>

                {/* Arguments Table */}
                {activeItem.arguments && activeItem.arguments.length > 0 && (
                  <section className="space-y-3">
                    <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#FF85A2]">
                      Arguments
                    </h2>
                    <div className="overflow-x-auto rounded-xl border border-[#FFB4C8]/15">
                      <table className="w-full text-left font-mono text-xs">
                        <thead className="bg-[#180007] text-[#A26377] border-b border-[#FFB4C8]/15">
                          <tr>
                            <th className="py-2.5 px-4 font-semibold text-[#F4B5C8]">Argument</th>
                            <th className="py-2.5 px-4 font-semibold text-[#F4B5C8]">Required</th>
                            <th className="py-2.5 px-4 font-semibold text-[#F4B5C8]">Description</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#FFB4C8]/10 bg-[#0D0106]">
                          {activeItem.arguments.map((arg, idx) => (
                            <tr key={idx} className="hover:bg-white/[0.02]">
                              <td className="py-2.5 px-4 text-[#FF85A2] font-bold whitespace-nowrap">{arg.name}</td>
                              <td className="py-2.5 px-4">
                                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                  arg.required ? 'bg-[#FBBF24]/10 text-[#FBBF24] border border-[#FBBF24]/20' : 'bg-slate-500/10 text-slate-400'
                                }`}>
                                  {arg.required ? 'Yes' : 'No'}
                                </span>
                              </td>
                              <td className="py-2.5 px-4 text-[#F4B5C8]/90">{arg.desc}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                )}

                {/* Options Table */}
                {activeItem.options && activeItem.options.length > 0 && (
                  <section className="space-y-3">
                    <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#FF85A2]">
                      Options &amp; Flags
                    </h2>
                    <div className="overflow-x-auto rounded-xl border border-[#FFB4C8]/15">
                      <table className="w-full text-left font-mono text-xs">
                        <thead className="bg-[#180007] text-[#A26377] border-b border-[#FFB4C8]/15">
                          <tr>
                            <th className="py-2.5 px-4 font-semibold text-[#F4B5C8]">Option</th>
                            <th className="py-2.5 px-4 font-semibold text-[#F4B5C8]">Type</th>
                            <th className="py-2.5 px-4 font-semibold text-[#F4B5C8]">Default</th>
                            <th className="py-2.5 px-4 font-semibold text-[#F4B5C8]">Description</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#FFB4C8]/10 bg-[#0D0106]">
                          {activeItem.options.map((opt, idx) => (
                            <tr key={idx} className="hover:bg-white/[0.02]">
                              <td className="py-2.5 px-4 text-[#FF85A2] font-bold whitespace-nowrap">{opt.flag}</td>
                              <td className="py-2.5 px-4 text-[#A26377] text-[11px]">{opt.type}</td>
                              <td className="py-2.5 px-4 text-[#A26377] text-[11px]">{opt.default}</td>
                              <td className="py-2.5 px-4 text-[#F4B5C8]/90">{opt.desc}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                )}

                {/* Required Configuration & Environment Variables */}
                {activeItem.envVars && activeItem.envVars.length > 0 && (
                  <section className="space-y-3">
                    <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#FF85A2]">
                      Required Configuration &amp; Environment Variables
                    </h2>
                    <div className="overflow-x-auto rounded-xl border border-[#FFB4C8]/15">
                      <table className="w-full text-left font-mono text-xs">
                        <thead className="bg-[#180007] text-[#A26377] border-b border-[#FFB4C8]/15">
                          <tr>
                            <th className="py-2.5 px-4 font-semibold text-[#F4B5C8]">Variable</th>
                            <th className="py-2.5 px-4 font-semibold text-[#F4B5C8]">Description</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#FFB4C8]/10 bg-[#0D0106]">
                          {activeItem.envVars.map((v, idx) => (
                            <tr key={idx} className="hover:bg-white/[0.02]">
                              <td className="py-2.5 px-4 text-[#FF85A2] font-bold whitespace-nowrap">{v.name}</td>
                              <td className="py-2.5 px-4 text-[#F4B5C8]/90">{v.desc}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                )}

                {/* Required Permissions */}
                {activeItem.permissions && (
                  <section className="space-y-2">
                    <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#FF85A2]">
                      Required Permissions
                    </h2>
                    <div className="rounded-xl bg-[#30000F] border border-[#FFB4C8]/15 p-3.5 flex items-center gap-3">
                      <Shield className="w-4 h-4 text-[#818CF8] flex-shrink-0" />
                      <span className="font-mono text-xs text-[#F4B5C8]">{activeItem.permissions}</span>
                    </div>
                  </section>
                )}

                {/* Example Invocation */}
                {activeItem.example && (
                  <section className="space-y-3">
                    <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#FF85A2]">
                      Example Invocation
                    </h2>
                    <div className="group relative rounded-xl bg-[#0D0106] border border-[#FFB4C8]/15 p-4 font-mono text-xs text-[#34D399] overflow-x-auto shadow-2xl flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[#A26377] font-bold select-none">$</span>
                        <code>{activeItem.example}</code>
                      </div>
                      <button
                        onClick={() => handleCopy(activeItem.example, `ex-${activeItem.id}`)}
                        className="text-[#A26377] hover:text-white p-1.5 rounded-lg bg-[#30000F] border border-[#FFB4C8]/15 ml-3 flex-shrink-0 cursor-pointer"
                        title="Copy example"
                      >
                        {copiedCodeId === `ex-${activeItem.id}` ? (
                          <Check className="w-3.5 h-3.5 text-[#34D399]" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </section>
                )}

                {/* Output & Exit Codes */}
                {activeItem.exitCodes && (
                  <section className="space-y-2">
                    <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#FF85A2]">
                      Output &amp; Exit Codes
                    </h2>
                    <div className="rounded-xl bg-[#30000F] border border-[#FFB4C8]/15 p-3.5 font-mono text-xs text-[#F4B5C8]">
                      {activeItem.exitCodes}
                    </div>
                  </section>
                )}

                {/* Related Commands */}
                {activeItem.related && activeItem.related.length > 0 && (
                  <section className="space-y-3 pt-4 border-t border-[#FFB4C8]/15">
                    <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#FF85A2]">
                      Related Commands
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {activeItem.related.map((relId) => {
                        const { command: relCmd } = findCliCommandById(relId);
                        return (
                          <button
                            key={relId}
                            onClick={() => handleSelectItem(relId, 'cli')}
                            className="px-3 py-1.5 rounded-lg bg-[#30000F] hover:bg-[#3F0016] border border-[#FFB4C8]/15 hover:border-[#FF2D6D]/40 text-xs font-mono text-[#FF85A2] transition-all cursor-pointer flex items-center gap-1.5"
                          >
                            <span>{relCmd ? relCmd.name : relId}</span>
                            <ArrowRight className="w-3 h-3 text-[#A26377]" />
                          </button>
                        );
                      })}
                    </div>
                  </section>
                )}
              </div>
            ) : activeItem.id === 'cli-overview' ? (
              /* =====================================================================
                  MAIN CLI REFERENCE LANDING PAGE (STRICT SECTION 5)
                 ===================================================================== */
              <div className="space-y-12">
                {/* Breadcrumb Hierarchy */}
                <div className="flex items-center gap-2 text-xs font-mono text-[#A26377]">
                  <span className="hover:text-[#FF2D6D] cursor-pointer" onClick={() => handleSelectItem('overview', 'getting-started')}>
                    Docs
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#5E3240]" />
                  <span className="text-[#FF2D6D] font-semibold">CLI Reference</span>
                </div>

                {/* Header / Hero */}
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-[1.1] font-sans">
                      SecretVault CLI Reference
                    </h1>
                    <span className="px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider text-[#FF85A2] bg-[#FF2D6D]/10 border border-[#FF2D6D]/20 rounded-lg">
                      @secretvault/cli
                    </span>
                  </div>
                  <p className="text-[#F4B5C8]/80 text-sm sm:text-base leading-relaxed max-w-3xl">
                    The official developer command-line interface for local runtime injection, context switching, repository secret scanning, and zero-trust secrets governance. Grounded directly in the Java 21 Picocli implementation.
                  </p>

                  {/* Stats Bar */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    <div className="p-3.5 rounded-xl bg-[#30000F] border border-[#FFB4C8]/15">
                      <div className="text-xl font-mono font-black text-[#FF85A2]">101</div>
                      <div className="text-[11px] font-sans text-[#A26377]">Verified Commands</div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-[#30000F] border border-[#FFB4C8]/15">
                      <div className="text-xl font-mono font-black text-[#34D399]">14</div>
                      <div className="text-[11px] font-sans text-[#A26377]">Command Subsystems</div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-[#30000F] border border-[#FFB4C8]/15">
                      <div className="text-xl font-mono font-black text-[#818CF8]">Java 21+</div>
                      <div className="text-[11px] font-sans text-[#A26377]">Picocli Core Engine</div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-[#30000F] border border-[#FFB4C8]/15">
                      <div className="text-xl font-mono font-black text-[#FBBF24]">&lt;12ms</div>
                      <div className="text-[11px] font-sans text-[#A26377]">RAM-Only Injection</div>
                    </div>
                  </div>
                </div>

                {/* Section 1: Installation & Packaging */}
                <section className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-[#FF2D6D]" />
                    <h2 className="text-lg font-bold text-white font-sans">1. Installation &amp; Distribution</h2>
                  </div>

                  <div className="rounded-2xl bg-[#1E000A] border border-[#FFB4C8]/15 overflow-hidden shadow-2xl">
                    <div className="flex items-center gap-1 p-2 bg-[#140006] border-b border-[#FFB4C8]/15 overflow-x-auto">
                      {[
                        { id: 'npm', label: 'npm (Global Distribution)' },
                        { id: 'source', label: 'Local Source Build (Maven)' },
                        { id: 'link', label: 'Dev npm link' },
                        { id: 'jar', label: 'Standalone Executable Jar' }
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setCliInstallTab(tab.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer border-none whitespace-nowrap ${
                            cliInstallTab === tab.id
                              ? 'bg-[#FF2D6D] text-white font-bold shadow-sm'
                              : 'text-[#A26377] hover:text-[#F4B5C8] bg-transparent'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    <div className="p-5 font-mono text-xs text-[#FF85A2] bg-[#0D0106]">
                      {cliInstallTab === 'npm' && (
                        <div className="flex items-center justify-between">
                          <code>npm install -g @secretvault/cli</code>
                          <button
                            onClick={() => handleCopy('npm install -g @secretvault/cli', 'inst-npm')}
                            className="text-[#A26377] hover:text-white p-1 rounded bg-transparent border-none cursor-pointer"
                          >
                            {copiedCodeId === 'inst-npm' ? <Check className="w-3.5 h-3.5 text-[#34D399]" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      )}
                      {cliInstallTab === 'source' && (
                        <div className="flex items-center justify-between">
                          <code>mvn clean package -DskipTests &amp;&amp; node cli/bin/secretvault.js --help</code>
                          <button
                            onClick={() => handleCopy('mvn clean package -DskipTests && node cli/bin/secretvault.js --help', 'inst-source')}
                            className="text-[#A26377] hover:text-white p-1 rounded bg-transparent border-none cursor-pointer"
                          >
                            {copiedCodeId === 'inst-source' ? <Check className="w-3.5 h-3.5 text-[#34D399]" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      )}
                      {cliInstallTab === 'link' && (
                        <div className="flex items-center justify-between">
                          <code>cd cli &amp;&amp; npm link &amp;&amp; secretvault --version</code>
                          <button
                            onClick={() => handleCopy('cd cli && npm link && secretvault --version', 'inst-link')}
                            className="text-[#A26377] hover:text-white p-1 rounded bg-transparent border-none cursor-pointer"
                          >
                            {copiedCodeId === 'inst-link' ? <Check className="w-3.5 h-3.5 text-[#34D399]" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      )}
                      {cliInstallTab === 'jar' && (
                        <div className="flex items-center justify-between">
                          <code>java -jar cli/target/secretvault-cli-1.0.0.jar --help</code>
                          <button
                            onClick={() => handleCopy('java -jar cli/target/secretvault-cli-1.0.0.jar --help', 'inst-jar')}
                            className="text-[#A26377] hover:text-white p-1 rounded bg-transparent border-none cursor-pointer"
                          >
                            {copiedCodeId === 'inst-jar' ? <Check className="w-3.5 h-3.5 text-[#34D399]" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#FF2D6D]/[0.06] border border-[#FF2D6D]/20 flex items-start gap-3 text-xs">
                    <Info className="w-4 h-4 text-[#FF2D6D] flex-shrink-0 mt-0.5" />
                    <div className="space-y-1 text-[#F4B5C8]">
                      <p className="font-semibold text-[#FF85A2] m-0">Runtime Prerequisites</p>
                      <p className="m-0 text-[#A26377]">
                        SecretVault CLI is powered by a high-performance Picocli engine and requires <strong className="text-white">Java 21+ JDK</strong> on the host machine. The Node.js launcher (<code className="text-[#FF85A2]">cli/bin/secretvault.js</code>) verifies <code className="text-[#FF85A2]">JAVA_HOME</code> and system <code className="text-[#FF85A2]">PATH</code> automatically.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Section 2: Executable & Storage */}
                <section className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-[#818CF8]" />
                    <h2 className="text-lg font-bold text-white font-sans">2. Executable &amp; Configuration Storage</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 rounded-2xl bg-[#30000F] border border-[#FFB4C8]/15 space-y-2">
                      <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#FF85A2]">Binary Name &amp; Aliases</h3>
                      <p className="text-xs text-[#F4B5C8]/80 leading-relaxed">
                        The CLI installs the primary command <code className="text-[#FF85A2] font-bold">secretvault</code> and the verified short alias <code className="text-[#FF85A2] font-bold">sv</code>:
                      </p>
                      <div className="rounded-lg bg-[#0D0106] p-2.5 font-mono text-xs text-[#34D399]">
                        $ sv secret list
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-[#30000F] border border-[#FFB4C8]/15 space-y-2">
                      <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#818CF8]">Filesystem Configuration</h3>
                      <p className="text-xs text-[#F4B5C8]/80 leading-relaxed">
                        Session credentials and active workspace context are stored locally under user home:
                      </p>
                      <div className="font-mono text-[11px] text-[#A26377] space-y-1">
                        <div>• <code className="text-[#FF85A2]">~/.secretvault/config.json</code> (Active context &amp; server URL)</div>
                        <div>• <code className="text-[#FF85A2]">~/.secretvault/credentials.json</code> (Encrypted session tokens, 0600)</div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Section 3: Environment Variables */}
                <section className="space-y-4">
                  <h2 className="text-lg font-bold text-white font-sans">3. Supported Environment Variables</h2>
                  <div className="overflow-x-auto rounded-xl border border-[#FFB4C8]/15">
                    <table className="w-full text-left font-mono text-xs">
                      <thead className="bg-[#180007] text-[#A26377] border-b border-[#FFB4C8]/15">
                        <tr>
                          <th className="py-2.5 px-4 font-semibold text-[#F4B5C8]">Environment Variable</th>
                          <th className="py-2.5 px-4 font-semibold text-[#F4B5C8]">Default Value</th>
                          <th className="py-2.5 px-4 font-semibold text-[#F4B5C8]">Description</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#FFB4C8]/10 bg-[#0D0106]">
                        <tr>
                          <td className="py-2.5 px-4 text-[#FF85A2] font-bold">SECRETVAULT_SERVER</td>
                          <td className="py-2.5 px-4 text-[#A26377]">http://localhost:8080</td>
                          <td className="py-2.5 px-4 text-[#F4B5C8]/80">Control plane server URL fallback</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-4 text-[#FF85A2] font-bold">SECRETVAULT_PROFILE</td>
                          <td className="py-2.5 px-4 text-[#A26377]">default</td>
                          <td className="py-2.5 px-4 text-[#F4B5C8]/80">Active configuration profile name fallback</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-4 text-[#FF85A2] font-bold">SECRETVAULT_WORKSPACE</td>
                          <td className="py-2.5 px-4 text-[#A26377]">None</td>
                          <td className="py-2.5 px-4 text-[#F4B5C8]/80">Active workspace UUID or slug override</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-4 text-[#FF85A2] font-bold">SECRETVAULT_PROJECT</td>
                          <td className="py-2.5 px-4 text-[#A26377]">None</td>
                          <td className="py-2.5 px-4 text-[#F4B5C8]/80">Active project UUID or slug override</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-4 text-[#FF85A2] font-bold">SECRETVAULT_ENV</td>
                          <td className="py-2.5 px-4 text-[#A26377]">None</td>
                          <td className="py-2.5 px-4 text-[#F4B5C8]/80">Active deployment environment tier override</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-4 text-[#FF85A2] font-bold">JAVA_HOME</td>
                          <td className="py-2.5 px-4 text-[#A26377]">System PATH</td>
                          <td className="py-2.5 px-4 text-[#F4B5C8]/80">Path to Java 21+ JDK runtime location</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </section>

                {/* Section 4: Global Flags Table */}
                <section className="space-y-4">
                  <h2 className="text-lg font-bold text-white font-sans">4. Global Flags Reference</h2>
                  <div className="overflow-x-auto rounded-xl border border-[#FFB4C8]/15">
                    <table className="w-full text-left font-mono text-xs">
                      <thead className="bg-[#180007] text-[#A26377] border-b border-[#FFB4C8]/15">
                        <tr>
                          <th className="py-2.5 px-4 font-semibold text-[#F4B5C8]">Flag</th>
                          <th className="py-2.5 px-4 font-semibold text-[#F4B5C8]">Type</th>
                          <th className="py-2.5 px-4 font-semibold text-[#F4B5C8]">Default</th>
                          <th className="py-2.5 px-4 font-semibold text-[#F4B5C8]">Description</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#FFB4C8]/10 bg-[#0D0106]">
                        {CLI_GLOBAL_FLAGS.map((f, idx) => (
                          <tr key={idx} className="hover:bg-white/[0.02]">
                            <td className="py-2.5 px-4 text-[#FF85A2] font-bold whitespace-nowrap">{f.flag}</td>
                            <td className="py-2.5 px-4 text-[#A26377]">{f.type}</td>
                            <td className="py-2.5 px-4 text-[#A26377]">{f.default}</td>
                            <td className="py-2.5 px-4 text-[#F4B5C8]/80">{f.desc}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>

                {/* Section 5: Exit Codes Table */}
                <section className="space-y-4">
                  <h2 className="text-lg font-bold text-white font-sans">5. Exit Codes Reference</h2>
                  <div className="overflow-x-auto rounded-xl border border-[#FFB4C8]/15">
                    <table className="w-full text-left font-mono text-xs">
                      <thead className="bg-[#180007] text-[#A26377] border-b border-[#FFB4C8]/15">
                        <tr>
                          <th className="py-2.5 px-4 font-semibold text-[#F4B5C8]">Code</th>
                          <th className="py-2.5 px-4 font-semibold text-[#F4B5C8]">Constant</th>
                          <th className="py-2.5 px-4 font-semibold text-[#F4B5C8]">Meaning &amp; Behavior</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#FFB4C8]/10 bg-[#0D0106]">
                        {CLI_EXIT_CODES.map((ec, idx) => (
                          <tr key={idx} className="hover:bg-white/[0.02]">
                            <td className="py-2.5 px-4 text-[#FF85A2] font-black">{ec.code}</td>
                            <td className="py-2.5 px-4 text-[#FBBF24] font-bold">{ec.label}</td>
                            <td className="py-2.5 px-4 text-[#F4B5C8]/80">{ec.desc}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>

                {/* Section 6: Searchable Interactive Command Catalog */}
                <section className="space-y-4 pt-4 border-t border-[#FFB4C8]/15">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-bold text-white font-sans">6. Searchable Command Catalog</h2>
                      <p className="text-xs text-[#A26377]">Search across all 101 verified commands, flags, and subcommands in real-time.</p>
                    </div>
                    <div className="relative w-full sm:w-80">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#A26377] pointer-events-none" />
                      <input
                        type="text"
                        value={cliCatalogQuery}
                        onChange={(e) => setCliCatalogQuery(e.target.value)}
                        placeholder="Filter commands or flags..."
                        className="w-full bg-[#0D0106] border border-[#FFB4C8]/15 text-xs font-mono rounded-xl pl-9 pr-3 py-2 text-white placeholder:text-[#A26377] focus:border-[#FF2D6D] outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    {CLI_COMMAND_GROUPS.flatMap((g) => g.commands)
                      .filter((cmd) => {
                        if (!cliCatalogQuery.trim()) return true;
                        const q = cliCatalogQuery.toLowerCase();
                        return (
                          cmd.name.toLowerCase().includes(q) ||
                          cmd.summary.toLowerCase().includes(q) ||
                          cmd.syntax.toLowerCase().includes(q) ||
                          (cmd.aliases && cmd.aliases.some((a) => a.toLowerCase().includes(q))) ||
                          cmd.options.some((o) => o.flag.toLowerCase().includes(q) || o.desc.toLowerCase().includes(q))
                        );
                      })
                      .map((cmd) => (
                        <div
                          key={cmd.id}
                          className="p-3.5 rounded-xl bg-[#30000F] hover:bg-[#3F0016] border border-[#FFB4C8]/15 hover:border-[#FF2D6D]/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-mono text-xs font-bold text-white">{cmd.name}</span>
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-[#34D399]/10 text-[#34D399] border border-[#34D399]/20">
                                Verified
                              </span>
                            </div>
                            <div className="font-mono text-[11px] text-[#FF85A2]/80 truncate">{cmd.syntax}</div>
                            <div className="text-xs text-[#A26377] font-sans">{cmd.summary}</div>
                          </div>
                          <button
                            onClick={() => handleSelectItem(cmd.id, 'cli')}
                            className="px-3 py-1.5 rounded-lg bg-[#3F0016] hover:bg-[#FF2D6D] text-[#FF85A2] hover:text-white font-mono text-xs font-semibold transition-all cursor-pointer border border-[#FFB4C8]/15 flex-shrink-0 flex items-center gap-1.5"
                          >
                            <span>Reference</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                  </div>
                </section>

                {/* Section 7: Categorized Subsystem Index */}
                <section className="space-y-4 pt-4 border-t border-[#FFB4C8]/15">
                  <h2 className="text-lg font-bold text-white font-sans">7. Complete Subsystem Index</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {CLI_COMMAND_GROUPS.map((g) => (
                      <div key={g.groupId} className="p-5 rounded-2xl bg-[#30000F] border border-[#FFB4C8]/15 space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-bold text-white font-sans">{g.groupTitle}</h3>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#3F0016] text-[#A26377] border border-[#FFB4C8]/15">
                            {g.commands.length} commands
                          </span>
                        </div>
                        <div className="space-y-1">
                          {g.commands.map((cmd) => (
                            <button
                              key={cmd.id}
                              onClick={() => handleSelectItem(cmd.id, 'cli')}
                              className="w-full text-left py-1 text-xs font-mono text-[#A26377] hover:text-[#FF85A2] transition-colors flex items-center justify-between border-none bg-transparent cursor-pointer"
                            >
                              <span className="truncate pr-2">{cmd.name}</span>
                              <span className="text-[10px] text-[#5E3240]">→</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            ) : (
              <>
                {/* Breadcrumb Hierarchy */}
                <div className="mb-6 flex items-center gap-2 text-xs font-mono text-[#A26377]">
                  <span className="hover:text-[#FF2D6D] cursor-pointer" onClick={() => navigate('/docs')}>
                    Docs
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#FFB4C8]/30" />
                  <span className="text-[#F4B5C8]">{activeGroup.title}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#FFB4C8]/30" />
                  <span className="text-[#FF2D6D] font-semibold">{activeItem.title}</span>
                </div>

                {/* Title Header */}
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-[1.1] font-sans">
                      {activeItem.headline || activeItem.title}
                    </h1>
                    {activeItem.badge && (
                      <span className="px-2.5 py-1 text-xs font-mono font-bold uppercase tracking-wider text-[#FF85A2] bg-[#FF2D6D]/15 border border-[#FF2D6D]/30 rounded-lg">
                        {activeItem.badge}
                      </span>
                    )}
                  </div>

                  <p className="text-[#F4B5C8] text-sm sm:text-base leading-relaxed max-w-3xl">
                    {activeItem.subheadline || activeItem.summary}
                  </p>

                  {/* Informational Callout Note */}
                  {activeItem.note && (
                    <div className="my-6 p-5 rounded-2xl flex gap-4 items-start bg-[#FF2D6D]/[0.08] backdrop-blur-sm border-l-4 border-[#FF2D6D] ring-1 ring-[#FF2D6D]/20">
                      <div className="p-2 rounded-xl bg-[#1E000A] border border-[#FF2D6D]/30 flex-shrink-0 flex items-center justify-center">
                        <Info className="h-4 w-4 text-[#FF2D6D]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-xs font-mono uppercase tracking-wider text-[#FF85A2] mb-1">
                          {activeItem.note.title}
                        </h4>
                        <p className="text-xs text-[#F4B5C8] leading-relaxed m-0">{activeItem.note.text}</p>
                      </div>
                    </div>
                  )}

                  {/* Security Feature Tags */}
                  {activeItem.tags && (
                    <div className="flex flex-wrap gap-2.5 pt-2">
                      {activeItem.tags.map((tag, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#30000F] border border-[#FFB4C8]/15 text-xs font-semibold text-[#F4B5C8] shadow-sm"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#34D399]" />
                          <span>{tag}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="h-px bg-[#FFB4C8]/15 my-8" />
              </>
            )}

            {/* =========================================================================
                DYNAMIC DETAIL CONTENT RENDERERS
               ========================================================================= */}

            {/* INTEGRATION CATALOG DIRECTORY */}
            {activeItem.isCatalogLanding && (
              <div className="space-y-8 my-8">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                  {/* Category filter pills */}
                  <div className="flex flex-wrap items-center gap-2">
                    {['ALL', 'Hosting & Deployment', 'CI/CD & Source Control', 'Infrastructure & Orchestration', 'Infrastructure as Code'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setCatalogCategoryFilter(cat)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer border ${
                          catalogCategoryFilter === cat
                            ? 'bg-[#FF2D6D] text-white border-[#FF2D6D] font-bold shadow-lg shadow-[#FF2D6D]/20'
                            : 'bg-[#1E000A] text-[#A26377] hover:text-[#F4B5C8] border-[#FFB4C8]/15'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Search Input */}
                  <div className="relative min-w-[240px]">
                    <Search className="w-3.5 h-3.5 text-[#A26377] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={catalogSearchQuery}
                      onChange={(e) => setCatalogSearchQuery(e.target.value)}
                      placeholder="Search providers & capabilities..."
                      className="w-full bg-[#0D0106] border border-[#FFB4C8]/15 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-[#A26377] focus:outline-none focus:border-[#FF2D6D]/70 font-mono"
                    />
                  </div>
                </div>

                {/* Provider Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {INTEGRATIONS_CATALOG
                    .filter((provider) => {
                      if (catalogCategoryFilter !== 'ALL' && provider.category !== catalogCategoryFilter) return false;
                      if (catalogSearchQuery.trim()) {
                        const q = catalogSearchQuery.toLowerCase();
                        return (
                          provider.name.toLowerCase().includes(q) ||
                          provider.summary.toLowerCase().includes(q) ||
                          provider.adapterClass.toLowerCase().includes(q) ||
                          provider.capabilities.some((c) => c.toLowerCase().includes(q))
                        );
                      }
                      return true;
                    })
                    .map((provider) => (
                      <div
                        key={provider.id}
                        className="p-6 rounded-2xl bg-[#30000F] border border-[#FFB4C8]/15 hover:border-[#FF2D6D]/40 transition-all flex flex-col justify-between space-y-4 shadow-xl"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-[#1E000A] border border-[#FFB4C8]/15 flex items-center justify-center text-[#FF2D6D] font-mono font-bold text-sm">
                                {provider.name.substring(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <h3 className="text-base font-bold text-white m-0 font-sans">{provider.name}</h3>
                                <div className="text-[11px] font-mono text-[#A26377]">{provider.category}</div>
                              </div>
                            </div>

                            <span
                              className={`px-2.5 py-1 text-[10px] font-mono font-bold rounded-lg uppercase tracking-wider flex items-center gap-1.5 ${
                                provider.status === 'Available'
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                  : provider.status === 'Beta'
                                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                  : 'bg-white/5 text-[#A26377] border border-[#FFB4C8]/15'
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  provider.status === 'Available'
                                    ? 'bg-emerald-400 animate-pulse'
                                    : provider.status === 'Beta'
                                    ? 'bg-amber-400'
                                    : 'bg-[#A26377]'
                                }`}
                              />
                              {provider.status}
                            </span>
                          </div>

                          <p className="text-xs text-[#F4B5C8] leading-relaxed m-0">{provider.summary}</p>

                          {/* Adapter class */}
                          <div className="p-2 rounded-lg bg-[#0D0106] border border-[#FFB4C8]/10 font-mono text-[10px] text-[#FF85A2] truncate">
                            <span className="text-[#A26377]">Adapter: </span>
                            {provider.adapterClass}
                          </div>

                          {/* Capabilities checklist */}
                          <div className="space-y-1.5 pt-1">
                            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#A26377]">
                              Capabilities &amp; Endpoints
                            </div>
                            <div className="space-y-1">
                              {provider.capabilities.map((cap, cIdx) => (
                                <div key={cIdx} className="flex items-center gap-2 text-xs text-[#F4B5C8]">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-[#34D399] flex-shrink-0" />
                                  <span className="truncate">{cap}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-[#FFB4C8]/15 flex items-center justify-between">
                          <span className="text-[11px] font-mono text-[#A26377]">
                            Auth: <span className="text-[#F4B5C8]">{provider.authRequirements.split(' ')[0]}</span>
                          </span>
                          <button
                            onClick={() => handleSelectItem(provider.setupDocsId, 'integrations')}
                            className="px-3 py-1.5 rounded-lg bg-[#FF2D6D]/15 hover:bg-[#FF2D6D]/25 text-[#FF85A2] border border-[#FF2D6D]/30 text-xs font-mono font-semibold flex items-center gap-1.5 cursor-pointer transition-all"
                          >
                            <span>View Integration Guide</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* INTERACTIVE REST API EXPLORER */}
            {activeItem.isEndpointsExplorer && (
              <div className="space-y-8 my-8">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                  {/* HTTP Method filter pills */}
                  <div className="flex flex-wrap items-center gap-2">
                    {['ALL', 'GET', 'POST', 'PATCH', 'DELETE'].map((m) => (
                      <button
                        key={m}
                        onClick={() => setApiMethodFilter(m)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer border ${
                          apiMethodFilter === m
                            ? 'bg-[#FF2D6D] text-white border-[#FF2D6D] font-bold shadow-lg shadow-[#FF2D6D]/20'
                            : 'bg-[#1E000A] text-[#A26377] hover:text-[#F4B5C8] border-[#FFB4C8]/15'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>

                  {/* Search Input */}
                  <div className="relative min-w-[260px]">
                    <Search className="w-3.5 h-3.5 text-[#A26377] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={apiSearchQuery}
                      onChange={(e) => setApiSearchQuery(e.target.value)}
                      placeholder="Filter paths, methods, or DTOs..."
                      className="w-full bg-[#0D0106] border border-[#FFB4C8]/15 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-[#A26377] focus:outline-none focus:border-[#FF2D6D]/70 font-mono"
                    />
                  </div>
                </div>

                {/* Endpoints List */}
                <div className="space-y-6">
                  {REST_API_ENDPOINTS
                    .filter((ep) => {
                      if (apiMethodFilter !== 'ALL' && ep.method !== apiMethodFilter) return false;
                      if (apiSearchQuery.trim()) {
                        const q = apiSearchQuery.toLowerCase();
                        return (
                          ep.path.toLowerCase().includes(q) ||
                          ep.summary.toLowerCase().includes(q) ||
                          ep.group.toLowerCase().includes(q) ||
                          (ep.permissions && ep.permissions.toLowerCase().includes(q))
                        );
                      }
                      return true;
                    })
                    .map((ep) => {
                      const isExpanded = expandedEndpointId === ep.id;
                      return (
                        <div
                          key={ep.id}
                          className="p-6 rounded-2xl bg-[#30000F] border border-[#FFB4C8]/15 space-y-4 shadow-xl"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <span
                                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border ${
                                  ep.method === 'GET'
                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                    : ep.method === 'POST'
                                    ? 'bg-[#FF2D6D]/15 text-[#FF85A2] border border-[#FF2D6D]/30'
                                    : ep.method === 'PATCH'
                                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                }`}
                              >
                                {ep.method}
                              </span>
                              <code className="text-sm font-mono text-white font-bold">{ep.path}</code>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#1E000A] text-[#A26377] border border-[#FFB4C8]/15">
                                {ep.group}
                              </span>
                              <button
                                onClick={() => setExpandedEndpointId((prev) => (prev === ep.id ? null : ep.id))}
                                className="px-2.5 py-1 text-xs font-mono text-[#FF85A2] hover:text-white bg-[#1E000A] border border-[#FFB4C8]/15 rounded-lg cursor-pointer"
                              >
                                {isExpanded ? 'Hide Schemas' : 'View Schemas'}
                              </button>
                            </div>
                          </div>

                          <p className="text-xs text-[#F4B5C8] leading-relaxed m-0">{ep.summary}</p>

                          {/* Auth and permission requirements */}
                          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#A26377] pt-1">
                            <div>
                              <span className="text-[#A26377]">Auth: </span>
                              <span className="text-[#FF85A2]">{ep.auth}</span>
                            </div>
                            {ep.permissions && (
                              <div>
                                <span className="text-[#A26377]">Permissions: </span>
                                <span className="text-amber-300">{ep.permissions}</span>
                              </div>
                            )}
                            {ep.rateLimit && (
                              <div>
                                <span className="text-[#A26377]">Rate Limit: </span>
                                <span className="text-rose-300">{ep.rateLimit}</span>
                              </div>
                            )}
                          </div>

                          {/* Path params table if present */}
                          {ep.pathParams && (
                            <div className="space-y-1.5 pt-2">
                              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#A26377]">
                                Path Parameters
                              </div>
                              <div className="overflow-x-auto rounded-xl border border-[#FFB4C8]/15">
                                <table className="w-full text-left font-mono text-xs">
                                  <thead className="bg-[#1E000A] text-[#A26377] border-b border-[#FFB4C8]/15">
                                    <tr>
                                      <th className="py-2 px-3 text-[#F4B5C8]">Name</th>
                                      <th className="py-2 px-3 text-[#F4B5C8]">Type</th>
                                      <th className="py-2 px-3 text-[#F4B5C8]">Description</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-[#FFB4C8]/10 bg-[#0D0106]">
                                    {ep.pathParams.map((p, idx) => (
                                      <tr key={idx}>
                                        <td className="py-2 px-3 text-[#FF85A2] font-bold">{p.name}</td>
                                        <td className="py-2 px-3 text-[#A26377] text-[11px]">{p.type}</td>
                                        <td className="py-2 px-3 text-[#F4B5C8]">{p.desc}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}

                          {/* Request & Response Schemas */}
                          {isExpanded && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-3 border-t border-[#FFB4C8]/15">
                              {ep.requestSchema && (
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between text-xs font-mono text-[#A26377]">
                                    <span>Request Body Schema</span>
                                    <button
                                      onClick={() => handleCopy(ep.requestSchema, `req-${ep.id}`)}
                                      className="text-[#A26377] hover:text-white p-1 rounded bg-transparent border-none cursor-pointer"
                                    >
                                      {copiedCodeId === `req-${ep.id}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                    </button>
                                  </div>
                                  <div className="rounded-xl bg-[#0D0106] border border-[#FFB4C8]/15 p-3 font-mono text-xs text-[#FF85A2] overflow-x-auto">
                                    <pre className="m-0"><code>{ep.requestSchema}</code></pre>
                                  </div>
                                </div>
                              )}

                              {ep.responseSchema && (
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between text-xs font-mono text-[#A26377]">
                                    <span>Response Body Envelope</span>
                                    <button
                                      onClick={() => handleCopy(ep.responseSchema, `res-${ep.id}`)}
                                      className="text-[#A26377] hover:text-white p-1 rounded bg-transparent border-none cursor-pointer"
                                    >
                                      {copiedCodeId === `res-${ep.id}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                    </button>
                                  </div>
                                  <div className="rounded-xl bg-[#0D0106] border border-[#FFB4C8]/15 p-3 font-mono text-xs text-emerald-400 overflow-x-auto">
                                    <pre className="m-0"><code>{ep.responseSchema}</code></pre>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Status codes */}
                          {ep.statusCodes && (
                            <div className="flex flex-wrap items-center gap-2 pt-2">
                              {ep.statusCodes.map((sc, sIdx) => (
                                <span
                                  key={sIdx}
                                  className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#1E000A] text-[#F4B5C8] border border-[#FFB4C8]/15"
                                >
                                  <strong className={sc.code < 300 ? 'text-emerald-400' : sc.code < 400 ? 'text-[#FF85A2]' : 'text-amber-400'}>
                                    {sc.code}
                                  </strong>{' '}
                                  - {sc.desc}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* CLIENT SDK MULTI-LANGUAGE SWITCHER */}
            {activeItem.isSdkLanding && (
              <div className="space-y-8 my-8">
                {/* Language Tabs */}
                <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-xl bg-[#1E000A] border border-[#FFB4C8]/15 w-fit">
                  {CLIENT_SDKS_CATALOG.map((sdk) => (
                    <button
                      key={sdk.id}
                      onClick={() => setActiveSdkLanguage(sdk.id)}
                      className={`px-3.5 py-2 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer border-none ${
                        activeSdkLanguage === sdk.id
                          ? 'bg-[#FF2D6D] text-white font-bold shadow-lg shadow-[#FF2D6D]/20'
                          : 'text-[#A26377] hover:text-[#F4B5C8] bg-transparent'
                      }`}
                    >
                      {sdk.name}
                    </button>
                  ))}
                </div>

                {/* Active SDK Details */}
                {(() => {
                  const currentSdk = CLIENT_SDKS_CATALOG.find((s) => s.id === activeSdkLanguage) || CLIENT_SDKS_CATALOG[0];
                  return (
                    <div className="p-6 rounded-2xl bg-[#30000F] border border-[#FFB4C8]/15 space-y-6 shadow-xl">
                      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#FFB4C8]/15">
                        <div>
                          <h3 className="text-xl font-bold text-white m-0 font-sans">{currentSdk.name}</h3>
                          <div className="text-xs font-mono text-[#FF85A2] mt-1">{currentSdk.artifact}</div>
                        </div>
                        <div className="text-xs font-mono text-[#A26377] px-3 py-1.5 rounded-lg bg-[#1E000A] border border-[#FFB4C8]/15">
                          Repository: <code className="text-[#F4B5C8]">{currentSdk.repoPath}</code>
                        </div>
                      </div>

                      {/* Features */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#FF85A2]">
                          Engineered Features
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {currentSdk.features.map((feat, fIdx) => (
                            <div key={fIdx} className="flex items-center gap-2 text-xs text-[#F4B5C8]">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#34D399] flex-shrink-0" />
                              <span>{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Quickstart code block */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs font-mono text-[#A26377]">
                          <span>Production Quickstart</span>
                          <button
                            onClick={() => handleCopy(currentSdk.quickstart, `sdk-qs-${currentSdk.id}`)}
                            className="text-[#A26377] hover:text-white p-1 rounded bg-transparent border-none cursor-pointer flex items-center gap-1.5"
                          >
                            {copiedCodeId === `sdk-qs-${currentSdk.id}` ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-emerald-400">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy Code</span>
                              </>
                            )}
                          </button>
                        </div>
                        <div className="rounded-xl bg-[#0D0106] border border-[#FFB4C8]/15 p-5 font-mono text-xs sm:text-sm text-[#FF85A2] overflow-x-auto leading-relaxed shadow-inner">
                          <pre className="m-0"><code>{currentSdk.quickstart}</code></pre>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* 1. STEPPED QUICKSTART */}
            {activeItem.steps && (
              <div className="space-y-10">
                {activeItem.steps.map((st, idx) => (
                  <section key={idx} className="space-y-4">
                    <div className="flex items-center gap-3.5">
                      <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-[#FF2D6D] to-[#990033] text-white flex items-center justify-center text-xs font-mono font-black shadow-md shadow-[#FF2D6D]/25 flex-shrink-0">
                        {st.number}
                      </div>
                      <h2 className="text-lg font-black text-white tracking-tight font-sans">{st.title}</h2>
                    </div>

                    <p className="text-sm text-[#F4B5C8] leading-relaxed max-w-2xl pl-11">{st.desc}</p>

                    {/* Interactive Package Switcher Terminal */}
                    {st.packageManagers && (
                      <div className="pl-11">
                        <div className="group relative overflow-hidden rounded-2xl bg-[#0D0106] border border-[#FFB4C8]/15 shadow-2xl transition-all duration-300 hover:border-[#FF2D6D]/30">
                          <div className="flex items-center justify-between px-5 py-3.5 bg-[#1E000A] border-b border-[#FFB4C8]/15">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1.5">
                                <span className="w-3 h-3 rounded-full bg-rose-500/40 border border-rose-500/60" />
                                <span className="w-3 h-3 rounded-full bg-amber-500/40 border border-amber-500/60" />
                                <span className="w-3 h-3 rounded-full bg-emerald-500/40 border border-emerald-500/60" />
                              </div>
                              <div className="flex items-center gap-2 text-[#A26377] text-xs font-mono font-medium">
                                <span className="text-[#FF2D6D] font-bold">&gt;_</span>
                                <span>Terminal</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1 bg-[#0D0106] p-1 rounded-lg border border-[#FFB4C8]/15">
                                {Object.keys(st.packageManagers).map((pkg) => (
                                  <button
                                    key={pkg}
                                    onClick={() => setSelectedPkgManager(pkg)}
                                    className={`px-2.5 py-1 text-[10px] font-mono font-semibold transition-all rounded-md cursor-pointer border-none uppercase ${
                                      selectedPkgManager === pkg
                                        ? 'bg-[#FF2D6D] text-white font-bold shadow-sm'
                                        : 'text-[#A26377] hover:text-[#F4B5C8] bg-transparent'
                                    }`}
                                  >
                                    {pkg}
                                  </button>
                                ))}
                              </div>

                              <button
                                onClick={() =>
                                  handleCopy(
                                    st.packageManagers[selectedPkgManager] || Object.values(st.packageManagers)[0],
                                    `pkg-${idx}`
                                  )
                                }
                                className="text-[#A26377] hover:text-white transition-colors p-2 rounded-lg bg-transparent border-none cursor-pointer"
                                title="Copy code"
                              >
                                {copiedCodeId === `pkg-${idx}` ? (
                                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                                ) : (
                                  <Copy className="h-3.5 w-3.5" />
                                )}
                              </button>
                            </div>
                          </div>

                          <div className="p-5 font-mono text-xs text-[#FF85A2] leading-relaxed overflow-x-auto bg-[#0D0106]">
                            <pre className="m-0">
                              <code>
                                {st.packageManagers[selectedPkgManager] || Object.values(st.packageManagers)[0]}
                              </code>
                            </pre>
                          </div>
                        </div>

                        {st.verifyCmd && (
                          <div className="mt-3 space-y-1.5">
                            <div className="text-[10px] font-mono uppercase text-[#A26377]">Verify installation:</div>
                            <div className="rounded-xl bg-[#1E000A] border border-[#FFB4C8]/15 p-3 font-mono text-xs text-[#F4B5C8]">
                              <span className="text-[#FF2D6D] font-bold mr-2">$</span>
                              <span>{st.verifyCmd}</span>
                              <div className="text-[#A26377] text-[11px] mt-1 pl-4 whitespace-pre-line">
                                {st.verifyOutput}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {st.code && (
                      <div className="pl-11">
                        <div className="relative rounded-2xl bg-[#0D0106] border border-[#FFB4C8]/15 p-5 font-mono text-xs text-[#F4B5C8] overflow-x-auto leading-relaxed shadow-xl">
                          <button
                            onClick={() => handleCopy(st.code, `st-${idx}`)}
                            className="absolute top-4 right-4 text-[#A26377] hover:text-white transition-colors bg-transparent border-none cursor-pointer"
                          >
                            {copiedCodeId === `st-${idx}` ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <pre className="m-0">
                            <code>{st.code}</code>
                          </pre>
                        </div>
                      </div>
                    )}
                  </section>
                ))}
              </div>
            )}

            {/* 2. ARCHITECTURE DIAGRAM & PILLARS */}
            {activeItem.diagram && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-base font-bold text-white mb-3 font-sans">
                    Zero-Trust Cryptographic Pipeline
                  </h3>
                  <div className="rounded-2xl bg-[#0D0106] border border-[#FFB4C8]/15 p-6 font-mono text-xs text-[#FF85A2] overflow-x-auto leading-normal shadow-2xl">
                    <pre className="m-0">
                      <code>{activeItem.diagram}</code>
                    </pre>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {activeItem.pillars?.map((pil, idx) => (
                    <div key={idx} className="p-5 rounded-2xl bg-[#30000F] border border-[#FFB4C8]/15 space-y-2">
                      <h4 className="text-sm font-bold text-white font-sans">{pil.title}</h4>
                      <p className="text-xs text-[#F4B5C8] leading-relaxed">{pil.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. CLI COMMAND DETAILS */}
            {activeItem.syntax && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-mono font-bold uppercase text-[#A26377] mb-2">Command Syntax</h3>
                  <div className="rounded-xl bg-[#0D0106] border border-[#FFB4C8]/15 p-4 font-mono text-xs text-[#FF2D6D] font-bold flex items-center justify-between">
                    <code>{activeItem.syntax}</code>
                    <button
                      onClick={() => handleCopy(activeItem.syntax, 'syntax')}
                      className="text-[#A26377] hover:text-white transition-colors bg-transparent border-none cursor-pointer"
                    >
                      {copiedCodeId === 'syntax' ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {activeItem.options && (
                  <div>
                    <h3 className="text-xs font-mono font-bold uppercase text-[#A26377] mb-2">Options &amp; Flags</h3>
                    <div className="divide-y divide-[#FFB4C8]/10 border border-[#FFB4C8]/15 rounded-xl overflow-hidden bg-[#1E000A]">
                      {activeItem.options.map((opt, oIdx) => (
                        <div key={oIdx} className="p-3 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <code className="text-amber-400 font-mono">{opt.flag}</code>
                          <span className="text-[#F4B5C8]">{opt.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeItem.examples && (
                  <div>
                    <h3 className="text-xs font-mono font-bold uppercase text-[#A26377] mb-2">Practical Examples</h3>
                    <div className="space-y-2">
                      {activeItem.examples.map((ex, eIdx) => (
                        <div
                          key={eIdx}
                          className="rounded-xl bg-[#0D0106] border border-[#FFB4C8]/15 p-3 font-mono text-xs text-[#34D399] flex items-center justify-between"
                        >
                          <code>$ {ex}</code>
                          <button
                            onClick={() => handleCopy(ex, `ex-${eIdx}`)}
                            className="text-[#A26377] hover:text-white transition-colors bg-transparent border-none cursor-pointer"
                          >
                            {copiedCodeId === `ex-${eIdx}` ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 4. CRUD COMMANDS TABLE */}
            {activeItem.commands && (
              <div className="space-y-4">
                {activeItem.commands.map((cmd, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-[#30000F] border border-[#FFB4C8]/15 space-y-2 shadow-lg">
                    <div className="font-mono text-xs font-bold text-[#FF85A2] bg-[#FF2D6D]/15 px-3 py-1 rounded-lg border border-[#FF2D6D]/30 w-fit">
                      {cmd.cmd}
                    </div>
                    <p className="text-xs text-[#F4B5C8]">{cmd.desc}</p>
                    <div className="rounded-xl bg-[#0D0106] border border-[#FFB4C8]/15 p-2.5 font-mono text-xs text-[#34D399] flex items-center justify-between">
                      <code>$ {cmd.example}</code>
                      <button
                        onClick={() => handleCopy(cmd.example, `cmd-${idx}`)}
                        className="text-[#A26377] hover:text-white transition-colors bg-transparent border-none cursor-pointer"
                      >
                        {copiedCodeId === `cmd-${idx}` ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 5. CLIENT SDK IMPLEMENTATION CODE */}
            {activeItem.code && (
              <div className="space-y-6">
                {activeItem.install && (
                  <div>
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#A26377] mb-2">
                      Package Installation
                    </h3>
                    <div className="rounded-xl bg-[#0D0106] border border-[#FFB4C8]/15 p-4 font-mono text-xs text-[#FF85A2] flex items-center justify-between">
                      <code>{Object.values(activeItem.install)[0]}</code>
                      <button
                        onClick={() => handleCopy(Object.values(activeItem.install)[0], 'inst')}
                        className="text-[#A26377] hover:text-white transition-colors bg-transparent border-none cursor-pointer"
                      >
                        {copiedCodeId === 'inst' ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#A26377] mb-2">
                    Client Implementation
                  </h3>
                  <div className="relative rounded-2xl bg-[#0D0106] border border-[#FFB4C8]/15 p-6 font-mono text-xs sm:text-sm text-[#F4B5C8] overflow-x-auto leading-relaxed shadow-2xl">
                    <button
                      onClick={() => handleCopy(activeItem.code, 'sdk-code')}
                      className="absolute top-4 right-4 text-[#A26377] hover:text-white transition-colors bg-transparent border-none cursor-pointer"
                    >
                      {copiedCodeId === 'sdk-code' ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                    <pre className="m-0">
                      <code>{activeItem.code}</code>
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {/* 6. K8S CRD MANIFEST */}
            {activeItem.crdYaml && (
              <div className="space-y-6">
                <div className="relative rounded-2xl bg-[#0D0106] border border-[#FFB4C8]/15 p-6 font-mono text-xs sm:text-sm text-[#34D399] overflow-x-auto leading-relaxed shadow-2xl">
                  <button
                    onClick={() => handleCopy(activeItem.crdYaml, 'crd-yaml')}
                    className="absolute top-4 right-4 text-[#A26377] hover:text-white transition-colors bg-transparent border-none cursor-pointer"
                  >
                    {copiedCodeId === 'crd-yaml' ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                  <pre className="m-0">
                    <code>{activeItem.crdYaml}</code>
                  </pre>
                </div>

                {activeItem.helm && (
                  <div>
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#A26377] mb-2">
                      Helm Installation
                    </h3>
                    <div className="rounded-xl bg-[#0D0106] border border-[#FFB4C8]/15 p-4 font-mono text-xs text-[#F4B5C8] overflow-x-auto">
                      <pre className="m-0">
                        <code>{activeItem.helm}</code>
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 7. TERRAFORM HCL */}
            {activeItem.tfSnippet && (
              <div className="relative rounded-2xl bg-[#0D0106] border border-[#FFB4C8]/15 p-6 font-mono text-xs sm:text-sm text-amber-300 overflow-x-auto leading-relaxed shadow-2xl">
                <button
                  onClick={() => handleCopy(activeItem.tfSnippet, 'tf-snip')}
                  className="absolute top-4 right-4 text-[#A26377] hover:text-white transition-colors bg-transparent border-none cursor-pointer"
                >
                  {copiedCodeId === 'tf-snip' ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
                <pre className="m-0">
                  <code>{activeItem.tfSnippet}</code>
                </pre>
              </div>
            )}

            {/* 8. GITHUB ACTIONS YAML */}
            {activeItem.ghaYaml && (
              <div className="relative rounded-2xl bg-[#0D0106] border border-[#FFB4C8]/15 p-6 font-mono text-xs sm:text-sm text-[#FF85A2] overflow-x-auto leading-relaxed shadow-2xl">
                <button
                  onClick={() => handleCopy(activeItem.ghaYaml, 'gha-snip')}
                  className="absolute top-4 right-4 text-[#A26377] hover:text-white transition-colors bg-transparent border-none cursor-pointer"
                >
                  {copiedCodeId === 'gha-snip' ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
                <pre className="m-0">
                  <code>{activeItem.ghaYaml}</code>
                </pre>
              </div>
            )}

            {/* TABULAR PERMISSIONS / CAPABILITY MATRIX */}
            {activeItem.tableHeaders && activeItem.tableRows && (
              <div className="overflow-x-auto rounded-2xl border border-[#FFB4C8]/15 bg-[#30000F] shadow-xl my-6">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#FFB4C8]/15 bg-[#1E000A] text-[11px] font-mono uppercase tracking-wider text-[#A26377]">
                      {activeItem.tableHeaders.map((th, hIdx) => (
                        <th key={hIdx} className={`py-3.5 px-4 ${hIdx > 0 ? 'text-center' : ''}`}>
                          {th}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#FFB4C8]/10 font-sans">
                    {activeItem.tableRows.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-white/[0.02] transition-colors">
                        {row.map((cell, cIdx) => (
                          <td
                            key={cIdx}
                            className={`py-3 px-4 ${
                              cIdx === 0
                                ? 'font-medium text-[#F4B5C8] font-sans'
                                : 'text-center font-mono text-[#FF85A2]'
                            }`}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* 9. CLOUD KMS PLATFORMS */}
            {activeItem.platforms && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {activeItem.platforms.map((p, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-[#30000F] border border-[#FFB4C8]/15 space-y-2 shadow-lg">
                    <h4 className="text-sm font-bold text-white font-sans">{p.name}</h4>
                    <p className="text-xs text-[#F4B5C8] leading-relaxed">{p.desc}</p>
                  </div>
                ))}
              </div>
            )}

            {/* 10. RBAC ROLES TABLE */}
            {activeItem.roles && (
              <div className="divide-y divide-[#FFB4C8]/10 border border-[#FFB4C8]/15 rounded-2xl overflow-hidden bg-[#30000F] shadow-xl">
                {activeItem.roles.map((r, idx) => (
                  <div key={idx} className="p-4 flex items-start gap-4">
                    <span className="w-24 font-mono font-bold text-xs text-[#FF85A2] uppercase">{r.name}</span>
                    <span className="text-xs text-[#F4B5C8] leading-relaxed flex-1">{r.desc}</span>
                  </div>
                ))}
              </div>
            )}

            {/* 11. WORKFLOW / STEPS */}
            {activeItem.workflow && (
              <div className="space-y-4">
                {activeItem.workflow.map((item, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-[#30000F] border border-[#FFB4C8]/15 flex items-start gap-4 shadow-lg">
                    <span className="w-8 h-8 rounded-xl bg-[#FF2D6D]/15 border border-[#FF2D6D]/30 text-[#FF85A2] font-mono font-bold flex items-center justify-center text-xs flex-shrink-0">
                      {idx + 1}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-white mb-1">{item.step}</h4>
                      <p className="text-xs text-[#F4B5C8] leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 12. AI COPILOT CAPABILITIES */}
            {activeItem.capabilities && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {activeItem.capabilities.map((c, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-[#30000F] border border-[#FFB4C8]/15 space-y-2 shadow-lg">
                    <div className="w-8 h-8 rounded-lg bg-[#FF2D6D]/15 border border-[#FF2D6D]/30 flex items-center justify-center text-[#FF2D6D] mb-2">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <h4 className="text-sm font-bold text-white">{c.title}</h4>
                    <p className="text-xs text-[#F4B5C8] leading-relaxed">{c.desc}</p>
                  </div>
                ))}
              </div>
            )}

            {/* 13. REST API ENDPOINTS */}
            {activeItem.endpoints && (
              <div className="space-y-6">
                <div className="space-y-3">
                  {activeItem.endpoints.map((ep, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-[#30000F] border border-[#FFB4C8]/15 space-y-2 shadow-lg">
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            ep.method === 'GET'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-[#FF2D6D]/15 text-[#FF85A2] border border-[#FF2D6D]/30'
                          }`}
                        >
                          {ep.method}
                        </span>
                        <code className="text-xs font-mono text-white font-semibold">{ep.path}</code>
                      </div>
                      <p className="text-xs text-[#F4B5C8] pl-1">{ep.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* =========================================================================
                PREVIOUS / NEXT TOPIC PAGER CARDS
               ========================================================================= */}
            <div className="mt-20 pt-8 border-t border-[#FFB4C8]/15 flex items-center justify-between gap-4">
              {prevItem ? (
                <button
                  onClick={() => handleSelectItem(prevItem.id, prevItem.parentGroupId)}
                  className="flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-[#30000F] border border-[#FFB4C8]/15 hover:border-[#FF2D6D]/40 text-xs font-mono text-[#F4B5C8] hover:text-white transition-all cursor-pointer text-left shadow-lg"
                >
                  <ArrowLeft className="w-4 h-4 text-[#FF2D6D]" />
                  <div>
                    <div className="text-[10px] text-[#A26377] uppercase tracking-wider">Previous</div>
                    <div className="font-bold text-white text-xs">{prevItem.title}</div>
                  </div>
                </button>
              ) : (
                <div />
              )}

              {nextItem && (
                <button
                  onClick={() => handleSelectItem(nextItem.id, nextItem.parentGroupId)}
                  className="flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-[#30000F] border border-[#FFB4C8]/15 hover:border-[#FF2D6D]/40 text-xs font-mono text-[#F4B5C8] hover:text-white transition-all cursor-pointer text-right ml-auto shadow-lg"
                >
                  <div>
                    <div className="text-[10px] text-[#A26377] uppercase tracking-wider">Next</div>
                    <div className="font-bold text-white text-xs">{nextItem.title}</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#FF2D6D]" />
                </button>
              )}
            </div>
          </div>
        </main>

        {/* =========================================================================
            RIGHT ON-THIS-PAGE TABLE OF CONTENTS (DESKTOP)
           ========================================================================= */}
        <aside className="hidden xl:block w-64 fixed right-0 top-0 bottom-0 py-16 px-6 overflow-y-auto border-l border-[#FFB4C8]/15 bg-[#1E000A]/50">
          <div className="space-y-4">
            <h4 className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#A26377]">
              Active Category
            </h4>
            <div className="text-xs font-mono text-[#FF2D6D] font-bold">{activeGroup.title}</div>

            <div className="space-y-1.5 pt-2 border-t border-[#FFB4C8]/15 text-xs font-mono">
              <div className="text-[10px] uppercase text-[#A26377] tracking-wider mb-2">Category Sections:</div>
              {activeGroup.id === 'cli' ? (
                <>
                  <button
                    onClick={() => handleSelectItem('cli-overview', 'cli')}
                    className={`block w-full text-left truncate py-1 border-none cursor-pointer bg-transparent ${
                      activeItem.id === 'cli-overview' ? 'text-[#FF2D6D] font-bold' : 'text-[#A26377] hover:text-[#F4B5C8]'
                    }`}
                  >
                    • Overview & Installation
                  </button>
                  <div className="text-[9px] uppercase text-[#A26377]/80 tracking-wider pt-2 mb-1">Subsystems (101 Cmds):</div>
                  {CLI_COMMAND_GROUPS.map((cg) => {
                    const isCurrentCg = activeItem.cliGroupId === cg.groupId;
                    return (
                      <button
                        key={cg.groupId}
                        onClick={() => {
                          setCliSubGroupId(cg.groupId);
                          handleSelectItem(cg.commands[0].id, 'cli');
                        }}
                        className={`block w-full text-left truncate py-1 border-none cursor-pointer bg-transparent text-[11px] ${
                          isCurrentCg ? 'text-[#FF2D6D] font-bold' : 'text-[#A26377] hover:text-[#F4B5C8]'
                        }`}
                      >
                        • {cg.groupTitle} ({cg.commands.length})
                      </button>
                    );
                  })}
                </>
              ) : (
                activeGroup.items.map((it) => (
                  <button
                    key={it.id}
                    onClick={() => handleSelectItem(it.id, activeGroup.id)}
                    className={`block w-full text-left truncate py-1 border-none cursor-pointer bg-transparent ${
                      it.id === activeItem.id ? 'text-[#FF2D6D] font-bold' : 'text-[#A26377] hover:text-[#F4B5C8]'
                    }`}
                  >
                    • {it.title}
                  </button>
                ))
              )}
            </div>

            <div className="pt-6 border-t border-[#FFB4C8]/15">
              <div className="p-4 rounded-xl bg-[#30000F] border border-[#FFB4C8]/15 space-y-2 shadow-xl">
                <div className="text-xs font-bold text-white flex items-center gap-1.5 font-sans">
                  <Shield className="w-3.5 h-3.5 text-[#FF2D6D]" />
                  <span>Enterprise Support</span>
                </div>
                <p className="text-[11px] text-[#F4B5C8] leading-relaxed m-0">
                  Assistance with Kubernetes CRD migrations, custom KMS drivers, and tamper-evident audit logging.
                </p>
                <button
                  onClick={() => navigate('/register')}
                  className="w-full py-2 rounded-lg bg-[#FF2D6D] text-white font-mono font-bold text-[10px] uppercase tracking-wider cursor-pointer border-none hover:bg-[#FF4D85] transition-colors mt-1 shadow-lg shadow-[#FF2D6D]/20"
                >
                  Start Free Trial →
                </button>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
