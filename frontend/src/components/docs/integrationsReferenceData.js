// =============================================================================
// SecretVault Integrations Directory & Technical Guides Data Model
// Grounded strictly in repository provider adapters, sync engine, and drift detection.
// =============================================================================

export const INTEGRATIONS_CATALOG = [
  {
    id: 'vercel',
    name: 'Vercel',
    category: 'Hosting & Deployment',
    status: 'Available',
    statusColor: 'emerald',
    icon: 'triangle',
    summary: 'Synchronize environment variables to Vercel projects across Production, Preview, and Development targets.',
    adapterClass: 'com.secretvault.provider.adapter.vercel.VercelProviderAdapter',
    capabilities: [
      'Connection Validation (/v2/user, /v2/teams)',
      'Project Discovery (/v9/projects)',
      'Environment Scoping (production, preview, development)',
      'Variable Read & Metadata Sync (/v10/projects/{id}/env)',
      'Atomic Env Variable Upsert & Delete'
    ],
    authRequirements: 'Vercel Personal Access Token or Team Service Token with Project Env read/write permissions.',
    requiredConfig: [
      { name: 'apiToken', type: 'String (Secret)', required: true, desc: 'Bearer access token generated in Vercel Account Settings.' },
      { name: 'teamId', type: 'String', required: false, desc: 'Optional Vercel Team ID (e.g., team_123456789) for organization projects.' },
      { name: 'baseUrl', type: 'String', required: false, default: 'https://api.vercel.com', desc: 'Base REST API URL for Vercel API.' }
    ],
    setupDocsId: 'int-vercel'
  },
  {
    id: 'render',
    name: 'Render',
    category: 'Hosting & Deployment',
    status: 'Available',
    statusColor: 'emerald',
    icon: 'server',
    summary: 'Push encrypted configurations into Render Web Services and Background Workers with automatic zero-downtime deployment triggers.',
    adapterClass: 'com.secretvault.provider.adapter.render.RenderProviderAdapter',
    capabilities: [
      'Account Validation (/owners?limit=1)',
      'Service Discovery (/services?limit=100)',
      'Deployment Tier Mapping (production, staging, development)',
      'Batch Environment Variable Updates (PUT /services/{id}/env-vars)',
      'Single Variable Deletion (DELETE /services/{id}/env-vars/{key})'
    ],
    authRequirements: 'Render API Key (rnd_...) with full service read/write privileges.',
    requiredConfig: [
      { name: 'apiKey', type: 'String (Secret)', required: true, desc: 'API key created under Render Account Settings -> API Keys.' },
      { name: 'baseUrl', type: 'String', required: false, default: 'https://api.render.com/v1', desc: 'Render REST API base URL.' }
    ],
    setupDocsId: 'int-render'
  },
  {
    id: 'github-actions',
    name: 'GitHub Actions',
    category: 'CI/CD & Source Control',
    status: 'Available',
    statusColor: 'emerald',
    icon: 'github',
    summary: 'Inject production secrets into CI/CD workflows using OIDC Workload Identity Federation without long-lived static tokens.',
    adapterClass: 'com.secretvault.oidc.service.OidcTokenExchangeService',
    capabilities: [
      'OIDC JWT Token Attestation (id-token: write)',
      'Claims Validation (repository, ref, workflow, actor)',
      'Ephemeral Session Minting (30-minute max lifetime)',
      'Pre-Commit & Pull-Request Secret Leak Scanning'
    ],
    authRequirements: 'Repository OIDC trust policy configured in SecretVault Workspace settings.',
    requiredConfig: [
      { name: 'issuer', type: 'String', required: true, default: 'https://token.actions.githubusercontent.com', desc: 'GitHub Actions OIDC issuer URL.' },
      { name: 'repositoryPattern', type: 'String', required: true, desc: 'e.g. acme-corp/billing-service' }
    ],
    setupDocsId: 'int-github-actions'
  },
  {
    id: 'kubernetes-operator',
    name: 'Kubernetes Operator',
    category: 'Infrastructure & Orchestration',
    status: 'Beta',
    statusColor: 'amber',
    icon: 'box',
    summary: 'Native Kubernetes CRD (SecretVaultSync) reconciling secrets directly into cluster Opaque Secrets with rolling pod restart triggers.',
    adapterClass: 'com.secretvault.k8s.SecretVaultSyncController (Planned / Beta)',
    capabilities: [
      'SecretVaultSync Custom Resource Definition',
      'Namespace Isolation & RBAC Binding',
      'Automatic Secret Sync on 60-Second Loop',
      'Deployment Rolling Restarts on Secret Rotation'
    ],
    authRequirements: 'Kubernetes ServiceAccount token with secretvault-operator ClusterRole.',
    requiredConfig: [
      { name: 'clusterUrl', type: 'String', required: true, desc: 'Kubernetes API server endpoint.' },
      { name: 'serviceAccountToken', type: 'String (Secret)', required: true, desc: 'Bearer token for operator ServiceAccount.' }
    ],
    setupDocsId: 'int-sync-engine'
  },
  {
    id: 'gitlab-ci',
    name: 'GitLab CI / CD',
    category: 'CI/CD & Source Control',
    status: 'Planned',
    statusColor: 'slate',
    icon: 'git-branch',
    summary: 'Planned integration for GitLab CI pipeline secret injection and CI_JOB_JWT attestation.',
    adapterClass: 'Unimplemented (Roadmap Q4)',
    capabilities: [
      'GitLab OIDC CI_JOB_JWT validation (Planned)',
      'Pipeline Environment Injection (Planned)'
    ],
    authRequirements: 'GitLab Project Deploy Token or OIDC Federation.',
    requiredConfig: [],
    setupDocsId: 'int-overview'
  },
  {
    id: 'terraform',
    name: 'Terraform Provider',
    category: 'Infrastructure as Code',
    status: 'Planned',
    statusColor: 'slate',
    icon: 'layers',
    summary: 'Declarative Terraform / OpenTofu provider for managing SecretVault workspaces, projects, environments, and policies in code.',
    adapterClass: 'terraform-provider-secretvault (Standalone Go binary - In Development)',
    capabilities: [
      'Declarative Workspace & Project Provisioning',
      'Environment Policy Definition in HCL',
      'State Drift Reconciliation'
    ],
    authRequirements: 'SecretVault Master API Token with Workspace Owner privileges.',
    requiredConfig: [],
    setupDocsId: 'int-overview'
  }
];

