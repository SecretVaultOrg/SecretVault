// =============================================================================
// SecretVault REST API & Client SDKs Complete Reference Data Model
// Grounded strictly in Spring Boot controllers, DTOs, and SDK modules.
// =============================================================================

export const REST_API_OVERVIEW = {
  baseUrl: 'http://localhost:8080/api/v1',
  authHeader: 'Authorization: Bearer <jwt-or-machine-token>',
  workspaceHeader: 'X-Workspace-ID: <uuid>',
  responseEnvelope: `{
  "success": true,
  "data": { ... },
  "message": "Operation successful",
  "timestamp": "2026-10-13T12:00:00.000Z"
}`,
  errorEnvelope: `{
  "status": 400,
  "code": "INVALID_REQUEST",
  "message": "Field 'name' cannot be blank",
  "requestId": "req_84920ab4"
}`,
  rateLimitHeaders: [
    { header: 'X-RateLimit-Limit', desc: 'Maximum requests allowed within the current window.' },
    { header: 'X-RateLimit-Remaining', desc: 'Remaining request allowance within the active window.' },
    { header: 'Retry-After', desc: 'Seconds to wait before retrying when HTTP 429 Too Many Requests is returned.' }
  ]
};

export const REST_API_ENDPOINTS = [
  // ---------------------------------------------------------------------------
  // 1. Authentication & Identity
  // ---------------------------------------------------------------------------
  {
    id: 'api-auth-login',
    group: 'Authentication & Identity',
    method: 'POST',
    path: '/api/v1/auth/login',
    summary: 'Authenticate user with email and password to receive a signed JWT token.',
    auth: 'None (Public endpoint)',
    rateLimit: '5 requests / 60s per IP (Brute-force protection)',
    requestSchema: `{
  "email": "developer@acme.com",
  "password": "REPLACE_WITH_TEST_PASSWORD"
}`,
    responseSchema: `{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsIn...",
    "tokenType": "Bearer",
    "expiresIn": 86400,
    "user": {
      "id": "u_948192a0-492a-4bc3-b102-482019481029",
      "email": "developer@acme.com",
      "fullName": "Alice Engineer"
    }
  },
  "message": "Authentication successful",
  "timestamp": "2026-10-13T12:00:00.000Z"
}`,
    statusCodes: [
      { code: 200, desc: 'Authentication successful, JWT minted.' },
      { code: 400, desc: 'Invalid credentials or request validation failure.' },
      { code: 429, desc: 'Rate limit exceeded (Too Many Requests).' }
    ]
  },
  {
    id: 'api-auth-refresh',
    group: 'Authentication & Identity',
    method: 'POST',
    path: '/api/v1/auth/refresh',
    summary: 'Refresh an expired access token using a valid session cookie or refresh token.',
    auth: 'Bearer Token (Session ID)',
    requestSchema: `{
  "refreshToken": "ref_84920ab40921"
}`,
    responseSchema: `{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsIn...",
    "expiresIn": 86400
  },
  "message": "Token refreshed successfully",
  "timestamp": "2026-10-13T12:00:00.000Z"
}`,
    statusCodes: [
      { code: 200, desc: 'New access token issued.' },
      { code: 401, desc: 'Session revoked or expired.' }
    ]
  },
  {
    id: 'api-auth-logout',
    group: 'Authentication & Identity',
    method: 'POST',
    path: '/api/v1/auth/logout',
    summary: 'Terminate active session and blacklist token in Redis distributed cache.',
    auth: 'Bearer JWT',
    requestSchema: `{}`,
    responseSchema: `{
  "success": true,
  "data": null,
  "message": "Successfully logged out",
  "timestamp": "2026-10-13T12:00:00.000Z"
}`,
    statusCodes: [
      { code: 200, desc: 'Session terminated.' }
    ]
  },

  // ---------------------------------------------------------------------------
  // 2. Secret Lifecycle & Reveal
  // ---------------------------------------------------------------------------
  {
    id: 'api-secrets-list',
    group: 'Secret Management',
    method: 'GET',
    path: '/api/v1/workspaces/{workspaceId}/projects/{projectId}/environments/{environmentId}/secrets',
    summary: 'List secret metadata in an environment (never returns plaintext values).',
    auth: 'Bearer JWT / Machine Token',
    permissions: 'MEMBER, ADMIN, or OWNER',
    pathParams: [
      { name: 'workspaceId', type: 'UUID', required: true, desc: 'Target workspace identifier.' },
      { name: 'projectId', type: 'UUID', required: true, desc: 'Target project identifier.' },
      { name: 'environmentId', type: 'UUID', required: true, desc: 'Environment tier (dev, staging, production).' }
    ],
    queryParams: [
      { name: 'search', type: 'String', required: false, desc: 'Fuzzy filter by secret key name.' },
      { name: 'status', type: 'String', required: false, desc: 'ACTIVE, DEPRECATED, or ROTATION_PENDING.' }
    ],
    responseSchema: `{
  "success": true,
  "data": [
    {
      "id": "s_849102-9481-4bc3-9182-491029481029",
      "key": "DATABASE_URL",
      "version": 4,
      "status": "ACTIVE",
      "updatedAt": "2026-10-13T10:45:00.000Z",
      "updatedBy": "u_alice",
      "comment": "Rotated connection string with SSL enforce"
    }
  ],
  "message": "Operation successful",
  "timestamp": "2026-10-13T12:00:00.000Z"
}`,
    statusCodes: [
      { code: 200, desc: 'Secrets list retrieved successfully.' },
      { code: 403, desc: 'Insufficient workspace permissions.' },
      { code: 404, desc: 'Project or environment not found.' }
    ]
  },
  {
    id: 'api-secrets-create',
    group: 'Secret Management',
    method: 'POST',
    path: '/api/v1/workspaces/{workspaceId}/projects/{projectId}/environments/{environmentId}/secrets',
    summary: 'Create a new secret, generating a fresh 256-bit DEK and persisting version 1.',
    auth: 'Bearer JWT / Machine Token',
    permissions: 'MEMBER, ADMIN, or OWNER',
    requestSchema: `{
  "key": "STRIPE_SECRET_KEY",
  "value": "sk_test_REPLACE_WITH_TEST_KEY",
  "comment": "Stripe test sandbox secret key"
}`,
    responseSchema: `{
  "success": true,
  "data": {
    "id": "s_948102-1829-4ab2-b819-581928491024",
    "key": "STRIPE_SECRET_KEY",
    "version": 1,
    "status": "ACTIVE",
    "createdAt": "2026-10-13T12:00:00.000Z"
  },
  "message": "Secret created successfully",
  "timestamp": "2026-10-13T12:00:00.000Z"
}`,
    statusCodes: [
      { code: 201, desc: 'Secret created and encrypted with fresh DEK.' },
      { code: 400, desc: 'Secret key already exists in this environment.' },
      { code: 403, desc: 'Insufficient permissions or environment is protected.' }
    ]
  },
  {
    id: 'api-secrets-reveal',
    group: 'Secret Management',
    method: 'POST',
    path: '/api/v1/workspaces/{workspaceId}/projects/{projectId}/environments/{environmentId}/secrets/{secretId}/reveal',
    summary: 'Explicitly decrypts secret value in server memory and returns it to authorized client.',
    auth: 'Bearer JWT (Requires Step-Up MFA or JIT Grant for production)',
    rateLimit: '60 requests / 60s per user (Fail-closed)',
    headers: [
      { name: 'X-Step-Up-Proof', type: 'String', required: false, desc: 'Step-up challenge proof if accessing protected production secret.' },
      { name: 'X-Reveal-Intent-Token', type: 'String', required: false, desc: 'Short-lived single-use reveal intent token.' }
    ],
    requestSchema: `{
  "reason": "Debugging incident INC-8491 database connection timeout"
}`,
    responseSchema: `{
  "success": true,
  "data": {
    "id": "s_849102-9481-4bc3-9182-491029481029",
    "key": "DATABASE_URL",
    "version": 4,
    "value": "postgres://user:REPLACE_PASS@db.acme.internal:5432/prod",
    "decryptedAt": "2026-10-13T12:00:00.000Z"
  },
  "message": "Secret decrypted successfully in memory",
  "timestamp": "2026-10-13T12:00:00.000Z"
}`,
    statusCodes: [
      { code: 200, desc: 'Secret decrypted successfully. Audit log emitted.' },
      { code: 401, desc: 'Step-up authentication required for protected tier.' },
      { code: 403, desc: 'Reveal denied: active JIT grant required.' },
      { code: 429, desc: 'Reveal rate limit exceeded.' }
    ]
  },
  {
    id: 'api-secrets-versions',
    group: 'Secret Management',
    method: 'GET',
    path: '/api/v1/workspaces/{workspaceId}/projects/{projectId}/environments/{environmentId}/secrets/{secretId}/versions',
    summary: 'Retrieve historical immutable version ledger for a secret.',
    auth: 'Bearer JWT',
    responseSchema: `{
  "success": true,
  "data": [
    { "version": 4, "createdAt": "2026-10-13T10:00:00.000Z", "createdBy": "u_alice", "comment": "Rotated key" },
    { "version": 3, "createdAt": "2026-10-01T08:30:00.000Z", "createdBy": "u_bob", "comment": "Updated host" },
    { "version": 2, "createdAt": "2026-09-15T14:10:00.000Z", "createdBy": "u_bob", "comment": "Initial staging" },
    { "version": 1, "createdAt": "2026-09-01T09:00:00.000Z", "createdBy": "u_alice", "comment": "Created" }
  ],
  "message": "Operation successful",
  "timestamp": "2026-10-13T12:00:00.000Z"
}`,
    statusCodes: [
      { code: 200, desc: 'Version history returned.' }
    ]
  },
  {
    id: 'api-secrets-rollback',
    group: 'Secret Management',
    method: 'POST',
    path: '/api/v1/workspaces/{workspaceId}/projects/{projectId}/environments/{environmentId}/secrets/{secretId}/rollback',
    summary: 'Roll back a secret to a previously recorded version, creating a new head version.',
    auth: 'Bearer JWT',
    permissions: 'ADMIN or OWNER',
    requestSchema: `{
  "targetVersion": 2,
  "reason": "Reverting broken third-party API key after payment gateway regression"
}`,
    responseSchema: `{
  "success": true,
  "data": {
    "id": "s_849102-9481-4bc3-9182-491029481029",
    "key": "DATABASE_URL",
    "version": 5,
    "rolledBackFromVersion": 2,
    "status": "ACTIVE"
  },
  "message": "Rollback successful",
  "timestamp": "2026-10-13T12:00:00.000Z"
}`,
    statusCodes: [
      { code: 200, desc: 'Secret rolled back successfully.' },
      { code: 400, desc: 'Target version does not exist.' }
    ]
  },

  // ---------------------------------------------------------------------------
  // 3. Just-in-Time (JIT) Privileged Access
  // ---------------------------------------------------------------------------
  {
    id: 'api-jit-submit',
    group: 'Privileged Access (JIT)',
    method: 'POST',
    path: '/api/v1/workspaces/{workspaceId}/jit-requests',
    summary: 'Submit a dual-custody request for temporary break-glass access to protected secrets.',
    auth: 'Bearer JWT',
    requestSchema: `{
  "projectId": "p_8491029481",
  "environmentId": "e_prod_8491",
  "durationMinutes": 60,
  "justification": "Incident INC-8491: Diagnosing webhook processing outage",
  "permissions": ["SECRET_READ", "SECRET_REVEAL"]
}`,
    responseSchema: `{
  "success": true,
  "data": {
    "requestId": "jit_req_948102948102",
    "status": "PENDING",
    "durationMinutes": 60,
    "submittedBy": "u_developer",
    "createdAt": "2026-10-13T12:00:00.000Z"
  },
  "message": "JIT access request submitted for review",
  "timestamp": "2026-10-13T12:00:00.000Z"
}`,
    statusCodes: [
      { code: 201, desc: 'Request submitted, pending dual approval.' },
      { code: 400, desc: 'Duration exceeds workspace policy limit (max 240 mins).' }
    ]
  },
  {
    id: 'api-jit-approve',
    group: 'Privileged Access (JIT)',
    method: 'POST',
    path: '/api/v1/workspaces/{workspaceId}/jit-requests/{requestId}/approve',
    summary: 'Approve a pending JIT request (Dual-custody: requester cannot self-approve).',
    auth: 'Bearer JWT',
    permissions: 'ADMIN or OWNER',
    requestSchema: `{
  "approvalComment": "Approved for emergency triage during INC-8491"
}`,
    responseSchema: `{
  "success": true,
  "data": {
    "requestId": "jit_req_948102948102",
    "status": "ACTIVE",
    "expiresAt": "2026-10-13T13:00:00.000Z"
  },
  "message": "JIT access approved and lease activated",
  "timestamp": "2026-10-13T12:00:00.000Z"
}`,
    statusCodes: [
      { code: 200, desc: 'Lease activated in Redis.' },
      { code: 403, desc: 'Separation of duties violation: requester cannot approve own request.' }
    ]
  },
  {
    id: 'api-jit-revoke',
    group: 'Privileged Access (JIT)',
    method: 'POST',
    path: '/api/v1/workspaces/{workspaceId}/jit-requests/{requestId}/revoke',
    summary: 'Immediately revoke an active JIT lease, terminating all child tokens.',
    auth: 'Bearer JWT',
    permissions: 'ADMIN or OWNER',
    requestSchema: `{
  "reason": "Incident investigation concluded"
}`,
    responseSchema: `{
  "success": true,
  "data": {
    "requestId": "jit_req_948102948102",
    "status": "REVOKED",
    "revokedAt": "2026-10-13T12:45:00.000Z"
  },
  "message": "JIT grant revoked immediately",
  "timestamp": "2026-10-13T12:45:00.000Z"
}`,
    statusCodes: [
      { code: 200, desc: 'Lease revoked.' }
    ]
  },

  // ---------------------------------------------------------------------------
  // 4. Provider Synchronization & Drift API
  // ---------------------------------------------------------------------------
  {
    id: 'api-sync-dry-run',
    group: 'Sync & Integrations',
    method: 'POST',
    path: '/api/v1/sync/dry-run',
    summary: 'Simulate synchronization plan without mutating external provider state.',
    auth: 'Bearer JWT',
    permissions: 'ADMIN or OWNER',
    requestSchema: `{
  "workspaceId": "c2e91df2-f2ef-43ca-9314-6d7b3a4ffd7b",
  "integrationId": "int_vercel_849102",
  "projectId": "p_billing_api",
  "environmentId": "e_prod"
}`,
    responseSchema: `{
  "success": true,
  "data": {
    "dryRun": true,
    "actions": [
      { "secretName": "DATABASE_URL", "action": "UPDATE", "reason": "Fingerprint mismatch" },
      { "secretName": "STRIPE_KEY", "action": "CREATE", "reason": "Missing on provider" }
    ],
    "totalModifications": 2
  },
  "message": "Dry-run simulation completed",
  "timestamp": "2026-10-13T12:00:00.000Z"
}`,
    statusCodes: [
      { code: 200, desc: 'Dry run completed successfully.' }
    ]
  },
  {
    id: 'api-drift-list',
    group: 'Sync & Integrations',
    method: 'GET',
    path: '/api/v1/drift/records',
    summary: 'List detected configuration drift records across provider mappings.',
    auth: 'Bearer JWT',
    queryParams: [
      { name: 'workspaceId', type: 'UUID', required: true, desc: 'Target workspace identifier.' },
      { name: 'driftType', type: 'String', required: false, desc: 'MISSING_FROM_PROVIDER, VALUE_MISMATCH, etc.' }
    ],
    responseSchema: `{
  "success": true,
  "data": [
    {
      "id": "dr_849102-9481",
      "secretName": "DATABASE_URL",
      "driftType": "VALUE_MISMATCH",
      "severity": "CRITICAL",
      "status": "OPEN",
      "detectedAt": "2026-10-13T11:20:00.000Z",
      "message": "External provider fingerprint diverges from desired state"
    }
  ],
  "message": "Operation successful",
  "timestamp": "2026-10-13T12:00:00.000Z"
}`,
    statusCodes: [
      { code: 200, desc: 'Drift records retrieved.' }
    ]
  },

  // ---------------------------------------------------------------------------
  // 5. Audit & Security Operations API
  // ---------------------------------------------------------------------------
  {
    id: 'api-audit-events',
    group: 'Audit & Webhooks',
    method: 'GET',
    path: '/api/v1/workspaces/{workspaceId}/audit-events',
    summary: 'Query immutable append-only audit trail logs with filtering by actor, event type, and date range.',
    auth: 'Bearer JWT',
    permissions: 'MEMBER (own actions), ADMIN, or OWNER',
    queryParams: [
      { name: 'eventType', type: 'String', required: false, desc: 'e.g. SECRET_REVEALED, JIT_APPROVED, ROTATION_COMPLETED.' },
      { name: 'limit', type: 'Integer', required: false, default: '50', desc: 'Number of records per page.' }
    ],
    responseSchema: `{
  "success": true,
  "data": [
    {
      "id": "evt_94810294819",
      "eventType": "SECRET_REVEALED",
      "actorEmail": "alice@acme.com",
      "ipAddress": "192.0.2.1",
      "resourceName": "DATABASE_URL",
      "timestamp": "2026-10-13T12:00:00.000Z",
      "details": { "justification": "Debugging connection timeout" }
    }
  ],
  "message": "Operation successful",
  "timestamp": "2026-10-13T12:00:00.000Z"
}`,
    statusCodes: [
      { code: 200, desc: 'Audit events returned.' }
    ]
  },
  {
    id: 'api-findings-remediate',
    group: 'Security Operations',
    method: 'POST',
    path: '/api/v1/security/findings/{findingId}/remediate',
    summary: 'Trigger automated remediation (shadow rotation or instant revocation) for a leaked secret finding.',
    auth: 'Bearer JWT',
    permissions: 'ADMIN or OWNER',
    requestSchema: `{
  "remediationStrategy": "SHADOW_ROTATE",
  "comment": "Automated remediation triggered following detected Git commit leak"
}`,
    responseSchema: `{
  "success": true,
  "data": {
    "findingId": "find_849102948192",
    "status": "REMEDIATING",
    "newVersion": 5,
    "strategy": "SHADOW_ROTATE"
  },
  "message": "Remediation workflow initiated",
  "timestamp": "2026-10-13T12:00:00.000Z"
}`,
    statusCodes: [
      { code: 200, desc: 'Remediation workflow initiated.' },
      { code: 404, desc: 'Finding not found.' }
    ]
  }
];

