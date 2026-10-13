import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { DocsPage } from '../components/docs/DocsPage';
import {
  CLI_COMMAND_GROUPS,
  CLI_GLOBAL_FLAGS,
  CLI_EXIT_CODES,
  findCliCommandById,
  searchCliCommands
} from '../components/docs/cliReferenceData';
import { DOCS_GROUPS, findDocItemById } from '../components/docs/docsData';

// Mock router utility completely
vi.mock('../utils/router', () => ({
  navigate: vi.fn(),
  getQueryParam: vi.fn((key) => null),
  useRouter: () => ({
    currentPath: '/docs',
    navigate: vi.fn(),
    isDocs: true,
    isLanding: false
  })
}));

describe('SecretVault Verified CLI Data Model Audit', () => {
  it('contains exactly 14 verified command subsystems', () => {
    expect(CLI_COMMAND_GROUPS).toHaveLength(14);
  });

  it('contains exactly 101 implemented and verified CLI commands and subcommands', () => {
    const totalCommands = CLI_COMMAND_GROUPS.reduce((acc, g) => acc + g.commands.length, 0);
    expect(totalCommands).toBe(101);

    // Verify all commands are classified as 'Implemented and verified'
    CLI_COMMAND_GROUPS.forEach((group) => {
      group.commands.forEach((cmd) => {
        expect(cmd.verificationStatus).toBe('Implemented and verified');
        expect(cmd.syntax).toBeTruthy();
        expect(cmd.name).toMatch(/^secretvault/);
        expect(Array.isArray(cmd.options)).toBe(true);
        expect(Array.isArray(cmd.arguments)).toBe(true);
      });
    });
  });

  it('contains all 10 documented Picocli global flags in CLI_GLOBAL_FLAGS', () => {
    expect(CLI_GLOBAL_FLAGS).toHaveLength(10);
    const flags = CLI_GLOBAL_FLAGS.map((f) => f.flag);
    expect(flags).toContain('-s, --server <url>');
    expect(flags).toContain('-p, --profile <name>');
    expect(flags).toContain('-w, --workspace <id>');
    expect(flags).toContain('--project <id>');
    expect(flags).toContain('-e, --env, --environment <slug>');
    expect(flags).toContain('--json');
    expect(flags).toContain('-q, --quiet');
    expect(flags).toContain('--no-color');
    expect(flags).toContain('-h, --help');
    expect(flags).toContain('-V, --version');
  });

  it('contains all 7 verified exit codes in CLI_EXIT_CODES', () => {
    expect(CLI_EXIT_CODES).toHaveLength(7);
    const codes = CLI_EXIT_CODES.map((c) => c.code);
    expect(codes).toEqual([0, 1, 2, 3, 4, 5, 130]);
  });

  it('correctly searches commands with searchCliCommands', () => {
    const loginMatches = searchCliCommands('login');
    expect(loginMatches.some((r) => r.command.id === 'cli-auth-login')).toBe(true);

    const scanMatches = searchCliCommands('scan');
    expect(scanMatches.some((r) => r.command.id === 'cli-scan')).toBe(true);

    const flagMatches = searchCliCommands('--sarif');
    expect(flagMatches.some((r) => r.command.id === 'cli-scan')).toBe(true);
  });

  it('integrates all 101 CLI commands into Category 5 of DOCS_GROUPS', () => {
    const cliGroup = DOCS_GROUPS.find((g) => g.id === 'cli');
    expect(cliGroup).toBeDefined();
    // 101 commands total
    expect(cliGroup.items).toHaveLength(101);
  });
});

