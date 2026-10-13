// =============================================================================
// SecretVault Interactive Documentation Data Model
// Grounded strictly in repository code, tests, CLI, SDKs, and architecture.
// 10 Expandable Categories matching developer experience & information architecture.
// =============================================================================

import {
  CLI_COMMAND_GROUPS,
  CLI_GLOBAL_FLAGS,
  CLI_EXIT_CODES,
  findCliCommandById,
  searchCliCommands
} from './cliReferenceData.js';
import { SECURITY_PAGES } from './securityReferenceData.js';
import { INTEGRATIONS_CATALOG, INTEGRATIONS_PAGES } from './integrationsReferenceData.js';
import {
  REST_API_OVERVIEW,
  REST_API_ENDPOINTS,
  CLIENT_SDKS_CATALOG,
  SDK_AND_API_PAGES
} from './apiAndSdkReferenceData.js';

export {
  CLI_COMMAND_GROUPS,
  CLI_GLOBAL_FLAGS,
  CLI_EXIT_CODES,
  findCliCommandById,
  searchCliCommands,
  SECURITY_PAGES,
  INTEGRATIONS_CATALOG,
  INTEGRATIONS_PAGES,
  REST_API_OVERVIEW,
  REST_API_ENDPOINTS,
  CLIENT_SDKS_CATALOG,
  SDK_AND_API_PAGES
};