export const CLIENT_SDKS_CATALOG = [
  {
    id: 'sdk-java-core',
    name: 'Java SDK (Core)',
    artifact: 'io.secretvault:secretvault-sdk-core:1.0.0',
    language: 'Java 17+',
    repoPath: 'sdk/secretvault-sdk-core',
    features: [
      'Pure Java 17+ with zero external network dependencies',
      'AES-256-GCM local envelope decryption',
      'Thread-safe in-memory cache with volatile zeroization',
      'Circuit breaker with exponential backoff retry'
    ],
    quickstart: `// Initialize Client
SecretVaultClient client = SecretVaultClient.builder()
    .endpoint("http://localhost:8080")
    .workspace("acme-corp")
    .project("payment-service")
    .environment("production")
    .token(System.getenv("SECRETVault_TOKEN"))
    .cacheTtl(Duration.ofMinutes(5))
    .build();

// Fetch Secret
Secret secret = client.secrets().get("DATABASE_URL");
System.out.println("Secret value: " + secret.getValue());

// Close client on shutdown
client.close();`
  },
  {
    id: 'sdk-spring-boot',
    name: 'Spring Boot 3.x Starter',
    artifact: 'io.secretvault:secretvault-spring-boot-starter:1.0.0',
    language: 'Java / Spring Boot 3.x',
    repoPath: 'sdk/secretvault-spring-boot-starter',
    features: [
      '@SecretVaultValue annotation with hot-reloading',
      'Spring Environment PropertySource integration (${...})',
      'Actuator health indicators (/actuator/health/secretvault)',
      'Fail-safe fallback in-memory cache'
    ],
    quickstart: `# application.yml
secretvault:
  endpoint: "http://localhost:8080"
  workspace: "acme-corp"
  project: "payment-service"
  environment: "production"
  authentication:
    token: "\${SECRETVault_TOKEN}"
  cache:
    enabled: true
    ttl-seconds: 300

// In Java Component:
@Component
public class PaymentGateway {
    @SecretVaultValue(value = "STRIPE_SECRET_KEY", autoRefresh = true)
    private volatile String stripeKey;
}`
  },
  {
    id: 'sdk-js',
    name: 'JavaScript / TypeScript SDK',
    artifact: '@secretvault/sdk',
    language: 'Node.js 18+ / TypeScript',
    repoPath: 'sdk/secretvault-sdk-js',
    features: [
      'Node 18+ native fetch, zero third-party dependencies',
      'In-memory TTL cache with fail-open stale resilience',
      'Dynamic watch() rotation event listener',
      'Full TypeScript declarations and IntelliSense support'
    ],
    quickstart: `import { SecretVaultClient } from '@secretvault/sdk';

const vault = new SecretVaultClient({
  endpoint: 'http://localhost:8080',
  workspace: 'acme-corp',
  project: 'payment-service',
  environment: 'production',
  token: process.env.SECRETVault_TOKEN,
  cache: { ttlSec: 60 },
  failOpenStale: true
});

// Fetch Secret
const dbPassword = await vault.secrets.get('DB_PASSWORD');
console.log(\`DB Password: \${dbPassword.value}\`);

// Watch Dynamic Rotation
vault.secrets.watch('JWT_SECRET', (newSecret) => {
  console.log(\`Rotated to v\${newSecret.versionNumber}\`);
});`
  },
  {
    id: 'sdk-python',
    name: 'Python Client SDK',
    artifact: 'secretvault',
    language: 'Python 3.10+',
    repoPath: 'sdk/secretvault-sdk-python',
    features: [
      'Standard library only (urllib), zero external dependencies',
      'Thread-safe TTL caching with lock synchronization',
      'Dynamic watch() rotation callback polling',
      'Automatic os.environ memory injection'
    ],
    quickstart: `from secretvault import SecretVaultClient
import os

vault = SecretVaultClient(
    endpoint="http://localhost:8080",
    workspace="acme-corp",
    project="payment-service",
    environment="production",
    token=os.getenv("SECRETVault_TOKEN"),
    cache_ttl_sec=60.0,
    fail_open_stale=True
)

db_password = vault.secrets.get("DB_PASSWORD")
print(f"DB Password: {db_password.value}")

# Watch Rotation
vault.secrets.watch("JWT_SECRET", lambda s: print(f"Rotated to v{s.version_number}"))`
  }
];

