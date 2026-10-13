import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { DocsPage } from '../components/docs/DocsPage';
import { FeaturesPage } from '../components/public/FeaturesPage';
import { IntegrationsPage } from '../components/public/IntegrationsPage';
import { ArchitecturePage } from '../components/public/ArchitecturePage';
import { SecurityPage } from '../components/public/SecurityPage';
import { AboutPage } from '../components/public/AboutPage';
import { ChangelogPage } from '../components/public/ChangelogPage';
import { FaqPage } from '../components/public/FaqPage';
import { LandingPage } from '../components/landing/LandingPage';
import { DOCS_GROUPS } from '../components/docs/docsData';

// Mock router utility completely
vi.mock('../utils/router', () => ({
  navigate: vi.fn(),
  getQueryParam: vi.fn((key) => null),
  useRouter: () => ({
    currentPath: '/',
    navigate: vi.fn(),
    isDocs: false,
    isLanding: true,
    isFeatures: false,
    isIntegrations: false,
    isArchitecture: false,
    isSecurity: false,
    isAbout: false,
    isChangelog: false,
    isFaq: false,
  })
}));

describe('Public Marketing & System Pages', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders LandingPage with core value proposition and navigation', () => {
    render(<LandingPage isAuthenticated={false} />);
    expect(screen.getAllByText(/Zero-Trust Secrets/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/AES-256-GCM/i).length).toBeGreaterThan(0);
  });

  it('renders FeaturesPage with search and category filters', () => {
    render(<FeaturesPage isAuthenticated={false} />);
    expect(screen.getByText(/Complete Platform Capabilities/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Search features/i)).toBeInTheDocument();
    expect(screen.getByText('Zero-Disk Secrets Management')).toBeInTheDocument();
  });

  it('renders IntegrationsPage with provider cards and status filters', () => {
    render(<IntegrationsPage isAuthenticated={false} />);
    expect(screen.getByText(/Multi-Cloud Ecosystem/i)).toBeInTheDocument();
    expect(screen.getByText('Vercel')).toBeInTheDocument();
    expect(screen.getByText('Render')).toBeInTheDocument();
  });

  it('renders ArchitecturePage with cryptographic and outbox diagrams', () => {
    render(<ArchitecturePage isAuthenticated={false} />);
    expect(screen.getByText(/System Architecture & Data Flows/i)).toBeInTheDocument();
    expect(screen.getByText(/1\. High-Level System Architecture/i)).toBeInTheDocument();
  });

  it('renders SecurityPage with honest threat model and safeguards', () => {
    render(<SecurityPage isAuthenticated={false} />);
    expect(screen.getByText(/Security Model & Trust Center/i)).toBeInTheDocument();
    expect(screen.getByText(/Cryptographic Envelope Encryption/i)).toBeInTheDocument();
    expect(screen.getByText(/Zero Plaintext Disk Footprint/i)).toBeInTheDocument();
  });

  it('renders AboutPage with engineering principles', () => {
    render(<AboutPage isAuthenticated={false} />);
    expect(screen.getByText(/About SecretVault/i)).toBeInTheDocument();
    expect(screen.getByText(/The Problem: Secrets Sprawl & Insecure \.env Workflows/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Zero-trust secrets fabric/i).length).toBeGreaterThan(0);
  });

  it('renders ChangelogPage with grounded version timeline', () => {
    render(<ChangelogPage isAuthenticated={false} />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Changelog/i);
    expect(screen.getAllByText(/v2.4.0/i).length).toBeGreaterThan(0);
  });

  it('renders FaqPage and enforces single-open accordion behavior', () => {
    render(<FaqPage isAuthenticated={false} />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Frequently Asked/i);

    const q0 = screen.getByText('What is SecretVault and how is it different from .env files?');
    const q1 = screen.getByText('How does the AES-256-GCM envelope encryption work?');

    // Initial state: question 0 answer is open and visible
    expect(screen.getByText(/Unlike plain text \.env files/i)).toBeInTheDocument();
    // Question 1 answer should not be visible yet
    expect(screen.queryByText(/Galois authentication tag/i)).not.toBeInTheDocument();

    // Click question 1: should open question 1 and close question 0 (single open accordion)
    fireEvent.click(q1);
    expect(screen.getByText(/Galois authentication tag/i)).toBeInTheDocument();
    expect(screen.queryByText(/Unlike plain text \.env files/i)).not.toBeInTheDocument();

    // Click question 1 again: should collapse question 1
    fireEvent.click(q1);
    expect(screen.queryByText(/Galois authentication tag/i)).not.toBeInTheDocument();
  });
});