export const DOCS_GROUPS = [
  // ---------------------------------------------------------------------------
  // Category 1: Getting Started
  // ---------------------------------------------------------------------------
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: 'zap',
    badge: 'Core',
    items: [
      {
        id: 'overview',
        title: 'Introduction to SecretVault',
        badge: 'v2.4.0',
        summary: 'Zero-trust architecture, envelope encryption, and memory-only RAM injection.',
        headline: 'Build without secrets leaking',
        subheadline: 'SecretVault is an enterprise zero-trust secrets governance platform. It eliminates insecure plaintext .env files with AES-256-GCM envelope encryption, RAM-only process injection, and autonomous AI posture defense.',
        note: {
          type: 'info',
          title: 'Zero-Knowledge Philosophy',
          text: 'SecretVault keeps credentials encrypted at rest and in transit. Encryption keys (KEKs) are stored separately from ciphertext. Plaintext values are injected exclusively into application RAM at execution time.'
        },
        tags: [
          'AES-256-GCM + Kyber-1024',
          'Zero Disk Plaintext Writes',
          'Redis L2 Cache (<12ms)',
          'Cryptographic Audit Trails'
        ],
        diagram: `
+-----------------------------------------------------------------------------------+
|                            APPLICATION / CLIENT RUNTIMES                          |
|   +-------------------+  +--------------------+  +----------------------------+   |
|   |  CLI: secretvault |  |  K8s Operator CRD  |  |  SDKs (Node, Python, Java) |   |
|   +---------+---------+  +---------+----------+  +-------------+--------------+   |
+-------------|----------------------|---------------------------|------------------+
              |                      |                           |
              v                      v                           v
+-----------------------------------------------------------------------------------+
|                        SECRETVLT GATEWAY & ZERO-TRUST TLS                         |
|   - Bearer JWT / Machine Token Attestation     - Token-Bucket Distributed Limiter |
|   - Real-Time Audit Logger & SIEM Webhook      - Role-Based Access Control (RBAC) |
+------------------------------------+----------------------------------------------+
                                     |
                                     v
+-----------------------------------------------------------------------------------+
|                        DISTRIBUTED CACHE & KMS ENGINE                             |
|   +---------------------------------------+  +--------------------------------+   |
|   |      Redis L2 Microsecond Cache       |  |   Envelope KMS Key Providers   |   |
|   |  (Metadata, Session, Rate-Limiting)   |  |   AWS KMS / GCP / Azure / Dev  |   |
|   +---------------------------------------+  +--------------------------------+   |
+------------------------------------+----------------------------------------------+
                                     |
                                     v
+-----------------------------------------------------------------------------------+
|                        POSTGRESQL ZERO-KNOWLEDGE STORE                            |
|       Encrypted Secrets Ciphertext (AES-256-GCM + Salt + IV + AuthTag)            |
+-----------------------------------------------------------------------------------+`,
        pillars: [
          {
            title: 'Envelope Encryption (DEK + KEK)',
            desc: 'Secrets are encrypted using ephemeral Data Encryption Keys (DEKs) via AES-256-GCM. The DEK is wrapped with a Customer Managed Key Encryption Key (KEK).'
          },
          {
            title: 'Zero Disk Footprint',
            desc: 'The CLI pipes decrypted secrets straight into child process memory via system environment blocks. No .env file is written, preventing accidental Git commits or Docker bake-ins.'
          },
          {
            title: 'Redis L2 Microsecond Cache',
            desc: 'Sub-12ms secret resolution backed by Redis distributed caching, invalidating instantly upon secret mutation or rotation.'
          }
        ]
      },
      {
        id: 'core-concepts',
        title: 'Core Concepts & Domain Model',
        badge: 'Concepts',
        summary: 'Hierarchy between Organizations, Workspaces, Projects, Environments, and Secrets.',
        headline: 'Core Concepts: Tenant & Resource Hierarchy',
        subheadline: 'Understand how organizations, workspaces, projects, environments, and secrets relate in SecretVault.',
        note: {
          type: 'tip',
          title: 'Permission Inheritance',
          text: 'Child access scopes (Project & Environment) can narrow your permissions but can never elevate privileges beyond your assigned Workspace Role.'
        },
        code: `// Multi-Tenant Hierarchy
Organization
 └── Workspace (e.g., "Engineering Core", "Acme Platform")
      ├── Members (OWNER, ADMIN, DEVELOPER, VIEWER)
      └── Projects (e.g., "payment-gateway", "auth-service")
           └── Environments (development, staging, production)
                └── Secrets (Key-Value, Versioned, AES-256-GCM Encrypted)
                     ├── Version 1 (Immutable)
                     ├── Version 2 (Immutable, Active)
                     └── Branches (e.g., feat/stripe-v2)`,
        pillars: [
          {
            title: 'Organizations & Workspaces',
            desc: 'Multi-tenant root isolating billing, enterprise policies, and teams. Workspaces contain member pools and project groups.'
          },
          {
            title: 'Projects & Environment Tiers',
            desc: 'Every project automatically provisions 3 deployment tiers: development, staging, and production (with protected flags).'
          },
          {
            title: 'Immutable Version Ledger',
            desc: 'Updating a secret creates version N+1. Older versions remain cryptographically locked and verifiable for rollback.'
          }
        ]
      },
      {
        id: 'local-setup',
        title: 'Local Development & Prerequisites',
        badge: 'Setup',
        summary: 'System requirements, Docker Compose dependencies, and starting backend & frontend services.',
        headline: 'Local Setup & Prerequisites',
        subheadline: 'Run the complete SecretVault stack locally with PostgreSQL 16, Redis 7, Spring Boot, and Vite.',
        note: {
          type: 'info',
          title: 'Prerequisites',
          text: 'Requires Java 21+, Node.js 18+, Docker Compose v2, and Maven 3.9+.'
        },
        code: `# 1. Clone repository
git clone https://github.com/SecretVaultOrg/SecretVault.git
cd SecretVault

# 2. Launch PostgreSQL 16 and Redis 7
docker compose up -d postgres redis

# 3. Start Spring Boot Control Plane (Port 8080)
cd backend
mvn spring-boot:run

# 4. In another terminal, start React/Vite Control Plane (Port 3000)
cd ../frontend
npm install
npm run dev`,
        pillars: [
          {
            title: 'Flyway Auto-Migrations',
            desc: 'Database tables V1 through V15 are automatically applied on Spring Boot bootup.'
          },
          {
            title: 'Local KMS Dev Provider',
            desc: 'Uses LocalDevKmsKeyProvider with RFC 3394 AES Key Wrap so no external AWS/GCP KMS credentials are required locally.'
          }
        ]
      },
      {
        id: 'quickstart',
        title: '5-Minute Quickstart',
        badge: 'Popular',
        summary: 'Onboard your first project, install the CLI, and run your app in under 5 minutes.',
        headline: 'Quickstart: 0 to Secure in 5 Minutes',
        subheadline: 'Follow these 4 simple steps to migrate away from .env files and run your applications securely.',
        steps: [
          {
            number: '0',
            title: 'Install SecretVault CLI',
            desc: 'Install the official CLI across macOS, Linux, or Windows via npm.',
            packageManagers: {
              npm: 'npm install -g @secretvault/cli',
              pnpm: 'pnpm add -g @secretvault/cli',
              yarn: 'yarn global add @secretvault/cli',
              brew: 'brew install secretvault/tap/secretvault',
              curl: 'curl -fsSL https://get.secretvault.io/install.sh | bash'
            },
            verifyCmd: 'secretvault --version',
            verifyOutput: '# @secretvault/cli v1.0.0 (darwin-arm64, Node >=18.0.0)'
          },
          {
            number: '1',
            title: 'Authenticate Your Terminal',
            desc: 'Log in using your control plane email credentials or biometric SSO.',
            packageManagers: {
              sso: 'secretvault auth login --server http://localhost:8080 --email developer@rally.io',
              token: 'secretvault auth oidc --provider-id github --machine-id ci-runner --token-stdin'
            },
            verifyCmd: 'secretvault context get',
            verifyOutput: '✓ Workspace: default\n✓ Project: rally\n✓ Environment: development'
          },
          {
            number: '2',
            title: 'Migrate Existing .env Files',
            desc: 'Parse and encrypt your existing .env files directly into SecretVault cloud storage.',
            code: '# Import secrets into development tier\nsecretvault secret import --env development .env\n\n# Safely delete plaintext file\nrm -f .env'
          },
          {
            number: '3',
            title: 'Run with Zero Disk Footprint',
            desc: 'Run your application with secretvault run. Secrets are piped directly into process RAM.',
            code: '# Node / Express / Next.js\nsecretvault run --env development -- npm run dev\n\n# Python / Django\nsecretvault run --env development -- python manage.py runserver'
          }
        ]
      },
      {
        id: 'troubleshooting-install',
        title: 'Troubleshooting Installation',
        badge: 'Help',
        summary: 'Common connection errors, Redis timeouts, and port conflict resolutions.',
        headline: 'Installation Troubleshooting & FAQ',
        subheadline: 'Diagnose and resolve common setup issues with local ports, database credentials, and CLI pathing.',
        note: {
          type: 'warning',
          title: 'Docker Port Bindings',
          text: 'Ensure PostgreSQL (port 5432) and Redis (port 6379) are not currently occupied by other local services.'
        },
        code: `# Run diagnostic doctor check
secretvault doctor

# Verify Docker container statuses
docker compose ps

# Check backend health actuator
curl -i http://localhost:8080/actuator/health`,
        pillars: [
          {
            title: 'Redis Connection Fallback',
            desc: 'If Redis is unavailable, SecretVault degrades gracefully to direct DB access while logging warnings.'
          },
          {
            title: 'JWT Secret Configuration',
            desc: 'Ensure JWT_SECRET in .env has at least 256 bits of entropy (32+ characters).'
          }
        ]
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // Category 2: Workspace Management
  // ---------------------------------------------------------------------------
  {
    id: 'workspace-management',
    title: 'Workspace Management',
    icon: 'layers',
    badge: 'Multi-Tenant',
    items: [
      {
        id: 'org-workspaces',
        title: 'Organizations and Workspaces',
        badge: 'Tenancy',
        summary: 'Tenant boundaries, workspace settings, and multi-tenant isolation.',
        headline: 'Multi-Tenant Organizations & Workspaces',
        subheadline: 'Isolate sensitive credentials across independent business units, clients, or staging boundaries.',
        note: {
          type: 'info',
          title: 'ThreadLocal Isolation',
          text: 'Every incoming HTTP request evaluates TenantContext with strict X-Workspace-ID header verification, preventing IDOR leaks.'
        },
        code: `# Switch active workspace context
secretvault workspace list
secretvault context set --workspace c2e91df2-f2ef-43ca-9314-6d7b3a4ffd7b

# API: GET /api/v1/workspaces
curl -H "Authorization: Bearer $TOKEN" http://localhost:8080/api/v1/workspaces`,
        pillars: [
          {
            title: 'Strict Workspace Boundaries',
            desc: 'Data never crosses workspace boundaries. Each workspace holds its own projects, members, and encryption contexts.'
          },
          {
            title: 'Auto-Provisioning',
            desc: 'New registrations automatically receive a personal organization and default workspace with OWNER role.'
          }
        ]
      },
      {
        id: 'roles-rbac',
        title: 'Roles, Permissions & RBAC Matrix',
        badge: 'Security',
        summary: 'OWNER, ADMIN, DEVELOPER, and VIEWER capability breakdown.',
        headline: 'Role-Based Access Control (RBAC)',
        subheadline: 'Four distinct workspace roles enforcing strict separation of duties and administrative boundaries.',
        tableHeaders: ['Capability / Action', 'OWNER', 'ADMIN', 'DEVELOPER', 'VIEWER'],
        tableRows: [
          ['Manage Workspace Settings & Delete Workspace', '✓ Yes', '✗ No', '✗ No', '✗ No'],
          ['Invite & Remove Workspace Members', '✓ Yes', '✓ Yes', '✗ No', '✗ No'],
          ['Create & Manage Projects / Environments', '✓ Yes', '✓ Yes', '✗ No', '✗ No'],
          ['Create & Modify Secrets (Dev & Staging)', '✓ Yes', '✓ Yes', '✓ Yes', '✗ No'],
          ['Reveal Production Secrets (Direct)', '✓ Yes', '✓ Approval', '✗ JIT Only', '✗ No'],
          ['Trigger Multi-Cloud Sync / Drift Scans', '✓ Yes', '✓ Yes', '✓ Yes', '✗ Read Only'],
          ['View Audit Logs & Security Risk Center', '✓ Yes', '✓ Yes', '✓ Scoped', '✗ No']
        ],
        pillars: [
          {
            title: 'Last Owner Protection',
            desc: 'The platform cryptographically blocks removing or demoting the final OWNER in any workspace.'
          },
          {
            title: 'Permission Narrowing',
            desc: 'ProjectAccess and EnvironmentAccess records can narrow permissions for specific team members.'
          }
        ]
      },
      {
        id: 'invitations-membership',
        title: 'Member Invitations & Lifecycle',
        badge: 'Governance',
        summary: 'High-entropy single-use invitation tokens, expirations, and role updates.',
        headline: 'Cryptographic Workspace Invitations',
        subheadline: 'Invite engineers and collaborators with secure SHA-256 hashed single-use tokens.',
        code: `# Send workspace invitation (REST API)
POST /api/v1/workspaces/{id}/invitations
Content-Type: application/json

{
  "email": "sarah.devops@company.com",
  "role": "DEVELOPER",
  "expiresInHours": 48
}

# Member accepts token
POST /api/v1/invitations/accept
{
  "token": "inv_sec_89f021a84c..."
}`,
        pillars: [
          {
            title: 'Token Replay Defense',
            desc: 'Tokens are hashed with SHA-256 before storage. Once accepted or revoked, tokens cannot be re-used.'
          },
          {
            title: 'Automatic Expiration',
            desc: 'Pending invitations automatically expire after the configured duration (default: 48 hours).'
          }
        ]
      },
      {
        id: 'environments-protection',
        title: 'Environment Protection Rules',
        badge: 'Governance',
        summary: 'Production protection flags, branch restrictions, and step-up gates.',
        headline: 'Protected Environments & Guardrails',
        subheadline: 'Prevent accidental overwrites and enforce dual approval on production deployments.',
        pillars: [
          {
            title: 'is_protected Flag',
            desc: 'Production environments have is_protected = true, preventing direct unreviewed mutations.'
          },
          {
            title: 'Break-Glass Approval',
            desc: 'Direct mutations in production trigger JIT access requests requiring explicit reviewer approval.'
          }
        ]
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // Category 3: Development Workflow
  // ---------------------------------------------------------------------------
  {
    id: 'development-workflow',
    title: 'Development Workflow',
    icon: 'git-branch',
    badge: 'Lifecycle',
    items: [
      {
        id: 'workflow-overview',
        title: 'Secret Development Lifecycle',
        badge: 'Lifecycle',
        summary: 'From creation and versioning to branch testing and production promotion.',
        headline: 'The Complete Secret Lifecycle',
        subheadline: 'Manage application configuration with the same rigor, versioning, and branch workflows as application source code.',
        diagram: `
+-----------------------------------------------------------------------------------+
|                        SECRET DEVELOPMENT LIFECYCLE                               |
|                                                                                   |
|  [Create Secret] ──> [Immutable v1] ──> [Create Feature Branch]                  |
|                                                   │                              |
|                                                   ▼                              |
|  [Promote to Prod] <── [3-Way Merge] <── [Test in Staging]                       |
+-----------------------------------------------------------------------------------+`,
        pillars: [
          {
            title: 'Immutable Version Ledger',
            desc: 'Every mutation advances the version pointer monotonically ($v_{N+1}$), keeping audit trails intact.'
          },
          {
            title: 'Zero Plaintext Default',
            desc: 'Standard GET requests never return plaintext values. Decryption requires explicit reveal authorization.'
          }
        ]
      },
      {
        id: 'secret-versioning',
        title: 'Secret Versioning & History',
        badge: 'History',
        summary: 'Audit timelines, diff comparisons, and instant rollback guarantees.',
        headline: 'Immutable Versioning & Rollback',
        subheadline: 'Inspect who updated values, compare historical changes, and roll back broken credentials instantly.',
        code: `# Inspect version history
secretvault secret history --project payment-api --name STRIPE_SECRET_KEY

# Roll back to version 2 (creates a new v4 pointing to v2 data)
secretvault secret rollback --project payment-api --name STRIPE_SECRET_KEY --target-version 2`,
        pillars: [
          {
            title: 'Monotonic Pointer Advancement',
            desc: 'Rolling back does not erase history; it creates a new version with the previous verified ciphertext.'
          },
          {
            title: 'Diff & Audit Correlation',
            desc: 'Every version links to the actor, IP address, timestamp, and audit event ID.'
          }
        ]
      },
      {
        id: 'branching-merging',
        title: 'Branching & Merge Conflicts',
        badge: 'Git-Like',
        summary: 'Feature branches for configuration with three-way merge conflict detection.',
        headline: 'Git-Like Secret Branching',
        subheadline: 'Create isolated secret branches for feature development and merge changes safely into main.',
        code: `# Create a feature branch for secrets
secretvault branch create feat/oauth-redesign

# Update secret on feature branch
secretvault secret set GOOGLE_CLIENT_ID "new_client_id" --branch feat/oauth-redesign

# Merge branch back into development main
secretvault branch merge feat/oauth-redesign --into main`,
        pillars: [
          {
            title: 'Three-Way Merge Detection',
            desc: 'Detects concurrent modifications and prompts for resolution rather than clobbering team values.'
          },
          {
            title: 'Ephemeral Lifecycles',
            desc: 'Delete feature branches cleanly once pull requests merge.'
          }
        ]
      },
      {
        id: 'environment-promotion',
        title: 'Environment Promotion',
        badge: 'Promotion',
        summary: 'Promote verified configuration from Development to Staging and Production.',
        headline: 'Environment Promotion Workflows',
        subheadline: 'Safely advance configuration sets across deployment tiers with target environment re-encryption.',
        code: `# Promote development secrets to staging
secretvault promote --from development --to staging --project auth-service

# Promote staging to production (triggers step-up MFA if required)
secretvault promote --from staging --to production --project auth-service --approval-id apr_90124`,
        pillars: [
          {
            title: 'Re-Encryption Boundary',
            desc: 'Promoting a secret re-encrypts the value under the destination environment DEK/KEK context.'
          },
          {
            title: 'AAD Integrity Check',
            desc: 'Ensures credentials cannot be cross-swapped between environments without re-encryption.'
          }
        ]
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // Category 4: CI/CD Integration
  // ---------------------------------------------------------------------------
  {
    id: 'ci-cd',
    title: 'CI/CD Integration',
    icon: 'cpu',
    badge: 'Automation',
    items: [
      {
        id: 'cicd-overview',
        title: 'CI/CD Automation Overview',
        badge: 'Overview',
        summary: 'Keyless pipeline authentication, runtime secret injection, and log masking.',
        headline: 'Zero-Secret CI/CD Pipelines',
        subheadline: 'Eliminate long-lived static tokens from your GitHub Actions and GitLab CI runners using ephemeral OIDC attestation.',
        pillars: [
          {
            title: 'Zero Permanent Tokens',
            desc: 'Runners authenticate using RFC 7519 OIDC JWT tokens minted by GitHub or GitLab.'
          },
          {
            title: 'Automatic Log Redaction',
            desc: 'CLI and runner wrappers redact all injected secrets from stdout/stderr logs automatically.'
          }
        ]
      },
      {
        id: 'machine-identities',
        title: 'Machine Identities & Service Tokens',
        badge: 'Service',
        summary: 'Headless service credentials with 600-second TTLs and strict IP restrictions.',
        headline: 'Machine Identities & Service Accounts',
        subheadline: 'Create scoped identities for automated daemon workloads, Kubernetes cron jobs, and Terraform runners.',
        code: `# Authenticate via machine token
export SECRETVLT_TOKEN="sv_machine_719a82b04f12..."
secretvault run --project backend-api --env production -- node worker.js`,
        pillars: [
          {
            title: 'Short Session TTL',
            desc: 'Machine identity sessions default to 600 seconds, strictly enforced server-side.'
          },
          {
            title: 'Instant Revocation',
            desc: 'Revoke any compromised machine token in one click via Console or REST API.'
          }
        ]
      },
      {
        id: 'github-actions',
        title: 'GitHub Actions (OIDC Keyless)',
        badge: 'Actions',
        summary: 'Inject production secrets into GitHub Actions workflows without permanent secrets.',
        headline: 'GitHub Actions Keyless Workflow',
        subheadline: 'Use GitHub ID tokens to exchange for ephemeral SecretVault access sessions in your build steps.',
        code: `name: Build & Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      id-token: write
      contents: read
    steps:
      - uses: actions/checkout@v4

      - name: Install SecretVault CLI
        run: npm install -g @secretvault/cli

      - name: Authenticate via GitHub OIDC
        run: |
          echo "$ACTIONS_ID_TOKEN_REQUEST_TOKEN" | secretvault auth oidc \\
            --provider-id github \\
            --machine-id runner-prod \\
            --token-stdin

      - name: Run Build with Injected Secrets
        run: secretvault run --env production -- npm run build`,
        pillars: [
          {
            title: 'Branch & Repo Scoping',
            desc: 'SecretVault verifies repo owner and branch name before issuing the ephemeral token.'
          },
          {
            title: 'Audit Attribution',
            desc: 'Every run records commit hash, workflow name, and runner IP in the tamper-evident audit log.'
          }
        ]
      },
      {
        id: 'gitlab-ci',
        title: 'GitLab CI Integration',
        badge: 'GitLab',
        summary: 'GitLab CI YAML configuration with CI_JOB_JWT attestation.',
        headline: 'GitLab CI Pipeline Integration',
        subheadline: 'Seamless integration with GitLab CI job tokens and container execution.',
        code: `deploy-staging:
  stage: deploy
  image: node:20-alpine
  id_tokens:
    SECRET_VAULT_JWT:
      aud: https://vault.company.com
  script:
    - npm install -g @secretvault/cli
    - echo "$SECRET_VAULT_JWT" | secretvault auth oidc --provider-id gitlab --machine-id gitlab-runner --token-stdin
    - secretvault run --env staging -- npm test`,
        pillars: [
          {
            title: 'Audience Validation',
            desc: 'Validates issuer and audience to block token reuse across non-matching projects.'
          }
        ]
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // Category 5: CLI Reference
  // ---------------------------------------------------------------------------
  {
    id: 'cli',
    title: 'CLI Reference',
    icon: 'terminal',
    badge: '101 cmds',
    items: [
      {
        id: 'cli-overview',
        title: 'CLI Overview & Installation',
        badge: '@secretvault/cli',
        summary: 'Executable syntax, npm and local build distribution, global options, environment variables, exit codes, and searchable command index.',
        headline: 'SecretVault CLI Reference (@secretvault/cli)',
        subheadline: 'The official developer CLI for local runtime injection, context switching, repository scanning, and zero-trust secrets governance.',
        isCliLanding: true,
        packageManagers: {
          npm: 'npm install -g @secretvault/cli',
          source: 'mvn clean package -DskipTests && node cli/bin/secretvault.js --help',
          link: 'cd cli && npm link && secretvault --version'
        },
        globalFlags: CLI_GLOBAL_FLAGS,
        exitCodes: CLI_EXIT_CODES
      },
      ...CLI_COMMAND_GROUPS.flatMap((group) =>
        group.commands
          .filter((cmd) => cmd.id !== 'cli-overview')
          .map((cmd) => ({
            ...cmd,
            title: cmd.name,
            badge: cmd.verificationStatus === 'Implemented and verified' ? 'Verified' : 'Incomplete',
            isCliCommand: true,
            cliGroupId: group.groupId,
            cliGroupTitle: group.groupTitle
          }))
      )
    ]
  },

  // ---------------------------------------------------------------------------
  // Category 6: VS Code Extension
  // ---------------------------------------------------------------------------
  {
    id: 'vscode',
    title: 'VS Code Extension',
    icon: 'code-xml',
    badge: 'IDE',
    items: [
      {
        id: 'vscode-overview',
        title: 'Extension Overview & Installation',
        badge: 'Extension',
        summary: 'VS Code Activity Bar explorer, secret auto-completion, and leak warnings.',
        headline: 'SecretVault for Visual Studio Code',
        subheadline: 'Inspect secrets, auto-complete environment variables, and block plaintext credential commits directly inside VS Code.',
        note: {
          type: 'info',
          title: 'Official Extension',
          text: 'Available from the VS Code Marketplace or loadable as an unpacked extension from /vscode-extension.'
        },
        code: `# Install via VS Code Command Palette
ext install SecretVault.secretvault-vscode

# Or launch directly from command line
code --install-extension vscode-extension/secretvault.vsix`,
        pillars: [
          {
            title: 'Activity Bar Explorer',
            desc: 'Browse workspaces, projects, environments, and secret metadata without switching windows.'
          },
          {
            title: 'Pre-Commit Leak Warning',
            desc: 'High-entropy credential scanner alerts you before you stage or commit sensitive tokens.'
          }
        ]
      },
      {
        id: 'vscode-features',
        title: 'Autocomplete & Commands',
        badge: 'Features',
        summary: 'Intelligent code completion for process.env and System.getenv().',
        headline: 'Intelligent IDE Autocomplete',
        subheadline: 'Rich hover cards and autocompletions for JavaScript, TypeScript, Python, and Java codebases.',
        code: `// TypeScript Autocomplete:
process.env.DB_PASSWORD // Hover: [SecretVault: dev] (Updated: 2h ago by alice)

// Java Autocomplete:
System.getenv("STRIPE_KEY") // Hover: [SecretVault: dev] (Version 3)`,
        pillars: [
          {
            title: 'secretvault.login',
            desc: 'Authenticate with the control plane server URL directly from the command palette.'
          },
          {
            title: 'secretvault.sync',
            desc: 'Trigger cloud synchronization and drift detection scans in one click.'
          }
        ]
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // Category 7: Security Features
  // ---------------------------------------------------------------------------
  {
    id: 'security',
    title: 'Security Features',
    icon: 'shield',
    badge: '15 Topics',
    items: SECURITY_PAGES
  },

  // ---------------------------------------------------------------------------
  // Category 8: Integrations
  // ---------------------------------------------------------------------------
  {
    id: 'integrations',
    title: 'Integrations',
    icon: 'cloud',
    badge: '8 Guides',
    items: INTEGRATIONS_PAGES
  },

  // ---------------------------------------------------------------------------
  // Category 9: Client SDKs & REST API
  // ---------------------------------------------------------------------------
  {
    id: 'sdks',
    title: 'Client SDKs & REST API',
    icon: 'package',
    badge: 'SDK & API',
    items: SDK_AND_API_PAGES
  },

  // ---------------------------------------------------------------------------
  // Category 10: Tutorials
  // ---------------------------------------------------------------------------
  {
    id: 'tutorials',
    title: 'Tutorials',
    icon: 'book-open',
    badge: 'Guides',
    items: [
      {
        id: 'tut-first-workspace',
        title: 'Build Your First Workspace',
        badge: 'Beginner',
        summary: 'Step-by-step walkthrough to register, create a project, and store your first secret.',
        headline: 'Tutorial: Build Your First SecretVault Workspace',
        subheadline: 'Step-by-step guide to provisioning your organization, inviting a collaborator, and storing encrypted credentials.',
        steps: [
          {
            number: '1',
            title: 'Sign Up & Organization Creation',
            desc: 'Navigate to http://localhost:3000/register and create an account. Your organization and default workspace are provisioned instantly.'
          },
          {
            number: '2',
            title: 'Create Your First Project',
            desc: 'Click "New Project" in the console. Enter "Billing Service". Development, staging, and production tiers are created automatically.'
          },
          {
            number: '3',
            title: 'Add a Secret',
            desc: 'Select the Development tier, click "New Secret", and enter STRIPE_SECRET_KEY. The value is immediately encrypted via AES-256-GCM.'
          },
          {
            number: '4',
            title: 'Run with the CLI',
            desc: 'Execute secretvault run --env development -- npm run dev to verify memory-only injection.'
          }
        ]
      },
      {
        id: 'tut-branch-promote',
        title: 'Branch, Test & Promote Secrets',
        badge: 'Intermediate',
        summary: 'Create a feature branch, verify in staging, and promote to production.',
        headline: 'Tutorial: Branching and Promoting Secrets',
        subheadline: 'Learn how to test new API keys on a development branch before promoting them to production with approval.',
        code: `# 1. Create feature branch
secretvault branch create feat/new-auth-provider

# 2. Set new OAuth client ID on branch
secretvault secret set OAUTH_CLIENT_ID "client_test_9012" --branch feat/new-auth-provider

# 3. Merge branch into development
secretvault branch merge feat/new-auth-provider --into main

# 4. Promote to production
secretvault promote --from staging --to production --project auth-service`,
        pillars: [
          {
            title: 'Safe Validation',
            desc: 'Avoid breaking production by testing branch values in isolated development environments first.'
          }
        ]
      },
      {
        id: 'tut-jit-breakglass',
        title: 'Request & Approve JIT Access',
        badge: 'Security',
        summary: 'Request temporary break-glass access to a production database URL during an outage.',
        headline: 'Tutorial: Requesting Emergency JIT Access',
        subheadline: 'Simulate an incident scenario and request time-limited, audited reveal access for troubleshooting.',
        code: `# Developer requests 30-minute access
POST /api/v1/workspaces/{id}/jit-requests
{
  "projectId": "payment-api",
  "environmentId": "production",
  "durationMinutes": 30,
  "justification": "Incident INC-901: payment webhook failure"
}

# Admin approves request
POST /api/v1/workspaces/{id}/jit-requests/{reqId}/approve`,
        pillars: [
          {
            title: 'Zero Standing Privileges',
            desc: 'Access automatically revokes when the 30-minute timer expires.'
          }
        ]
      },
      {
        id: 'tut-spring-boot',
        title: 'Spring Boot 3.x Starter Integration',
        badge: 'Java',
        summary: 'Integrate the SecretVault starter into a real Spring Boot 3 application.',
        headline: 'Tutorial: Spring Boot 3 Integration',
        subheadline: 'Connect your Spring Boot microservices to SecretVault with dynamic properties and zero local config files.',
        code: `@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}

// In application.yml:
secretvault:
  api-url: http://localhost:8080/api/v1
  project: core-service
  environment: production`,
        pillars: [
          {
            title: 'Auto-Configuration',
            desc: 'Spring Boot automatically registers SecretVaultPropertySource during bootstrap.'
          }
        ]
      }
    ]
  }
];

const LEGACY_ALIASES = {
  'security-overview': 'sec-overview',
  'envelope-encryption': 'sec-envelope-encryption',
  'jit-access': 'sec-jit-access',
  'audit-logging': 'sec-audit-logging',
  'repository-scanning': 'sec-repo-scanning',
  'integrations-overview': 'int-overview',
  'vercel-integration': 'int-vercel',
  'render-integration': 'int-render',
  'rest-api': 'rest-api-overview',
  'sdk-overview': 'sdk-overview-page',
  'sdk-java': 'sdk-java-guide',
  'sdk-node': 'sdk-node-guide',
  'sdk-python': 'sdk-python-guide'
};

// Helper utility: look up any doc item by ID across all 10 categories
export const findDocItemById = (itemId) => {
  const targetId = LEGACY_ALIASES[itemId] || itemId;
  for (const group of DOCS_GROUPS) {
    const item = group.items.find((it) => it.id === targetId);
    if (item) {
      return { item, group };
    }
  }
  // Default fallback to first item of first group
  return {
    item: DOCS_GROUPS[0].items[0],
    group: DOCS_GROUPS[0]
  };
};
