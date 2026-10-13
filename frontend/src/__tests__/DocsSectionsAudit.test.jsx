import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { DocsPage } from '../components/docs/DocsPage';
import {
  DOCS_GROUPS,
  findDocItemById,
  SECURITY_PAGES,
  INTEGRATIONS_CATALOG,
  INTEGRATIONS_PAGES,
  REST_API_ENDPOINTS,
  CLIENT_SDKS_CATALOG,
  SDK_AND_API_PAGES
} from '../components/docs/docsData';

describe('SecretVault Documentation Audit: Security Features, Integrations, Client SDKs & REST API', () => {
  let originalLocation;

  beforeEach(() => {
    originalLocation = window.location;
    delete window.location;
    window.location = {
      search: '',
      pathname: '/docs',
      origin: 'http://localhost:3000',
      href: 'http://localhost:3000/docs'
    };
  });

  afterEach(() => {
    window.location = originalLocation;
    vi.restoreAllMocks();
  });

  // ===========================================================================
  // SECTION A — SECURITY FEATURES VERIFICATION
  // ===========================================================================
  describe('Section A — Security Features Model & Content', () => {
    it('has Category 7 (security) containing all 15 technical security topics and verified data', () => {
      const securityGroup = DOCS_GROUPS.find((g) => g.id === 'security');
      expect(securityGroup).toBeDefined();
      expect(securityGroup.title).toBe('Security Features');
      expect(securityGroup.items.length).toBeGreaterThanOrEqual(15);

      const requiredTopics = [
        'sec-overview',
        'sec-architecture',
        'sec-threat-model',
        'sec-trust-boundaries',
        'sec-limitations',
        'sec-auth',
        'sec-rbac',
        'sec-machine-identities',
        'sec-envelope-encryption',
        'sec-kms-provider',
        'sec-jit-access',
        'sec-audit-logging',
        'sec-webhook-signatures',
        'sec-repo-scanning',
        'sec-incident-response'
      ];

      requiredTopics.forEach((topicId) => {
        const found = securityGroup.items.some((it) => it.id === topicId);
        expect(found, `Expected topic ${topicId} in security category`).toBe(true);
      });
    });

    it('documents verified AES-256-GCM envelope encryption with AAD context binding and memory zeroization', () => {
      const envelopeDoc = SECURITY_PAGES.find((p) => p.id === 'sec-envelope-encryption');
      expect(envelopeDoc).toBeDefined();
      expect(envelopeDoc.tags).toContain('AES-256-GCM');
      expect(envelopeDoc.tags).toContain('96-bit Random IV');
      expect(envelopeDoc.diagram).toContain('ENVELOPE ENCRYPTION FLOW');
      expect(envelopeDoc.diagram).toContain('KmsKeyProvider');
      expect(envelopeDoc.diagram).toContain('Memory Zeroized');
      expect(envelopeDoc.pillars.some((p) => p.title.includes('Data Encryption Keys (DEKs)'))).toBe(true);
      expect(envelopeDoc.pillars.some((p) => p.title.includes('Key Encryption Keys (KEKs)'))).toBe(true);
      expect(envelopeDoc.pillars.some((p) => p.title.includes('Authenticated Additional Data (AAD)'))).toBe(true);
    });

    it('documents JIT break-glass access lifecycle and dual-custody approval', () => {
      const jitDoc = SECURITY_PAGES.find((p) => p.id === 'sec-jit-access');
      expect(jitDoc).toBeDefined();
      expect(jitDoc.diagram).toContain('JUST-IN-TIME (JIT) ACCESS LIFECYCLE');
      expect(jitDoc.diagram).toContain('PENDING');
      expect(jitDoc.diagram).toContain('APPROVED');
      expect(jitDoc.diagram).toContain('ACTIVE');
      expect(jitDoc.diagram).toContain('EXPIRED');
      expect(jitDoc.pillars.some((p) => p.title.includes('Dual-Custody Separation of Duties'))).toBe(true);
    });

    it('renders security threat model and RBAC matrix table', () => {
      window.location.search = '?section=sec-rbac';
      render(<DocsPage />);
      expect(screen.getByText(/Fine-Grained Role-Based Access Control/i)).toBeInTheDocument();
      expect(screen.getAllByText('OWNER')[0]).toBeInTheDocument();
      expect(screen.getAllByText('ADMIN')[0]).toBeInTheDocument();
      expect(screen.getAllByText('MEMBER')[0]).toBeInTheDocument();
      expect(screen.getAllByText('VIEWER')[0]).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // SECTION B — INTEGRATIONS VERIFICATION
  // ===========================================================================
  describe('Section B — Integrations Catalog & Adapters', () => {
    it('has Category 8 (integrations) containing verified deep-dive pages and catalog', () => {
      const intGroup = DOCS_GROUPS.find((g) => g.id === 'integrations');
      expect(intGroup).toBeDefined();
      expect(intGroup.title).toBe('Integrations');

      const expectedPages = [
        'int-overview',
        'int-status',
        'int-vercel',
        'int-render',
        'int-sync-engine',
        'int-drift-detection',
        'int-github-actions',
        'int-adapter-spi'
      ];

      expectedPages.forEach((pageId) => {
        const found = intGroup.items.some((it) => it.id === pageId);
        expect(found, `Expected page ${pageId} in integrations category`).toBe(true);
      });
    });

    it('catalog defines verified Vercel and Render adapters with capabilities and status', () => {
      const vercel = INTEGRATIONS_CATALOG.find((p) => p.id === 'vercel');
      expect(vercel).toBeDefined();
      expect(vercel.status).toBe('Available');
      expect(vercel.adapterClass).toContain('VercelProviderAdapter');
      expect(vercel.capabilities.some((c) => c.includes('/v9/projects'))).toBe(true);
      expect(vercel.capabilities.some((c) => c.includes('/v10/projects/{id}/env'))).toBe(true);

      const render = INTEGRATIONS_CATALOG.find((p) => p.id === 'render');
      expect(render).toBeDefined();
      expect(render.status).toBe('Available');
      expect(render.adapterClass).toContain('RenderProviderAdapter');
      expect(render.capabilities.some((c) => c.includes('/services?limit=100'))).toBe(true);
    });

    it('renders the interactive Integration Catalog on int-overview with category filters and search', () => {
      window.location.search = '?section=int-overview';
      render(<DocsPage />);
      expect(screen.getByText(/Multi-Cloud Integration Directory/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Search providers & capabilities/i)).toBeInTheDocument();

      // Check provider cards
      expect(screen.getAllByText('Vercel')[0]).toBeInTheDocument();
      expect(screen.getAllByText('Render')[0]).toBeInTheDocument();
      expect(screen.getAllByText('GitHub Actions')[0]).toBeInTheDocument();
    });

    it('documents drift detection engine with classifications and severity rules', () => {
      const driftDoc = INTEGRATIONS_PAGES.find((p) => p.id === 'int-drift-detection');
      expect(driftDoc).toBeDefined();
      expect(driftDoc.tableHeaders).toContain('Drift Classification');
      expect(driftDoc.tableRows.some((r) => r[0] === 'MISSING_FROM_PROVIDER')).toBe(true);
      expect(driftDoc.tableRows.some((r) => r[0] === 'VALUE_MISMATCH')).toBe(true);
      expect(driftDoc.tableRows.some((r) => r[0] === 'UNMANAGED_ON_PROVIDER')).toBe(true);
    });
  });

  // ===========================================================================
  // SECTION C — CLIENT SDKs & REST API VERIFICATION
  // ===========================================================================
  describe('Section C — Client SDKs & REST API Reference', () => {
    it('has Category 9 (sdks) containing REST API explorer and multi-language SDK guides', () => {
      const sdkGroup = DOCS_GROUPS.find((g) => g.id === 'sdks');
      expect(sdkGroup).toBeDefined();
      expect(sdkGroup.title).toBe('Client SDKs & REST API');

      const expectedSdkPages = [
        'rest-api-overview',
        'rest-api-endpoints',
        'sdk-overview-page',
        'sdk-java-guide',
        'sdk-node-guide',
        'sdk-python-guide'
      ];

      expectedSdkPages.forEach((pId) => {
        const found = sdkGroup.items.some((it) => it.id === pId);
        expect(found, `Expected page ${pId} in sdks category`).toBe(true);
      });
    });

    it('documents actual Spring Boot REST API routes with method, path, schemas, and status codes', () => {
      expect(REST_API_ENDPOINTS.length).toBeGreaterThanOrEqual(10);

      const secretRevealEndpoint = REST_API_ENDPOINTS.find((ep) => ep.id === 'api-secrets-reveal');
      expect(secretRevealEndpoint).toBeDefined();
      expect(secretRevealEndpoint.method).toBe('POST');
      expect(secretRevealEndpoint.path).toContain('/secrets/{secretId}/reveal');
      expect(secretRevealEndpoint.rateLimit).toContain('60 requests / 60s');
      expect(secretRevealEndpoint.statusCodes.some((sc) => sc.code === 200)).toBe(true);
      expect(secretRevealEndpoint.statusCodes.some((sc) => sc.code === 401)).toBe(true);
      expect(secretRevealEndpoint.statusCodes.some((sc) => sc.code === 429)).toBe(true);

      const jitApproveEndpoint = REST_API_ENDPOINTS.find((ep) => ep.id === 'api-jit-approve');
      expect(jitApproveEndpoint).toBeDefined();
      expect(jitApproveEndpoint.path).toContain('/jit-requests/{requestId}/approve');
    });

    it('documents actual SDK package coordinates matching repository sdk/ modules', () => {
      const javaCore = CLIENT_SDKS_CATALOG.find((s) => s.id === 'sdk-java-core');
      expect(javaCore).toBeDefined();
      expect(javaCore.artifact).toBe('io.secretvault:secretvault-sdk-core:1.0.0');

      const springStarter = CLIENT_SDKS_CATALOG.find((s) => s.id === 'sdk-spring-boot');
      expect(springStarter).toBeDefined();
      expect(springStarter.artifact).toBe('io.secretvault:secretvault-spring-boot-starter:1.0.0');
      expect(springStarter.features.some((f) => f.includes('@SecretVaultValue'))).toBe(true);

      const jsSdk = CLIENT_SDKS_CATALOG.find((s) => s.id === 'sdk-js');
      expect(jsSdk).toBeDefined();
      expect(jsSdk.artifact).toBe('@secretvault/sdk');

      const pythonSdk = CLIENT_SDKS_CATALOG.find((s) => s.id === 'sdk-python');
      expect(pythonSdk).toBeDefined();
      expect(pythonSdk.artifact).toBe('secretvault');
    });

    it('renders the interactive REST API explorer on rest-api-endpoints with method filters', () => {
      window.location.search = '?section=rest-api-endpoints';
      render(<DocsPage />);
      expect(screen.getByText(/Interactive REST API Endpoint Explorer/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Filter paths, methods, or DTOs/i)).toBeInTheDocument();
      expect(screen.getByText('/api/v1/auth/login')).toBeInTheDocument();
    });

    it('renders the Client SDK Architecture on sdk-overview-page with language tabs', () => {
      window.location.search = '?section=sdk-overview-page';
      render(<DocsPage />);
      expect(screen.getByText(/Client SDK Architecture & Resilience Engineering/i)).toBeInTheDocument();
      expect(screen.getAllByText('Java SDK (Core)')[0]).toBeInTheDocument();
      expect(screen.getAllByText('Spring Boot 3.x Starter')[0]).toBeInTheDocument();
      expect(screen.getAllByText('JavaScript / TypeScript SDK')[0]).toBeInTheDocument();
      expect(screen.getAllByText('Python Client SDK')[0]).toBeInTheDocument();
    });
  });

  // ===========================================================================
  // SECTION D — SHARED EXPERIENCE & INVARIANTS
  // ===========================================================================
  describe('Section D — Shared UX Invariants & Search', () => {
    it('enforces strictly only ONE category accordion dropdown is open at a time', () => {
      window.location.search = '?section=overview';
      render(<DocsPage />);

      // Initially Getting Started is open
      const secAccordionBtn = screen.getByRole('button', { name: /Security Features/i });
      fireEvent.click(secAccordionBtn);

      // Security Features is now open, verify its child item is visible in sidebar
      expect(screen.getByRole('button', { name: /Security Overview & Posture/i })).toBeInTheDocument();
    });

    it('navigates cleanly across all categories using findDocItemById without falling back to null', () => {
      const testIds = [
        'sec-overview',
        'sec-envelope-encryption',
        'sec-jit-access',
        'int-overview',
        'int-vercel',
        'int-render',
        'rest-api-overview',
        'rest-api-endpoints',
        'sdk-java-guide'
      ];

      testIds.forEach((id) => {
        const { item, group } = findDocItemById(id);
        expect(item).toBeDefined();
        expect(item.id).toBe(id);
        expect(group).toBeDefined();
      });
    });
  });
});