export const SDK_AND_API_PAGES = [
  {
    id: 'rest-api-overview',
    title: 'REST API Overview & Architecture',
    badge: 'OpenAPI',
    subgroup: 'REST API Reference',
    summary: 'Base URL, authentication headers, error envelopes, rate limits, and pagination.',
    headline: 'SecretVault REST API & OpenAPI Specification',
    subheadline: 'Enterprise REST API surface for programmatic secret management, JIT governance, and integration sync.',
    isRestApiLanding: true,
    pillars: [
      {
        title: 'Strict Envelope Pattern',
        desc: 'All 200/201 responses wrap payloads in ApiResponse<T> with success flag and timestamp. Errors wrap in ErrorResponse with machine codes.'
      },
      {
        title: 'Zero Plaintext in Standard Responses',
        desc: 'GET /secrets returns metadata only. Plaintext values require explicit POST /reveal with audit reasoning.'
      },
      {
        title: 'Contextual Multi-Tenancy',
        desc: 'All endpoints enforce URL workspace IDs matching X-Workspace-ID headers and JWT subject claims.'
      }
    ]
  },
  {
    id: 'rest-api-endpoints',
    title: 'Interactive REST API Reference',
    badge: 'Endpoints',
    subgroup: 'REST API Reference',
    summary: 'Searchable directory of all implemented Spring Boot endpoints with request & response schemas.',
    headline: 'Interactive REST API Endpoint Explorer',
    subheadline: 'Browse and inspect live route signatures, permissions, rate limits, and sample payloads.',
    isEndpointsExplorer: true
  },
  {
    id: 'sdk-overview-page',
    title: 'Client SDK Architecture & Standards',
    badge: 'Architecture',
    subgroup: 'Client SDKs',
    summary: 'Design principles, caching, fail-safe resilience, and Server-Sent Event watchers across SDKs.',
    headline: 'Client SDK Architecture & Resilience Engineering',
    subheadline: 'High-performance runtime client libraries designed for zero-latency secrets resolution in production.',
    isSdkLanding: true,
    pillars: [
      {
        title: 'Volatile RAM Caching',
        desc: 'Decrypted values live in volatile memory with configurable TTLs. Decrypted byte arrays are zeroized on cache eviction.'
      },
      {
        title: 'Fail-Safe Stale Fallback',
        desc: 'If the SecretVault control plane is temporarily unreachable, SDKs serve stale cached credentials rather than failing application bootstrap.'
      },
      {
        title: 'Live Dynamic Rotation Watchers',
        desc: 'Applications subscribe to rotation events via watch() listeners without requiring service restart or redeployment.'
      }
    ]
  },
  {
    id: 'sdk-java-guide',
    title: 'Java SDK & Spring Boot 3 Starter Guide',
    badge: 'Java 17+',
    subgroup: 'Client SDKs',
    summary: 'Integration guide for io.secretvault:secretvault-spring-boot-starter with @SecretVaultValue.',
    headline: 'Java SDK & Spring Boot 3.x Starter Deep Dive',
    subheadline: 'First-class Spring Boot starter with PropertySource binding and dynamic hot-reloading.',
    code: `// pom.xml
<dependency>
    <groupId>io.secretvault</groupId>
    <artifactId>secretvault-spring-boot-starter</artifactId>
    <version>1.0.0</version>
</dependency>

// In Spring Boot:
@RestController
public class CheckoutController {

    @SecretVaultValue(value = "STRIPE_SECRET_KEY", autoRefresh = true)
    private volatile String stripeKey;

    @GetMapping("/checkout")
    public String checkout() {
        // stripeKey is always updated in memory when rotated!
        return "Using key: " + stripeKey.substring(0, 8) + "...";
    }
}`,
    pillars: [
      {
        title: '@SecretVaultValue Hot-Reloading',
        desc: 'Annotate fields with @SecretVaultValue(autoRefresh = true). Background listener updates field references via reflection upon rotation.'
      },
      {
        title: 'Spring PropertySource Integration',
        desc: 'Standard ${vault.secret.MY_KEY} expressions resolve directly against the SecretVault client in application.yml.'
      }
    ]
  },
  {
    id: 'sdk-node-guide',
    title: 'Node.js & TypeScript SDK Guide',
    badge: '@secretvault/sdk',
    subgroup: 'Client SDKs',
    summary: 'Integration guide for @secretvault/sdk in Node.js 18+, Express, Next.js, and NestJS.',
    headline: 'JavaScript & TypeScript Client SDK (@secretvault/sdk)',
    subheadline: 'Lightweight zero-dependency client with native fetch and TypeScript definitions.',
    code: `import { SecretVaultClient } from '@secretvault/sdk';

const vault = new SecretVaultClient({
  endpoint: process.env.SECRETVault_URL || 'http://localhost:8080',
  workspace: 'production-org',
  project: 'order-api',
  environment: 'production',
  token: process.env.SECRETVault_TOKEN,
  cache: { ttlSec: 60 }
});

export async function getDbConnectionString(): Promise<string> {
  const secret = await vault.secrets.get('DATABASE_URL');
  return secret.value;
}`,
    pillars: [
      {
        title: 'Native Fetch (Zero Dependencies)',
        desc: 'No axios or third-party HTTP clients. Uses Node.js 18+ global fetch for minimal bundle overhead.'
      },
      {
        title: 'Full TypeScript Types',
        desc: 'Strict type definitions for Secret, SecretMetadata, and RotationEvent payload objects.'
      }
    ]
  },
  {
    id: 'sdk-python-guide',
    title: 'Python Client SDK Guide',
    badge: 'Python 3.10+',
    subgroup: 'Client SDKs',
    summary: 'Integration guide for secretvault in FastAPI, Django, Flask, and Celery.',
    headline: 'Python Client SDK (secretvault)',
    subheadline: 'Zero-dependency Python client with thread-safe caching and os.environ injection.',
    code: `import os
from secretvault import SecretVaultClient

vault = SecretVaultClient(
    endpoint=os.getenv("SECRETVault_URL", "http://localhost:8080"),
    workspace="production-org",
    project="order-api",
    environment="production",
    token=os.getenv("SECRETVault_TOKEN"),
    cache_ttl_sec=120.0
)

# Fetch secret value
stripe_key = vault.secrets.get("STRIPE_SECRET_KEY").value

# Inject into os.environ for libraries expecting environment variables:
vault.inject_into_environ()`,
    pillars: [
      {
        title: 'Standard Library Only',
        desc: 'Uses urllib.request and threading locks. Zero external PyPI dependencies needed.'
      },
      {
        title: 'os.environ Memory Injection',
        desc: 'Injects decrypted secrets straight into process memory without creating temporary files.'
      }
    ]
  }
];

export const findApiOrSdkPageById = (id) => {
  return SDK_AND_API_PAGES.find((p) => p.id === id) || null;
};
