// =============================================================================
// SecretVault Verified Security Features Data Model
// Grounded strictly in repository cryptography, auth, JIT, outbox, and audit code.
// =============================================================================

export const SECURITY_PAGES = [
  // ---------------------------------------------------------------------------
  // 1. Security Overview & Architecture
  // ---------------------------------------------------------------------------
  {
    id: 'sec-overview',
    title: 'Security Overview & Posture',
    badge: 'Overview',
    subgroup: 'Overview & Architecture',
    summary: 'Zero-trust cryptographic secrets fabric, defense-in-depth, and posture monitoring.',
    headline: 'Zero-Trust Secrets Governance & Cryptographic Architecture',
    subheadline: 'SecretVault is engineered to eliminate plaintext secrets sprawl across developers, CI/CD runners, and production infrastructure through envelope encryption and RAM-only injection.',
    note: {
      type: 'info',
      title: 'Zero Plaintext Disk Writes',
      text: 'SecretVault never writes plaintext secret values to local storage or intermediate files. Application processes receive credentials via protected environment memory blocks.'
    },
    tags: [
      'AES-256-GCM + AAD Binding',
      'Ephemeral 256-bit DEKs',
      'KMS KEK Key Wrapping (RFC 3394)',
      'Dual Custody JIT Access',
      'Tamper-Evident Audit Trails'
    ],
    diagram: `
+---------------------------------------------------------------------------------------------------+
|                                CLIENT RUNTIMES & CONTROL SURFACES                                 |
|   +--------------------------+  +--------------------------+  +-------------------------------+   |
|   |  CLI: secretvault run    |  |  Spring Boot 3 Starter   |  |  Workload Machine Tokens      |   |
|   +------------+-------------+  +------------+-------------+  +---------------+---------------+   |
+----------------|-----------------------------|--------------------------------|-------------------+
                 | TLS 1.3                     | TLS 1.3                        | TLS 1.3
                 v                             v                                v
+---------------------------------------------------------------------------------------------------+
|                                 SECRETVLT ZERO-TRUST CONTROL PLANE                                |
|   [Token-Bucket Rate Limiter] ---> [JWT / OIDC Attestation] ---> [Fine-Grained RBAC Engine]        |
|                                                                                                   |
|   +-----------------------------+  +----------------------------+  +--------------------------+   |
|   | AES-256-GCM Envelope Engine |  | JIT Dual-Approval Engine   |  | Outbox Event Dispatcher |   |
|   +--------------+--------------+  +----------------------------+  +-------------+------------+   |
+------------------|---------------------------------------------------------------|----------------+
                   |                                                               |
                   v                                                               v
+------------------------------------+                           +----------------------------------+
|   KMS KEY PROVIDER ABSTRACTION     |                           |  POSTGRESQL & TRANSACTION LOGS   |
|  - LocalDevKmsKeyProvider (AESWrap)|                           |  - Encrypted Ciphertext + Tag    |
|  - AwsKmsKeyProvider (CMK Wrap)    |                           |  - Immutable Audit Records       |
+------------------------------------+                           +----------------------------------+`,
    pillars: [
      {
        title: 'Cryptographic Envelope Encryption',
        desc: 'Every secret value is encrypted under a unique 256-bit Data Encryption Key (DEK). DEKs are wrapped under Key Encryption Keys (KEKs) via AWS KMS or local AESWrap.'
      },
      {
        title: 'Contextual AAD Authentication',
        desc: 'Authenticated Additional Data binds tenant context (workspaceId, projectId, environmentId, secretId). Encrypted blobs cannot be decrypted in another tenant context.'
      },
      {
        title: 'Deterministic Memory Zeroization',
        desc: 'Plaintext DEKs and decrypted secret byte arrays are cleared in RAM immediately using Arrays.fill(dekBytes, (byte) 0) inside finally blocks.'
      }
    ]
  },
  {
    id: 'sec-architecture',
    title: 'Security Architecture & Defense in Depth',
    badge: 'Architecture',
    subgroup: 'Overview & Architecture',
    summary: 'Layered security controls across network, transport, identity, and persistence layers.',
    headline: 'Defense in Depth: Layered Security Architecture',
    subheadline: 'How SecretVault enforces security at the network gateway, identity attestation, execution authorization, and storage layers.',
    tags: ['Defense in Depth', 'TLS 1.3 Enforced', 'Least Privilege', 'Memory Zeroization'],
    workflow: [
      {
        step: 'Edge & Network Ingress',
        desc: 'Enforces TLS 1.3, strict security response headers (Cache-Control: no-store, HSTS, X-Content-Type-Options: nosniff), and token-bucket distributed rate limiting.'
      },
      {
        step: 'Identity & Authentication',
        desc: 'Validates cryptographic JWT signatures, bearer token revocation status in Redis, and enforces WebAuthn FIDO2 / TOTP for privileged actions.'
      },
      {
        step: 'Authorization & Scope Check',
        desc: 'Evaluates workspace membership, project role, environment protection status, and active JIT grants before allowing secret read, reveal, or mutation.'
      },
      {
        step: 'Envelope Cryptographic Engine',
        desc: 'Generates fresh 256-bit DEK, 96-bit IV, updates GCM AAD context, encrypts plaintext, delegates key wrapping to KmsKeyProvider, and zeroizes memory.'
      },
      {
        step: 'Transactional Persistence & Audit',
        desc: 'Persists encrypted payload and emits an immutable domain audit event within the same database transaction via the Transactional Outbox pattern.'
      }
    ]
  },
  {
    id: 'sec-threat-model',
    title: 'Threat Model & Attack Vectors',
    badge: 'Threat Model',
    subgroup: 'Overview & Architecture',
    summary: 'Documented threat vectors, attack boundaries, and implemented safeguards.',
    headline: 'SecretVault Threat Model & Safeguards',
    subheadline: 'Systematic analysis of potential attack vectors, threat actors, and cryptographic mitigations.',
    tableHeaders: ['Threat Vector', 'Potential Impact', 'Implemented Safeguard', 'Verification Status'],
    tableRows: [
      ['Database Compromise (SQL Dump)', 'Exfiltration of stored secrets', 'AES-256-GCM envelope encryption. Ciphertext cannot be decrypted without KEK in KMS.', 'Implemented & Verified'],
      ['Cross-Tenant Ciphertext Swapping', 'Decryption in unauthorized workspace', 'Authenticated Additional Data (AAD) binds workspaceId:secretId:envId.', 'Implemented & Verified'],
      ['Replay Attack on Webhooks', 'Re-executing historical events', 'HMAC-SHA256 signature with X-SecretVault-Timestamp (300s window) and unique event UUIDs.', 'Implemented & Verified'],
      ['Stolen Developer Token', 'Unauthorized access to production secrets', 'Protected environments require Step-Up MFA and JIT break-glass dual approvals.', 'Implemented & Verified'],
      ['Malicious Git Commit of Secrets', 'Credential leak in source repository', 'Pre-commit Git hook and Shannon entropy secret scanner with regex detector engine.', 'Implemented & Verified'],
      ['SSRF via Webhook Subscriptions', 'Internal network metadata scanning', 'UrlSecurityValidator blocks loopback (127.0.0.1), private RFC 1918 IPs, and AWS metadata (169.254.169.254).', 'Implemented & Verified']
    ]
  },
  {
    id: 'sec-trust-boundaries',
    title: 'Trust Boundaries & Isolation',
    badge: 'Isolation',
    subgroup: 'Overview & Architecture',
    summary: 'Formal boundaries between client runtimes, control plane, KMS, and external hosting providers.',
    headline: 'Trust Boundaries & Multi-Tenant Isolation',
    subheadline: 'Clear architectural separation preventing cross-boundary privilege escalation or lateral data leakage.',
    pillars: [
      {
        title: 'Client Runtime Boundary',
        desc: 'Clients (CLI, SDKs, VS Code Extension) communicate with SecretVault exclusively over authenticated HTTPS. Clients hold short-lived bearer or machine tokens.'
      },
      {
        title: 'Tenant Boundary (Workspaces)',
        desc: 'Workspaces are cryptographically and logically isolated. All queries enforce WHERE workspace_id = :workspaceId. AAD context enforces workspace binding during decryption.'
      },
      {
        title: 'KMS Key Boundary',
        desc: 'Master keys never leave the KMS boundary. SecretVault sends wrapped keys to KMS for unwrapping, receiving raw DEKs exclusively in volatile heap memory.'
      }
    ]
  },
  {
    id: 'sec-limitations',
    title: 'Security Limitations & Honest Boundaries',
    badge: 'Boundaries',
    subgroup: 'Overview & Architecture',
    summary: 'Explicit documentation of technical limitations and non-guarantees.',
    headline: 'Documented Security Limitations & Honest Boundaries',
    subheadline: 'Engineering transparency regarding where SecretVault protections begin and end.',
    note: {
      type: 'warning',
      title: 'Host Compromise Boundary',
      text: 'If the host operating system running an application process is compromised at root/kernel level, an attacker with kernel memory inspection can inspect RAM. SecretVault protects data at rest, in transit, and eliminates plaintext files, but cannot prevent kernel memory inspection on a compromised host.'
    },
    pillars: [
      {
        title: 'Zero-Knowledge vs Envelope Encryption',
        desc: 'SecretVault is an enterprise secrets management system with envelope encryption. When an authorized user executes secret reveal, the control plane decrypts the value server-side to return it to the authorized caller with audit logging.'
      },
      {
        title: 'External Provider Trust',
        desc: 'When secrets are synchronized to Vercel or Render, security after synchronization depends on the hosting provider access controls and security posture.'
      },
      {
        title: 'Hardware Security Module (HSM)',
        desc: 'The current open-source release supports LocalDevKmsKeyProvider (RFC 3394) and AwsKmsKeyProvider. Hardware FIPS 140-3 Level 3 HSM support is an enterprise deployment option.'
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // 2. Identity and Access Management
  // ---------------------------------------------------------------------------
  {
    id: 'sec-auth',
    title: 'Authentication & Session Security',
    badge: 'Auth',
    subgroup: 'Identity & Access',
    summary: 'JWT token signing, session lifecycle, TOTP MFA, WebAuthn FIDO2, and step-up challenge flows.',
    headline: 'Identity Attestation, Sessions & Multi-Factor Authentication',
    subheadline: 'Multi-layer authentication supporting enterprise OAuth2/OIDC, hardware security keys, and step-up challenges for sensitive operations.',
    tags: ['HMAC-SHA256 JWT', 'WebAuthn FIDO2', 'TOTP MFA', 'Step-Up Challenges'],
    workflow: [
      {
        step: '1. Primary Authentication',
        desc: 'User authenticates via email/password, OIDC provider (Okta, Google, Azure AD), or GitHub SSO. Credentials validated against salted BCrypt hashes.'
      },
      {
        step: '2. Multi-Factor Verification',
        desc: 'If MFA is enabled on the account, user must complete TOTP code entry or WebAuthn FIDO2 hardware key assertion (WebAuthnController.java).'
      },
      {
        step: '3. Session Token Minting',
        desc: 'Issues a cryptographically signed JWT containing userId, email, and active workspace scopes. Session is registered in Redis with sliding expiration.'
      },
      {
        step: '4. Privileged Step-Up Challenge',
        desc: 'Sensitive actions (revealing production secrets, changing master KMS keys, emergency rotation) require Step-Up MFA authentication within the past 15 minutes.'
      }
    ]
  },
  {
    id: 'sec-rbac',
    title: 'Authorization & Role-Based Access Control',
    badge: 'RBAC',
    subgroup: 'Identity & Access',
    summary: 'Workspace roles, environment-tier protections, and fine-grained resource permissions.',
    headline: 'Fine-Grained Role-Based Access Control (RBAC)',
    subheadline: 'Strict least-privilege permission matrix controlling operations across workspaces, projects, environments, and individual secrets.',
    roles: [
      { name: 'OWNER', desc: 'Full administrative control over workspace, billing, KMS settings, member invitations, and break-glass overrides.' },
      { name: 'ADMIN', desc: 'Manages projects, environments, integrations, and approves JIT requests. Cannot delete workspace or transfer ownership.' },
      { name: 'MEMBER', desc: 'Can read, create, and update secrets in development and staging environments. Cannot access protected production environments without JIT grant.' },
      { name: 'VIEWER', desc: 'Read-only access to non-sensitive secret metadata and audit logs. Cannot reveal plaintext values or trigger mutations.' }
    ],
    tableHeaders: ['Operation', 'OWNER', 'ADMIN', 'MEMBER', 'VIEWER'],
    tableRows: [
      ['Create / Update Secret (Dev/Staging)', 'Allowed', 'Allowed', 'Allowed', 'Denied'],
      ['Read Secret Metadata', 'Allowed', 'Allowed', 'Allowed', 'Allowed'],
      ['Reveal Plaintext Secret (Non-Prod)', 'Allowed', 'Allowed', 'Allowed', 'Denied'],
      ['Reveal Plaintext Secret (Production)', 'Step-Up MFA', 'Step-Up MFA', 'JIT Required', 'Denied'],
      ['Trigger Production Rotation', 'Allowed', 'Allowed', 'Denied', 'Denied'],
      ['Approve JIT Access Request', 'Allowed', 'Allowed', 'Denied', 'Denied'],
      ['Connect External Provider (Vercel/Render)', 'Allowed', 'Allowed', 'Denied', 'Denied']
    ]
  },
  {
    id: 'sec-machine-identities',
    title: 'Machine Identities & Workload Attestation',
    badge: 'Machine',
    subgroup: 'Identity & Access',
    summary: 'Non-human workload identities for CI/CD runners, Kubernetes pods, and background daemons.',
    headline: 'Machine Identities & Headless Workload Authentication',
    subheadline: 'Eliminate long-lived hardcoded static tokens in CI/CD pipelines with cryptographic workload attestation.',
    pillars: [
      {
        title: 'Scoped Machine Tokens',
        desc: 'Generate machine tokens tied to a specific project and environment (e.g., github-actions-staging). Tokens have mandatory expiration and granular permissions.'
      },
      {
        title: 'OIDC Workload Identity Federation',
        desc: 'Exchange ephemeral GitHub Actions ID tokens (id-token: write) or Kubernetes ServiceAccount JWTs for short-lived SecretVault session tokens without storing static secrets in CI.'
      },
      {
        title: 'Automatic Heartbeat & Invalidation',
        desc: 'Machine identities running long-lived workloads emit periodic heartbeats (SecretConsumerController.java). Inactive workloads have access revoked automatically.'
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // 3. Cryptography & Key Management
  // ---------------------------------------------------------------------------
  {
    id: 'sec-envelope-encryption',
    title: 'Envelope Encryption Architecture',
    badge: 'Crypto',
    subgroup: 'Encryption & KMS',
    summary: 'AES-256-GCM envelope encryption with ephemeral DEKs, AAD tenant binding, and KMS KEK wrapping.',
    headline: 'Envelope Encryption & Cryptographic Implementation',
    subheadline: 'Grounded strictly in AesGcmEnvelopeEncryptionService.java and KmsKeyProvider.java.',
    tags: ['AES-256-GCM', '96-bit Random IV', '128-bit Auth Tag', 'RFC 3394 AESWrap', 'AWS KMS'],
    diagram: `
                    ENVELOPE ENCRYPTION FLOW (WRITE)
                    --------------------------------
    Plaintext Secret Value + AAD Context (workspaceId:projectId:secretId)
                              |
                              v
    [SecureRandom] ---> Generate fresh 256-bit DEK & 96-bit IV
                              |
                              +----------------------------+
                              |                            |
                              v                            v
               [AES-256-GCM Cipher Engine]       [KmsKeyProvider (AWS KMS / Local)]
                              |                            |
                Ciphertext + 128-bit Tag             Wrapped DEK (Encrypted under KEK)
                              |                            |
                              +-------------+--------------+
                                            |
                                            v
                                [EncryptedPayload Record]
               (ciphertext, encryptedDek, iv, authTag, keyReference)
                                            |
                                            v
                               [PostgreSQL Secret Record]
                                            |
                         (Arrays.fill(dekBytes, 0) - Memory Zeroized!)`,
    pillars: [
      {
        title: 'Data Encryption Keys (DEKs)',
        desc: 'Generated fresh per secret version using java.security.SecureRandom. Never stored in plaintext on disk or in the database. Zeroized in RAM immediately after use.'
      },
      {
        title: 'Key Encryption Keys (KEKs)',
        desc: 'Customer-managed master keys stored in AWS KMS (CMK) or LocalDev KMS. Used strictly to wrap and unwrap 32-byte DEKs using AESWrap (RFC 3394).'
      },
      {
        title: 'Authenticated Additional Data (AAD)',
        desc: 'Calculated as String.format("%s:%s:%s", workspaceId, projectId, secretId). GCM mode computes authentication tag over ciphertext and AAD. Swapping ciphertext fails tag verification.'
      }
    ]
  },
  {
    id: 'sec-kms-provider',
    title: 'KMS Key Provider SPI & Implementation',
    badge: 'KMS SPI',
    subgroup: 'Encryption & KMS',
    summary: 'Pluggable KmsKeyProvider interface with LocalDevKmsKeyProvider and AwsKmsKeyProvider.',
    headline: 'Key Management Service (KMS) Abstraction & Providers',
    subheadline: 'Pluggable architecture allowing seamless transitions between local development and enterprise cloud KMS.',
    code: `// KmsKeyProvider Interface (com.secretvault.encryption.kms.KmsKeyProvider)
public interface KmsKeyProvider {
    byte[] wrapKey(byte[] plaintextDek, String keyReference);
    byte[] unwrapKey(byte[] encryptedDek, String keyReference);
    String getDefaultKeyReference();
}

// Configuration options in application.yml:
secretvault:
  kms:
    provider: aws # Options: 'local' (RFC 3394 AESWrap) or 'aws' (AWS KMS CMK)
    aws:
      key-id: alias/secretvault-production-kek
      region: us-east-1`,
    pillars: [
      {
        title: 'LocalDevKmsKeyProvider',
        desc: 'Default for local development. Derives a 256-bit KEK from secretvault.security.master-key and protects DEKs using RFC 3394 AES Key Wrap.'
      },
      {
        title: 'AwsKmsKeyProvider',
        desc: 'Production provider using AWS KMS Customer Managed Keys (CMKs). Supports AWS IAM Task Roles, EKS Pod Identity / IRSA, and LocalStack.'
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // 4. Privileged Access & JIT
  // ---------------------------------------------------------------------------
  {
    id: 'sec-jit-access',
    title: 'Just-in-Time (JIT) & Break-Glass Governance',
    badge: 'JIT',
    subgroup: 'Privileged Access',
    summary: 'Zero standing privileges, temporary access grants, dual-custody approvals, and automated lease revocation.',
    headline: 'Just-in-Time (JIT) Ephemeral Access & Break-Glass Workflow',
    subheadline: 'Eliminate standing administrator privileges in production with audited, time-bounded emergency access grants.',
    tags: ['Zero Standing Privileges', 'Dual-Custody Approval', 'Sliding Leases', 'Automated Revocation'],
    diagram: `
+---------------------------------------------------------------------------------------------------+
|                                 JUST-IN-TIME (JIT) ACCESS LIFECYCLE                               |
|                                                                                                   |
|   1. REQUEST                  2. REVIEW                    3. ACTIVATION             4. EXPIRY    |
|   Developer submits           Workspace OWNER/ADMIN        Ephemeral session         Timer fires  |
|   justification & duration    reviews request via          activated in Redis;       (e.g. 60m);  |
|   (POST /api/v1/jit-requests) UI/API                       Access granted            Grant revoked|
|             |                            |                       |                         |      |
|             v                            v                       v                         v      |
|        [PENDING]  ------------->   [APPROVED]   -----------> [ACTIVE]  ------------->  [EXPIRED]  |
|             |                            |                                                        |
|             |                            +-----------------> [REJECTED]                           |
|             v                                                                                     |
|        (Audit Event Emitted: JIT_REQUEST_SUBMITTED) ---> (Audit Event: JIT_REQUEST_DECIDED)      |
+---------------------------------------------------------------------------------------------------+`,
    pillars: [
      {
        title: 'Dual-Custody Separation of Duties',
        desc: 'A requester cannot approve their own JIT request. Production access requires explicit sign-off from an independent Workspace Admin or Security Officer.'
      },
      {
        title: 'Time-Bounded Ephemeral Leases',
        desc: 'Access grants are strictly bounded by duration (maximum 4 hours). A background scheduler evaluates active grants every 60 seconds and terminates expired sessions.'
      },
      {
        title: 'One-Click Emergency Revocation',
        desc: 'Administrators can instantly revoke an active JIT grant (POST /api/v1/workspaces/{id}/jit-requests/{reqId}/revoke), terminating all active child tokens.'
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // 5. Audit & Event Security
  // ---------------------------------------------------------------------------
  {
    id: 'sec-audit-logging',
    title: 'Audit Trails & Transactional Outbox',
    badge: 'Audit',
    subgroup: 'Audit & Webhooks',
    summary: 'Immutable audit logs, domain events, transactional outbox pattern, and SIEM streaming.',
    headline: 'Tamper-Evident Audit Ledger & Transactional Outbox',
    subheadline: 'Complete operational visibility with append-only database audit logs and guaranteed event delivery.',
    pillars: [
      {
        title: 'Append-Only Audit Ledger',
        desc: 'Audit logs cannot be updated or deleted via application APIs. Every secret mutation, reveal, rotation, and authorization decision is permanently recorded.'
      },
      {
        title: 'Transactional Outbox Pattern',
        desc: 'Domain events write to outbox tables in the same ACID database transaction as secret entities. A background worker publishes events reliably to Redis and Webhooks.'
      },
      {
        title: 'Masked Audit Payloads',
        desc: 'Audit records capture user identity, IP address, user-agent, justification, and key names. Plaintext secret values are strictly excluded from audit payloads.'
      }
    ]
  },
  {
    id: 'sec-webhook-signatures',
    title: 'Webhook Security & Replay Prevention',
    badge: 'Webhooks',
    subgroup: 'Audit & Webhooks',
    summary: 'HMAC-SHA256 signatures, timestamp validation, replay protection, and SSRF prevention.',
    headline: 'Webhook Cryptographic Signatures & Replay Protection',
    subheadline: 'Ensuring downstream webhook consumers verify authenticity, integrity, and freshness of security events.',
    code: `// Webhook Signature Header: X-SecretVault-Signature
// Generated via HMAC-SHA256(signingSecret, timestamp + "." + payload)

// Consumer verification example in Node.js:
const crypto = require('crypto');

function verifyWebhook(payload, signatureHeader, timestampHeader, secret) {
  // 1. Replay prevention: reject timestamps older than 300 seconds (5 minutes)
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - parseInt(timestampHeader)) > 300) {
    throw new Error('Webhook timestamp outside acceptable tolerance (replay detected)');
  }

  // 2. Compute expected HMAC
  const expectedSig = crypto
    .createHmac('sha256', secret)
    .update(\`\${timestampHeader}.\${payload}\`)
    .digest('hex');

  // 3. Constant-time comparison to prevent timing attacks
  return crypto.timingSafeEqual(Buffer.from(signatureHeader), Buffer.from(expectedSig));
}`,
    pillars: [
      {
        title: 'HMAC-SHA256 Signature',
        desc: 'Every webhook payload includes an X-SecretVault-Signature header generated using a workspace-specific shared secret.'
      },
      {
        title: 'Timestamp Validation (300s)',
        desc: 'X-SecretVault-Timestamp prevents replay attacks. Downstream consumers reject deliveries with timestamps drifting by more than 5 minutes.'
      },
      {
        title: 'Server-Side Request Forgery (SSRF) Defense',
        desc: 'Webhook registration validates destination URLs, blocking loopback addresses (127.0.0.1, localhost), private subnets (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16), and cloud metadata endpoints.'
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // 6. Security Operations & Detection
  // ---------------------------------------------------------------------------
  {
    id: 'sec-repo-scanning',
    title: 'Repository Secret Scanning & Redaction',
    badge: 'Scanner',
    subgroup: 'Security Operations',
    summary: 'Shannon entropy analysis, regex pattern detectors, and evidence redaction.',
    headline: 'Pre-Commit & Repository Secret Leak Detection',
    subheadline: 'Detect committed credentials, private keys, and high-entropy tokens across Git repositories.',
    tags: ['Shannon Entropy', 'Regex Pattern Matching', 'Pre-Commit Hook', 'Evidence Redaction'],
    pillars: [
      {
        title: 'Multi-Pattern Detector Engine',
        desc: 'Scans for AWS access keys, GitHub personal access tokens, Stripe secret keys, Slack webhook URLs, and private RSA/PEM keys.'
      },
      {
        title: 'Shannon Entropy Analysis',
        desc: 'Calculates information entropy for tokens exceeding 16 characters. Flags high-entropy strings that match cryptographic key profiles.'
      },
      {
        title: 'Evidence Redaction',
        desc: 'Raw detected credentials are redacted before storage (e.g. sk_live_...94a1). Only masked snippets and fingerprint hashes are persisted.'
      }
    ]
  },
  {
    id: 'sec-incident-response',
    title: 'Incident Detection & Automated Remediation',
    badge: 'SecOps',
    subgroup: 'Security Operations',
    summary: 'Automated remediation workflows, shadow rotation, and security copilot triage.',
    headline: 'Incident Response, Triage & Automated Remediation',
    subheadline: 'Close the loop on leaked credentials with automated rotation, revocation, and explainability workflows.',
    workflow: [
      {
        step: '1. Leak Detection',
        desc: 'Scanner detects exposed credential in Git commit or build artifact. Finding generated in Security Center (SecretFindingController.java).'
      },
      {
        step: '2. WhyExposed Explainability',
        desc: 'The Explainability engine (GET /api/v1/findings/{id}/why-exposed) pinpoints the exact commit, author, file, and exposure radius.'
      },
      {
        step: '3. Automated Remediation Policy',
        desc: 'Security automation policies trigger immediate shadow rotation or revocation (POST /api/v1/findings/{id}/remediate) based on severity.'
      },
      {
        step: '4. Forensic Audit Log',
        desc: 'Audit event emitted and SIEM notified via webhook, closing the incident with a documented remediation trail.'
      }
    ]
  }
];

export const findSecurityPageById = (id) => {
  return SECURITY_PAGES.find((p) => p.id === id) || null;
};