describe('SecretVault CLI Documentation UI & Interactive Reference', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders CLI Overview landing page with real installation tabs, global flags, and exit codes', () => {
    render(<DocsPage isAuthenticated={false} />);

    // Open CLI Reference category
    const cliCategoryButton = screen.getByRole('button', { name: /CLI Reference/i });
    fireEvent.click(cliCategoryButton);

    const nav = screen.getByRole('navigation');
    const overviewButton = within(nav).getByText('CLI Overview & Installation');
    fireEvent.click(overviewButton);

    // Hero title and verified stats
    expect(screen.getByText('SecretVault CLI Reference')).toBeInTheDocument();
    expect(screen.getByText('@secretvault/cli')).toBeInTheDocument();
    expect(screen.getByText('101')).toBeInTheDocument();
    expect(screen.getByText('Verified Commands')).toBeInTheDocument();

    // Section 1: Installation & Packaging
    expect(screen.getByText(/1\. Installation & Distribution/i)).toBeInTheDocument();
    expect(screen.getByText(/npm install -g @secretvault\/cli/i)).toBeInTheDocument();

    // Switch install tab to Maven source build
    const mavenTab = screen.getByRole('button', { name: /Local Source Build \(Maven\)/i });
    fireEvent.click(mavenTab);
    expect(screen.getByText(/mvn clean package -DskipTests/i)).toBeInTheDocument();

    // Section 2: Executable Binary & Config Storage
    expect(screen.getByText(/2\. Executable & Configuration Storage/i)).toBeInTheDocument();
    expect(screen.getAllByText('secretvault').length).toBeGreaterThan(0);
    expect(screen.getAllByText('sv').length).toBeGreaterThan(0);

    // Config file paths
    expect(screen.getByText(/~\/\.secretvault\/config\.json/i)).toBeInTheDocument();
    expect(screen.getByText(/~\/\.secretvault\/credentials\.json/i)).toBeInTheDocument();

    // Section 3: Supported Environment Variables
    expect(screen.getByText(/3\. Supported Environment Variables/i)).toBeInTheDocument();
    expect(screen.getByText('SECRETVAULT_SERVER')).toBeInTheDocument();

    // Section 4: Global CLI Options
    expect(screen.getByText(/4\. Global Flags Reference/i)).toBeInTheDocument();
    expect(screen.getByText('-s, --server <url>')).toBeInTheDocument();
    expect(screen.getByText('--json')).toBeInTheDocument();

    // Section 5: Exit Codes Reference
    expect(screen.getByText(/5\. Exit Codes Reference/i)).toBeInTheDocument();
    expect(screen.getByText('SCANNER_INTERNAL_ERROR')).toBeInTheDocument();
    expect(screen.getByText('AUTH_FORBIDDEN')).toBeInTheDocument();

    // Section 6: Searchable Interactive Command Catalog
    expect(screen.getByText(/6\. Searchable Command Catalog/i)).toBeInTheDocument();
    const catalogInput = screen.getByPlaceholderText(/Filter commands or flags/i);
    expect(catalogInput).toBeInTheDocument();

    // Filter catalog for 'rotation'
    fireEvent.change(catalogInput, { target: { value: 'rotation' } });
    expect(screen.getAllByText(/secretvault rotation start/i).length).toBeGreaterThan(0);
  }, 25000);

  it('renders concise command reference page without tutorial prose', () => {
    render(<DocsPage isAuthenticated={false} />);

    // Open CLI Reference category
    const cliCategoryButton = screen.getByRole('button', { name: /CLI Reference/i });
    fireEvent.click(cliCategoryButton);

    const nav = screen.getByRole('navigation');

    // Expand 'Secret Management & Versioning' subsystem
    const secretSubsystemButton = within(nav).getByText(/Secret Management & Versioning/i);
    fireEvent.click(secretSubsystemButton);

    // Select 'secret set'
    const secretSetButton = within(nav).getByText('secret set');
    fireEvent.click(secretSetButton);

    // Assert strictly concise reference format
    expect(screen.getByRole('heading', { level: 1, name: 'secretvault secret set' })).toBeInTheDocument();
    expect(screen.getByText('Implemented and verified')).toBeInTheDocument();

    // Syntax
    expect(screen.getByText('Syntax')).toBeInTheDocument();
    expect(screen.getAllByText('secretvault secret set <name> [options]').length).toBeGreaterThan(0);

    // Arguments Table
    expect(screen.getByText('Arguments')).toBeInTheDocument();
    expect(screen.getByText('<name>')).toBeInTheDocument();

    // Options Table
    expect(screen.getAllByText('Options & Flags').length).toBeGreaterThan(0);
    expect(screen.getAllByText('--from-file <path>').length).toBeGreaterThan(0);
    expect(screen.getAllByText('--stdin').length).toBeGreaterThan(0);

    // Required Permissions
    expect(screen.getByText('Required Permissions')).toBeInTheDocument();
    expect(screen.getByText('Write permission on target environment')).toBeInTheDocument();

    // Example Invocation
    expect(screen.getByText('Example Invocation')).toBeInTheDocument();
    expect(screen.getByText(/echo "super-secure-token" \| secretvault secret set API_BEARER_TOKEN --stdin/i)).toBeInTheDocument();

    // Related Commands
    expect(screen.getByText('Related Commands')).toBeInTheDocument();
    expect(screen.getAllByText('secretvault secret create').length).toBeGreaterThan(0);
  });
});