describe('Documentation Portal & Accordion Single-Open Invariant', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('verifies all 10 documented categories exist in DOCS_GROUPS', () => {
    expect(DOCS_GROUPS).toHaveLength(10);
    const groupIds = DOCS_GROUPS.map(g => g.id);
    expect(groupIds).toEqual([
      'getting-started',
      'workspace-management',
      'development-workflow',
      'ci-cd',
      'cli',
      'vscode',
      'security',
      'integrations',
      'sdks',
      'tutorials'
    ]);
  });

  it('renders DocsPage and enforces strictly only ONE dropdown category is open at a time', () => {
    render(<DocsPage isAuthenticated={false} />);

    const nav = screen.getByRole('navigation');

    // By default, 'Getting Started' is open, displaying 'Core Concepts & Domain Model' inside the navigation
    expect(within(nav).getByText('Core Concepts & Domain Model')).toBeInTheDocument();
    // 'CLI Reference' items should NOT be visible inside the navigation initially
    expect(within(nav).queryByText('CLI Overview & Installation')).not.toBeInTheDocument();

    // Find the 'CLI Reference' accordion category header button
    const cliCategoryButton = screen.getByRole('button', { name: /CLI Reference/i });
    expect(cliCategoryButton).toBeInTheDocument();

    // Click 'CLI Reference' to expand it
    fireEvent.click(cliCategoryButton);

    // Now 'CLI Reference' items must be visible inside navigation
    expect(within(nav).getByText('CLI Overview & Installation')).toBeInTheDocument();

    // AND crucially, 'Getting Started' items must be closed in navigation (single-open accordion invariant!)
    expect(within(nav).queryByText('Core Concepts & Domain Model')).not.toBeInTheDocument();

    // Click 'VS Code Extension' category header button
    const vscodeCategoryButton = screen.getByRole('button', { name: /VS Code Extension/i });
    fireEvent.click(vscodeCategoryButton);

    // 'VS Code Extension' items must be visible
    expect(within(nav).getByText(/Extension Overview & Install/i)).toBeInTheDocument();

    // AND 'CLI Reference' items must now be closed
    expect(within(nav).queryByText('CLI Overview & Installation')).not.toBeInTheDocument();
  });

  it('supports searching across documentation items in DocsPage', () => {
    render(<DocsPage isAuthenticated={false} />);

    const searchInput = screen.getByPlaceholderText(/Search documentation/i);
    expect(searchInput).toBeInTheDocument();

    // Search for 'envelope'
    fireEvent.change(searchInput, { target: { value: 'envelope' } });

    // Matching items should be displayed
    expect(screen.getAllByText(/Envelope Encryption/i).length).toBeGreaterThan(0);
  });

  it('navigates to child document item when clicked', () => {
    render(<DocsPage isAuthenticated={false} />);

    // Click on 'CLI Reference' category
    const cliCategoryButton = screen.getByRole('button', { name: /CLI Reference/i });
    fireEvent.click(cliCategoryButton);

    const nav = screen.getByRole('navigation');

    // Click on 'CLI Overview & Installation' item within navigation
    const overviewButton = within(nav).getByText('CLI Overview & Installation');
    fireEvent.click(overviewButton);

    // Item headline should be rendered in main content
    expect(screen.getByText(/SecretVault CLI Reference/i)).toBeInTheDocument();
    expect(screen.getByText(/Installation & Distribution/i)).toBeInTheDocument();

    // Click on 'Authentication & Sessions' subsystem accordion
    const authSubsystemButton = within(nav).getByText(/Authentication & Sessions/i);
    fireEvent.click(authSubsystemButton);

    // Click on 'auth login'
    const authLoginButton = within(nav).getByText('auth login');
    fireEvent.click(authLoginButton);

    // Command title should be rendered in main content
    expect(screen.getByRole('heading', { level: 1, name: 'secretvault auth login' })).toBeInTheDocument();
  });
});