export const INTEGRATIONS_PAGES = [
  // ---------------------------------------------------------------------------
  // 1. Integrations Overview & Directory
  // ---------------------------------------------------------------------------
  {
    id: 'int-overview',
    title: 'Integration Directory & Overview',
    badge: 'Directory',
    subgroup: 'Overview & Status',
    summary: 'Searchable provider catalog, status model, architecture, and connection lifecycle.',
    headline: 'Multi-Cloud Integration Directory & Provider Architecture',
    subheadline: 'Centralize secrets governance in SecretVault while orchestrating automated synchronization into Vercel, Render, GitHub Actions, and Kubernetes.',
    isCatalogLanding: true,
    note: {
      type: 'info',
      title: 'Status Classification Standard',
      text: 'Every provider is strictly labeled: Available (tested & verified against adapter code), Beta (implemented with active refinement), Unverified (adapter exists but live tests incomplete), or Planned (on roadmap).'
    },
    pillars: [
      {
        title: 'Bidirectional State Awareness',
        desc: 'SecretVault tracks both Desired State (in vault) and Actual State (on provider), computing cryptographic fingerprints to detect drift without decrypting values.'
      },
      {
        title: 'Zero Plaintext Exposure in Transit',
        desc: 'Secrets are pushed directly over encrypted TLS 1.3 connections to provider management APIs. Secret values are never exposed in logs or audit traces.'
      },
      {
        title: 'Transactional Synchronization Outbox',
        desc: 'Sync jobs execute asynchronously with distributed locks (SyncDistributedLockCoordinator.java) ensuring idempotent, replay-safe execution.'
      }
    ]
  },
  {
    id: 'int-status',
    title: 'Provider Status & Connection Lifecycle',
    badge: 'Lifecycle',
    subgroup: 'Overview & Status',
    summary: 'Connection validation, credential storage, health checks, and lifecycle states.',
    headline: 'Provider Connection Lifecycle & Health Monitoring',
    subheadline: 'How connections are established, verified, health-checked, and safely terminated.',
    workflow: [
      {
        step: '1. Credential Submission & Validation',
        desc: 'Administrator submits provider API credentials. SecretVault invokes adapter validateConnection() to verify permissions against the remote endpoint.'
      },
      {
        step: '2. Resource & Project Mapping',
        desc: 'Adapter calls discoverResources() and discoverEnvironments() to populate selectable project lists and map environments (e.g. dev -> development, prod -> production).'
      },
      {
        step: '3. Periodic Drift Detection',
        desc: 'A background scheduler invokes DriftDetectionEngine.java, comparing desired secret fingerprints with remote provider metadata.'
      },
      {
        step: '4. Graceful Disconnection',
        desc: 'Disconnecting an integration instantly purges the encrypted API credential and halts background sync jobs without deleting remote variables.'
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // 2. Hosting & Deployment Providers
  // ---------------------------------------------------------------------------
  {
    id: 'int-vercel',
    title: 'Vercel Deployment Integration',
    badge: 'Available',
    subgroup: 'Hosting & Deployment',
    summary: 'Sync environment variables into Vercel projects, preview deployments, and production tiers.',
    headline: 'Vercel Cloud Integration & Variable Sync',
    subheadline: 'Grounded strictly in VercelProviderAdapter.java and Vercel REST API v9/v10 endpoints.',
    tags: ['Vercel REST API v10', 'Encrypted Variable Push', 'Drift Detection', 'Project Mapping'],
    code: `# 1. Connect Vercel Integration via REST API
POST /api/v1/workspaces/{workspaceId}/integrations
Content-Type: application/json
Authorization: Bearer REPLACE_WITH_TEST_TOKEN

{
  "providerType": "VERCEL",
  "name": "Production Vercel Org",
  "credentials": {
    "apiToken": "vercel_tok_REPLACE_WITH_TEST_TOKEN",
    "teamId": "team_acme_engineering"
  }
}

# 2. Map SecretVault Project to Vercel Project
POST /api/v1/workspaces/{workspaceId}/integrations/{integrationId}/mappings
Content-Type: application/json
Authorization: Bearer REPLACE_WITH_TEST_TOKEN

{
  "projectId": "billing-frontend",
  "environmentId": "production",
  "providerResourceId": "prj_98410294819",
  "providerEnvironment": "production"
}`,
    pillars: [
      {
        title: 'Endpoint Verification',
        desc: 'Calls GET /v2/user (or /v2/teams/{teamId}) for token validation, GET /v9/projects for project discovery, and POST /v10/projects/{projectId}/env for variable creation.'
      },
      {
        step: 'Target Scoping',
        desc: 'Vercel target array maps cleanly: SecretVault dev maps to development, staging maps to preview, and prod maps to production.'
      },
      {
        title: 'Safe Update Behavior',
        desc: 'If a variable already exists on Vercel, the adapter executes a PATCH /v10/projects/{id}/env/{envId} or deletes and recreates atomically.'
      }
    ]
  },
  {
    id: 'int-render',
    title: 'Render Cloud Sync Guide',
    badge: 'Available',
    subgroup: 'Hosting & Deployment',
    summary: 'Synchronize environment variables to Render Web Services and Background Workers.',
    headline: 'Render Cloud Integration & Service Variable Sync',
    subheadline: 'Grounded strictly in RenderProviderAdapter.java and Render REST API v1 endpoints.',
    tags: ['Render API v1', 'Service Env-Vars', 'Batch PUT', 'Zero Downtime'],
    code: `# 1. Connect Render Integration via REST API
POST /api/v1/workspaces/{workspaceId}/integrations
Content-Type: application/json
Authorization: Bearer REPLACE_WITH_TEST_TOKEN

{
  "providerType": "RENDER",
  "name": "Render Production Cluster",
  "credentials": {
    "apiKey": "rnd_REPLACE_WITH_TEST_KEY"
  }
}

# 2. Trigger Sync to Render Web Service
POST /api/v1/sync/jobs
Content-Type: application/json
Authorization: Bearer REPLACE_WITH_TEST_TOKEN

{
  "workspaceId": "c2e91df2-f2ef-43ca-9314-6d7b3a4ffd7b",
  "integrationId": "rnd_int_849102",
  "syncMode": "FULL_OVERWRITE"
}`,
    pillars: [
      {
        title: 'Service Discovery',
        desc: 'Queries GET /services?limit=100. Discovers web services, background workers, and private services along with their region and suspension status.'
      },
      {
        title: 'Batch Update Protocol',
        desc: 'Render uses PUT /services/{serviceId}/env-vars accepting a full array of { key, value } pairs to apply configuration changes atomically.'
      },
      {
        title: 'Single-Variable Delete',
        desc: 'Deletions invoke DELETE /services/{serviceId}/env-vars/{envVarKey}, preventing orphaned credentials when secrets are decommissioned.'
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // 3. Provider Synchronization & Drift Detection
  // ---------------------------------------------------------------------------
  {
    id: 'int-sync-engine',
    title: 'Multi-Cloud Provider Sync Engine',
    badge: 'Sync Engine',
    subgroup: 'Sync & Drift',
    summary: 'Desired vs actual state resolution, dry runs, distributed locks, and retry recovery.',
    headline: 'SyncExecutionEngine: Atomic State Reconciliation',
    subheadline: 'Grounded strictly in SyncExecutionEngine.java and DesiredStateResolver.java.',
    diagram: `
+---------------------------------------------------------------------------------------------------+
|                                 PROVIDER SYNCHRONIZATION WORKFLOW                                 |
|                                                                                                   |
|   1. TRIGGER                  2. RESOLUTION                3. COMPARISON             4. DISPATCH  |
|   Secret mutation or          DesiredStateResolver         DriftDetectionEngine      Adapter      |
|   scheduled cron sync         computes vault state         calculates delta          executes PUT |
|             |                            |                       |                         |      |
|             v                            v                       v                         v      |
|   [SyncJob Initiated] ------> [Desired States] --------> [Drift Records] --------> [Remote Sync]  |
|             |                                                    |                         |      |
|             | (Acquires Distributed Lock)                        +-> [Dry-Run Plan]        |      |
|             v                                                                              v      |
|   (SyncDistributedLockCoordinator) ---> (Audit Ledger & Transactional Outbox Event Published)     |
+---------------------------------------------------------------------------------------------------+`,
    pillars: [
      {
        title: 'Dry-Run Simulation',
        desc: 'Inspect planned additions, modifications, and deletions without changing remote provider state via POST /api/v1/sync/dry-run.'
      },
      {
        title: 'Distributed Lock Coordination',
        desc: 'SyncDistributedLockCoordinator prevents race conditions and concurrent sync jobs targeting the same provider project.'
      },
      {
        title: 'Granular Secret Distinctions',
        desc: 'Clearly separates: Stored Secret (in DB), Revealed Secret (in RAM), Exported Secret (CLI .env), Synchronized Secret (pushed to cloud), and Remotely Verified Secret (matching remote hash).'
      }
    ]
  },
  {
    id: 'int-drift-detection',
    title: 'Continuous Drift Detection Engine',
    badge: 'Drift',
    subgroup: 'Sync & Drift',
    summary: 'Detect out-of-band changes on external providers without exposing secret plaintext.',
    headline: 'Continuous Drift Detection & Reconciliation',
    subheadline: 'Grounded strictly in DriftDetectionEngine.java and SecretFingerprintCalculator.java.',
    tableHeaders: ['Drift Classification', 'Detection Trigger', 'Calculated Severity', 'Automated Remediation'],
    tableRows: [
      ['MISSING_FROM_PROVIDER', 'Secret exists in SecretVault but is absent on provider', 'HIGH (Production) / MEDIUM', 'Queued for automatic sync re-apply'],
      ['VALUE_MISMATCH', 'Remote fingerprint differs from vault desired fingerprint', 'CRITICAL (Production)', 'Flags Security Finding & alerts on-call'],
      ['UNMANAGED_ON_PROVIDER', 'Secret found on provider that is not tracked by SecretVault', 'MEDIUM', 'Optionally imports or deletes unmanaged var'],
      ['PROVIDER_UNAVAILABLE', 'Remote provider returned HTTP 5xx or timed out', 'HIGH', 'Exponential backoff retry with circuit breaker']
    ],
    pillars: [
      {
        title: 'Zero Plaintext Comparison',
        desc: 'Uses SHA-256 HMAC fingerprints. Compares desiredFingerprint with providerFingerprint via constant-time secureEquals().'
      },
      {
        title: 'Security Telemetry Integration',
        desc: 'Any detected drift in protected production environments generates an immediate Security Finding (SecurityFindingService.java).'
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // 4. CI/CD & Workload Identity
  // ---------------------------------------------------------------------------
  {
    id: 'int-github-actions',
    title: 'GitHub Actions & OIDC Workload Identity',
    badge: 'OIDC',
    subgroup: 'CI/CD & Source Control',
    summary: 'Eliminate static long-lived tokens in CI/CD using GitHub Actions OIDC federation.',
    headline: 'Zero-Static-Secrets in CI/CD: GitHub Actions OIDC',
    subheadline: 'Federate GitHub Actions workflows directly with SecretVault using short-lived cryptographically signed ID tokens.',
    code: `# .github/workflows/deploy.yml
name: Production Deployment

on:
  push:
    branches: [main]

permissions:
  id-token: write # Mandatory for requesting GitHub OIDC JWT
  contents: read

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Fetch Secrets from SecretVault
        uses: secretvault/action-fetch-secrets@v1
        with:
          vault-url: https://vault.company.com
          project: billing-service
          environment: production
          audience: https://vault.company.com/oidc

      - name: Run Test Suite with Injected Secrets
        run: npm test`,
    pillars: [
      {
        title: 'Zero Static Long-Lived Tokens',
        desc: 'No static master passwords or service tokens stored in GitHub repository secrets. All tokens expire in 15 minutes.'
      },
      {
        title: 'Strict Claims Verification',
        desc: 'Attestation verifies issuer (https://token.actions.githubusercontent.com), repository (org/repo), ref (refs/heads/main), and job workflow.'
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // 5. Building Integrations & Adapter Architecture
  // ---------------------------------------------------------------------------
  {
    id: 'int-adapter-spi',
    title: 'Custom Provider Adapter SPI',
    badge: 'SPI Architecture',
    subgroup: 'Building Integrations',
    summary: 'Implement custom provider adapters using the ProviderAdapter Java interface.',
    headline: 'Provider Adapter Architecture & Service Provider Interface (SPI)',
    subheadline: 'Grounded strictly in ProviderAdapter.java, ProviderCapability.java, and ProviderType.java.',
    code: `// Implement com.secretvault.provider.adapter.ProviderAdapter
public interface ProviderAdapter {
    ProviderType getProviderType();
    Set<ProviderCapability> getCapabilities();

    ProviderValidationResult validateConnection(Map<String, Object> config, String credential);
    List<ProviderDiscoveredResource> discoverResources(Map<String, Object> config, String credential);
    List<ProviderDiscoveredEnvironment> discoverEnvironments(Map<String, Object> config, String credential, String resourceId);

    List<ProviderSecretMetadata> listSecrets(Map<String, Object> config, String credential, ProviderResourceMapping mapping);
    ProviderSyncResult writeSecrets(Map<String, Object> config, String credential, ProviderResourceMapping mapping, List<ProviderSecretPayload> secrets);
    ProviderSyncResult deleteSecret(Map<String, Object> config, String credential, ProviderResourceMapping mapping, String secretKey);
}`,
    pillars: [
      {
        title: 'Extensible Provider Registry',
        desc: 'New adapters are annotated with @Component and automatically registered in ProviderRegistry.java on Spring Boot startup.'
      },
      {
        title: 'Capability Flags',
        desc: 'Adapters declare capabilities (VALIDATE_CONNECTION, DISCOVER_PROJECTS, WRITE_SECRETS, DELETE_SECRETS), allowing the UI to disable unsupported actions.'
      }
    ]
  }
];

export const findIntegrationPageById = (id) => {
  return INTEGRATIONS_PAGES.find((p) => p.id === id) || null;
};
