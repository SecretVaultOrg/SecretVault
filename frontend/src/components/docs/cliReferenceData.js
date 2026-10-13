// =============================================================================
// SecretVault Verified CLI Reference Data Model
// Grounded strictly in cli/src/main/java/com/secretvault/cli and Picocli annotations.
// Every command, subcommand, argument, option, and exit code matches the Java implementation.
// =============================================================================

export const CLI_GLOBAL_FLAGS = [
  { flag: '-s, --server <url>', type: 'String', default: 'http://localhost:8080', desc: 'SecretVault control plane server URL' },
  { flag: '-p, --profile <name>', type: 'String', default: 'default', desc: 'Authentication and configuration profile name' },
  { flag: '-w, --workspace <id>', type: 'String', default: 'Active Context', desc: 'Active Workspace UUID or slug' },
  { flag: '--project <id>', type: 'String', default: 'Active Context', desc: 'Active Project UUID or slug' },
  { flag: '-e, --env, --environment <slug>', type: 'String', default: 'Active Context', desc: 'Active Environment tier (development, staging, production)' },
  { flag: '--json', type: 'boolean', default: 'false', desc: 'Format command output as structured JSON' },
  { flag: '-q, --quiet', type: 'boolean', default: 'false', desc: 'Suppress informational logs and banner output' },
  { flag: '--no-color', type: 'boolean', default: 'false', desc: 'Disable ANSI color formatting in terminal output' },
  { flag: '-h, --help', type: 'boolean', default: 'false', desc: 'Display help for command options and subcommands' },
  { flag: '-V, --version', type: 'boolean', default: 'false', desc: 'Print version information and exit' }
];

export const CLI_EXIT_CODES = [
  { code: 0, label: 'SUCCESS', desc: 'Command completed successfully with zero policy violations.' },
  { code: 1, label: 'GENERAL_ERROR', desc: 'Runtime failure, authentication rejection, or server error.' },
  { code: 2, label: 'SCANNER_INTERNAL_ERROR', desc: 'Internal error within the local secret scanner engine.' },
  { code: 3, label: 'CONFIG_ERROR', desc: 'Missing required configuration, target path, or workspace context.' },
  { code: 4, label: 'AUTH_FORBIDDEN', desc: 'Insufficient role permissions for requested resource operation.' },
  { code: 5, label: 'NETWORK_ERROR', desc: 'Server unreachable or network timeout communicating with control plane.' },
  { code: 130, label: 'TERMINATED_SIGINT', desc: 'Command interrupted by user terminal signal (Ctrl+C).' }
];

export const CLI_COMMAND_GROUPS = [
  // ---------------------------------------------------------------------------
  // 1. Overview & Setup
  // ---------------------------------------------------------------------------
  {
    groupId: 'cli-overview-group',
    groupTitle: 'Installation & Global Flags',
    commands: [
      {
        id: 'cli-overview',
        name: 'secretvault',
        aliases: ['sv'],
        summary: 'Root CLI executable and global invocation options',
        verificationStatus: 'Implemented and verified',
        syntax: 'secretvault [options] [COMMAND]',
        arguments: [],
        options: CLI_GLOBAL_FLAGS,
        envVars: [
          { name: 'SECRETVAULT_SERVER', desc: 'Default server URL fallback' },
          { name: 'SECRETVAULT_PROFILE', desc: 'Default configuration profile fallback' },
          { name: 'JAVA_HOME', desc: 'Path to Java 21+ JDK runtime' }
        ],
        permissions: 'None (Unauthenticated)',
        example: 'secretvault --help',
        exitCodes: '0 on success, 1 on invalid option',
        related: ['cli-doctor', 'cli-version', 'cli-auth-login']
      },
      {
        id: 'cli-doctor',
        name: 'secretvault doctor',
        summary: 'Run end-to-end environment, network, and credential store diagnostics',
        verificationStatus: 'Implemented and verified',
        syntax: 'secretvault doctor [options]',
        arguments: [],
        options: [
          { flag: '-v, --verbose', type: 'boolean', default: 'false', desc: 'Display detailed diagnostic latency timings and trace logs' },
          ...CLI_GLOBAL_FLAGS.slice(5)
        ],
        envVars: [{ name: 'JAVA_HOME', desc: 'Java 21 runtime validation' }],
        permissions: 'None (Local checks) / Valid session for server test',
        example: 'secretvault doctor --verbose',
        exitCodes: '0 all checks passed, 1 one or more diagnostic checks failed',
        related: ['cli-overview', 'cli-config-path']
      },
      {
        id: 'cli-version',
        name: 'secretvault version',
        summary: 'Display SecretVault CLI and backend API build information',
        verificationStatus: 'Implemented and verified',
        syntax: 'secretvault version [options]',
        arguments: [],
        options: CLI_GLOBAL_FLAGS.slice(5),
        envVars: [],
        permissions: 'None',
        example: 'secretvault version --json',
        exitCodes: '0 on success',
        related: ['cli-overview']
      },
      {
        id: 'cli-completion',
        name: 'secretvault completion',
        summary: 'Generate shell completion script for target shell',
        verificationStatus: 'Implemented and verified',
        syntax: 'secretvault completion <shell>',
        arguments: [
          { name: '<shell>', required: true, desc: 'Target shell: bash, zsh, fish, powershell' }
        ],
        options: [],
        envVars: [],
        permissions: 'None',
        example: 'secretvault completion zsh > ~/.zsh/completion/_secretvault',
        exitCodes: '0 on success, 1 on unsupported shell',
        related: ['cli-overview']
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // 2. Authentication & Sessions
  // ---------------------------------------------------------------------------
  {
    groupId: 'cli-auth-group',
    groupTitle: 'Authentication & Sessions',
    commands: [
      {
        id: 'cli-auth-login',
        name: 'secretvault auth login',
        summary: 'Authenticate with SecretVault server and store encrypted session tokens',
        verificationStatus: 'Implemented and verified',
        syntax: 'secretvault auth login [options]',
        arguments: [],
        options: [
          { flag: '--email <email>', type: 'String', default: 'Prompt', desc: 'User email address' },
          { flag: '--password-stdin', type: 'boolean', default: 'false', desc: 'Read password from standard input (non-echoing)' },
          { flag: '--recovery', type: 'boolean', default: 'false', desc: 'Use a backup recovery code instead of TOTP for MFA challenge' },
          ...CLI_GLOBAL_FLAGS.slice(0, 3)
        ],
        envVars: [],
        permissions: 'None (Requires valid user credentials)',
        example: 'secretvault auth login --server http://localhost:8080 --email developer@company.com',
        exitCodes: '0 on successful authentication, 1 on bad credentials or rejected MFA',
        related: ['cli-auth-oidc', 'cli-auth-status', 'cli-auth-whoami', 'cli-auth-logout']
      },
      {
        id: 'cli-auth-oidc',
        name: 'secretvault auth oidc',
        summary: 'Exchange an OIDC workload token (GitHub Actions / GitLab CI) for a machine session',
        verificationStatus: 'Implemented and verified',
        syntax: 'secretvault auth oidc [options]',
        arguments: [],
        options: [
          { flag: '--provider-id <uuid>', type: 'UUID', default: 'None', desc: 'OIDC Provider UUID configured in SecretVault' },
          { flag: '--issuer <url>', type: 'String', default: 'None', desc: 'OIDC Issuer URL (if provider-id is not specified)' },
          { flag: '--token <jwt>', type: 'String', default: 'None', desc: 'Raw OIDC ID Token JWT' },
          { flag: '--token-stdin', type: 'boolean', default: 'false', desc: 'Read OIDC ID Token from standard input' },
          { flag: '--token-env <var>', type: 'String', default: 'None', desc: 'Environment variable name containing the OIDC token' },
          ...CLI_GLOBAL_FLAGS.slice(0, 3)
        ],
        envVars: [
          { name: 'ACTIONS_ID_TOKEN_REQUEST_TOKEN', desc: 'Auto-detected in GitHub Actions runner' },
          { name: 'CI_JOB_JWT_V2', desc: 'Auto-detected in GitLab CI runner' }
        ],
        permissions: 'Valid workload identity registered in target workspace',
        example: 'echo "$ACTIONS_ID_TOKEN_REQUEST_TOKEN" | secretvault auth oidc --provider-id 7a3c... --token-stdin',
        exitCodes: '0 on success, 1 on token validation or trust policy failure',
        related: ['cli-auth-login', 'cli-machine-list', 'cli-run']
      },
      {
        id: 'cli-auth-logout',
        name: 'secretvault auth logout',
        summary: 'Sign out and securely revoke stored credentials',
        verificationStatus: 'Implemented and verified',
        syntax: 'secretvault auth logout [options]',
        arguments: [],
        options: [
          { flag: '--all', type: 'boolean', default: 'false', desc: 'Log out from all profiles and clear local credential store' },
          ...CLI_GLOBAL_FLAGS.slice(0, 3)
        ],
        envVars: [],
        permissions: 'None',
        example: 'secretvault auth logout',
        exitCodes: '0 on success',
        related: ['cli-auth-login', 'cli-auth-status']
      },
      {
        id: 'cli-auth-status',
        name: 'secretvault auth status',
        summary: 'Check active authentication session status and credential validity',
        verificationStatus: 'Implemented and verified',
        syntax: 'secretvault auth status [options]',
        arguments: [],
        options: CLI_GLOBAL_FLAGS.slice(5),
        envVars: [],
        permissions: 'None (Local credential inspection)',
        example: 'secretvault auth status',
        exitCodes: '0 if active, 1 if not authenticated or expired',
        related: ['cli-auth-whoami', 'cli-auth-login']
      },
      {
        id: 'cli-auth-whoami',
        name: 'secretvault auth whoami',
        summary: 'Display current authenticated user identity and workspace context',
        verificationStatus: 'Implemented and verified',
        syntax: 'secretvault auth whoami [options]',
        arguments: [],
        options: CLI_GLOBAL_FLAGS.slice(5),
        envVars: [],
        permissions: 'Valid authenticated session',
        example: 'secretvault auth whoami',
        exitCodes: '0 on success, 1 on unauthenticated',
        related: ['cli-auth-status', 'cli-context-get']
      },
      {
        id: 'cli-auth-profiles',
        name: 'secretvault auth profiles',
        summary: 'List all configured SecretVault profiles and active target servers',
        verificationStatus: 'Implemented and verified',
        syntax: 'secretvault auth profiles [options]',
        arguments: [],
        options: CLI_GLOBAL_FLAGS.slice(5),
        envVars: [],
        permissions: 'None',
        example: 'secretvault auth profiles',
        exitCodes: '0 on success',
        related: ['cli-auth-switch', 'cli-config-list']
      },
      {
        id: 'cli-auth-switch',
        name: 'secretvault auth switch',
        summary: 'Switch active configuration profile',
        verificationStatus: 'Implemented and verified',
        syntax: 'secretvault auth switch <profile>',
        arguments: [
          { name: '<profile>', required: true, desc: 'Target profile name to activate' }
        ],
        options: [],
        envVars: [],
        permissions: 'None',
        example: 'secretvault auth switch staging',
        exitCodes: '0 on success',
        related: ['cli-auth-profiles', 'cli-context-set']
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // 3. Configuration & Context
  // ---------------------------------------------------------------------------
  {
    groupId: 'cli-config-group',
    groupTitle: 'Configuration & Context',
    commands: [
      {
        id: 'cli-context-get',
        name: 'secretvault context get',
        summary: 'Show resolved workspace, project, and environment context',
        verificationStatus: 'Implemented and verified',
        syntax: 'secretvault context get [options]',
        arguments: [],
        options: CLI_GLOBAL_FLAGS.slice(5),
        envVars: [],
        permissions: 'None',
        example: 'secretvault context get',
        exitCodes: '0 on success',
        related: ['cli-context-set', 'cli-context-reset']
      },
      {
        id: 'cli-context-set',
        name: 'secretvault context set',
        summary: 'Set default workspace, project, or environment context for current profile',
        verificationStatus: 'Implemented and verified',
        syntax: 'secretvault context set [options]',
        arguments: [],
        options: [
          { flag: '-w, --workspace <id|slug>', type: 'String', default: 'None', desc: 'Workspace ID or slug' },
          { flag: '--project <id|slug>', type: 'String', default: 'None', desc: 'Project ID or slug' },
          { flag: '-e, --environment <id|slug>', type: 'String', default: 'None', desc: 'Environment tier ID or slug' },
          ...CLI_GLOBAL_FLAGS.slice(5)
        ],
        envVars: [],
        permissions: 'None (Local config update)',
        example: 'secretvault context set --workspace engineering --project auth-service --env development',
        exitCodes: '0 on success, 1 on invalid arguments',
        related: ['cli-context-get', 'cli-context-reset']
      },
      {
        id: 'cli-context-reset',
        name: 'secretvault context reset',
        summary: 'Clear saved context defaults for current profile',
        verificationStatus: 'Implemented and verified',
        syntax: 'secretvault context reset [options]',
        arguments: [],
        options: CLI_GLOBAL_FLAGS.slice(5),
        envVars: [],
        permissions: 'None',
        example: 'secretvault context reset',
        exitCodes: '0 on success',
        related: ['cli-context-get', 'cli-context-set']
      },
      {
        id: 'cli-config-get',
        name: 'secretvault config get',
        summary: 'Get configuration value for a key in active profile',
        verificationStatus: 'Implemented and verified',
        syntax: 'secretvault config get <key>',
        arguments: [
          { name: '<key>', required: true, desc: 'Configuration key (server, workspace, project, environment)' }
        ],
        options: [],
        envVars: [],
        permissions: 'None',
        example: 'secretvault config get server',
        exitCodes: '0 on success, 1 if key not found',
        related: ['cli-config-set', 'cli-config-list']
      },
      {
        id: 'cli-config-set',
        name: 'secretvault config set',
        summary: 'Set configuration value for a key in active profile',
        verificationStatus: 'Implemented and verified',
        syntax: 'secretvault config set <key> <value>',
        arguments: [
          { name: '<key>', required: true, desc: 'Configuration key name' },
          { name: '<value>', required: true, desc: 'Value to assign' }
        ],
        options: [],
        envVars: [],
        permissions: 'None',
        example: 'secretvault config set server http://127.0.0.1:8080',
        exitCodes: '0 on success',
        related: ['cli-config-get', 'cli-config-list']
      },
      {
        id: 'cli-config-list',
        name: 'secretvault config list',
        summary: 'List all configuration settings for active profile',
        verificationStatus: 'Implemented and verified',
        syntax: 'secretvault config list [options]',
        arguments: [],
        options: CLI_GLOBAL_FLAGS.slice(5),
        envVars: [],
        permissions: 'None',
        example: 'secretvault config list',
        exitCodes: '0 on success',
        related: ['cli-config-path', 'cli-config-reset']
      },
      {
        id: 'cli-config-path',
        name: 'secretvault config path',
        summary: 'Print the local filesystem paths for config and credential storage',
        verificationStatus: 'Implemented and verified',
        syntax: 'secretvault config path',
        arguments: [],
        options: [],
        envVars: [],
        permissions: 'None',
        example: 'secretvault config path',
        exitCodes: '0 on success',
        related: ['cli-doctor']
      },
      {
        id: 'cli-config-reset',
        name: 'secretvault config reset',
        summary: 'Reset configuration file to factory defaults',
        verificationStatus: 'Implemented and verified',
        syntax: 'secretvault config reset [options]',
        arguments: [],
        options: [{ flag: '-y, --yes', type: 'boolean', default: 'false', desc: 'Skip confirmation prompt' }],
        envVars: [],
        permissions: 'None',
        example: 'secretvault config reset --yes',
        exitCodes: '0 on success',
        related: ['cli-config-list']
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // 4. Hierarchy: Workspaces, Projects, Environments
  // ---------------------------------------------------------------------------
  {
    groupId: 'cli-hierarchy-group',
    groupTitle: 'Workspaces, Projects & Environments',
    commands: [
      {
        id: 'cli-workspace-list',
        name: 'secretvault workspace list',
        summary: 'List all workspaces accessible to the authenticated user',
        verificationStatus: 'Implemented and verified',
        syntax: 'secretvault workspace list [options]',
        arguments: [],
        options: CLI_GLOBAL_FLAGS.slice(5),
        envVars: [],
        permissions: 'Authenticated user',
        example: 'secretvault workspace list',
        exitCodes: '0 on success, 1 on error',
        related: ['cli-workspace-get', 'cli-project-list']
      },
      {
        id: 'cli-workspace-get',
        name: 'secretvault workspace get',
        summary: 'Get details of a specific workspace',
        verificationStatus: 'Implemented and verified',
        syntax: 'secretvault workspace get <id|slug>',
        arguments: [
          { name: '<id|slug>', required: true, desc: 'Workspace UUID or slug' }
        ],
        options: CLI_GLOBAL_FLAGS.slice(5),
        envVars: [],
        permissions: 'Workspace member',
        example: 'secretvault workspace get engineering-core',
        exitCodes: '0 on success, 1 if not found',
        related: ['cli-workspace-list']
      },
      {
        id: 'cli-project-list',
        name: 'secretvault project list',
        summary: 'List all projects in the active or specified workspace',
        verificationStatus: 'Implemented and verified',
        syntax: 'secretvault project list [options]',
        arguments: [],
        options: CLI_GLOBAL_FLAGS.slice(5),
        envVars: [],
        permissions: 'Workspace member',
        example: 'secretvault project list',
        exitCodes: '0 on success, 1 on error',
        related: ['cli-project-get', 'cli-environment-list']
      },
      {
        id: 'cli-project-get',
        name: 'secretvault project get',
        summary: 'Get details of a specific project',
        verificationStatus: 'Implemented and verified',
        syntax: 'secretvault project get <id|slug>',
        arguments: [
          { name: '<id|slug>', required: true, desc: 'Project UUID or slug' }
        ],
        options: CLI_GLOBAL_FLAGS.slice(5),
        envVars: [],
        permissions: 'Project access role',
        example: 'secretvault project get payment-gateway',
        exitCodes: '0 on success, 1 if not found',
        related: ['cli-project-list']
      },
      {
        id: 'cli-environment-list',
        name: 'secretvault environment list',
        summary: 'List all deployment environments within the active project',
        verificationStatus: 'Implemented and verified',
        syntax: 'secretvault environment list [options]',
        arguments: [],
        options: CLI_GLOBAL_FLAGS.slice(5),
        envVars: [],
        permissions: 'Project access role',
        example: 'secretvault environment list',
        exitCodes: '0 on success, 1 on error',
        related: ['cli-environment-get', 'cli-secret-list']
      },
      {
        id: 'cli-environment-get',
        name: 'secretvault environment get',
        summary: 'Get details of a specific environment tier',
        verificationStatus: 'Implemented and verified',
        syntax: 'secretvault environment get <id|slug>',
        arguments: [
          { name: '<id|slug>', required: true, desc: 'Environment UUID or slug (development, staging, production)' }
        ],
        options: CLI_GLOBAL_FLAGS.slice(5),
        envVars: [],
        permissions: 'Environment access role',
        example: 'secretvault environment get production',
        exitCodes: '0 on success, 1 if not found',
        related: ['cli-environment-list']
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // 5. Secret Management & Versioning
  // ---------------------------------------------------------------------------
  {
    groupId: 'cli-secrets-group',
    groupTitle: 'Secret Management & Versioning',
    commands: [
      {
        id: 'cli-secret-list',
        name: 'secretvault secret list',
        summary: 'List secret metadata in current environment (never displays plaintext values)',
        verificationStatus: 'Implemented and verified',
        syntax: 'secretvault secret list [options]',
        arguments: [],
        options: [
          { flag: '--search <query>', type: 'String', default: 'None', desc: 'Filter secrets by name substring' },
          { flag: '--status <status>', type: 'String', default: 'ACTIVE', desc: 'Filter by status: ACTIVE, ARCHIVED, DEPRECATED' },
          ...CLI_GLOBAL_FLAGS.slice(5)
        ],
        envVars: [],
        permissions: 'Read permission on project/environment',
        example: 'secretvault secret list --search DB_',
        exitCodes: '0 on success, 1 on error',
        related: ['cli-secret-get', 'cli-secret-reveal', 'cli-secret-set']
      },
      {
        id: 'cli-secret-get',
        name: 'secretvault secret get',
        summary: 'Get metadata for a specific secret (does NOT display plaintext value)',
        verificationStatus: 'Implemented and verified',
        syntax: 'secretvault secret get <name|uuid>',
        arguments: [
          { name: '<name|uuid>', required: true, desc: 'Secret key name or UUID' }
        ],
        options: CLI_GLOBAL_FLAGS.slice(5),
        envVars: [],
        permissions: 'Read permission on secret',
        example: 'secretvault secret get DATABASE_URL',
        exitCodes: '0 on success, 1 if secret not found',
        related: ['cli-secret-reveal', 'cli-secret-versions']
      },
      {
        id: 'cli-secret-reveal',
        name: 'secretvault secret reveal',
        summary: 'Explicitly decrypt and display secret plaintext value to stdout with audit logging',
        verificationStatus: 'Implemented and verified',
        syntax: 'secretvault secret reveal <name|uuid> [options]',
        arguments: [
          { name: '<name|uuid>', required: true, desc: 'Secret key name or UUID' }
        ],
        options: [
          { flag: '--version, -v <num>', type: 'int', default: 'latest', desc: 'Historical version number to reveal' },
          { flag: '-y, --yes', type: 'boolean', default: 'false', desc: 'Skip plaintext exposure warning prompt' },
          { flag: '--raw', type: 'boolean', default: 'false', desc: 'Print only the raw secret value with no trailing metadata' },
          { flag: '--reason, -r <msg>', type: 'String', default: 'None', desc: 'Mandatory audit justification for revealing secret' },
          ...CLI_GLOBAL_FLAGS.slice(5)
        ],
        envVars: [],
        permissions: 'Read + Secret Reveal permission (may require step-up MFA)',
        example: 'secretvault secret reveal STRIPE_API_KEY --reason "Investigating checkout failure ticket #1042"',
        exitCodes: '0 on success, 1 on unauthorized, rejected MFA, or missing reason',
        related: ['cli-secret-get', 'cli-secret-versions']
      },
      {
        id: 'cli-secret-create',
        name: 'secretvault secret create',
        summary: 'Create a new secret with version 1',
        verificationStatus: 'Implemented and verified',
        syntax: 'secretvault secret create <name> [options]',
        arguments: [
          { name: '<name>', required: true, desc: 'Secret key name (e.g. JWT_SIGNING_KEY)' }
        ],
        options: [
          { flag: '--description, -d <text>', type: 'String', default: 'None', desc: 'Optional secret description' },
          { flag: '--from-file <path>', type: 'String', default: 'None', desc: 'Read secret value from a local file' },
          { flag: '--value-from-env <var>', type: 'String', default: 'None', desc: 'Read secret value from a host environment variable' },
          { flag: '--stdin', type: 'boolean', default: 'false', desc: 'Read secret value from standard input' }
        ],
        envVars: [],
        permissions: 'Write permission on target environment',
        example: 'secretvault secret create REDIS_AUTH --from-file ./secrets/redis.pwd',
        exitCodes: '0 on success, 1 if secret already exists or input is invalid',
        related: ['cli-secret-set', 'cli-secret-update']
      },
      {
        id: 'cli-secret-set',
        name: 'secretvault secret set',
        summary: 'Create secret if new, or append a new version if existing',
        verificationStatus: 'Implemented and verified',
        syntax: 'secretvault secret set <name> [options]',
        arguments: [
          { name: '<name>', required: true, desc: 'Secret key name' }
        ],
        options: [
          { flag: '--description, -d <text>', type: 'String', default: 'None', desc: 'Optional description' },
          { flag: '--from-file <path>', type: 'String', default: 'None', desc: 'Read secret value from a local file' },
          { flag: '--value-from-env <var>', type: 'String', default: 'None', desc: 'Read secret value from host environment variable' },
          { flag: '--stdin', type: 'boolean', default: 'false', desc: 'Read secret value from standard input' }
        ],
        envVars: [],
        permissions: 'Write permission on target environment',
        example: 'echo "super-secure-token" | secretvault secret set API_BEARER_TOKEN --stdin',
        exitCodes: '0 on success, 1 on error',
        related: ['cli-secret-create', 'cli-secret-update', 'cli-secret-versions']
      },
      {
        id: 'cli-secret-update',
        name: 'secretvault secret update',
        summary: 'Update secret metadata or append a new version with audit reason',
        verificationStatus: 'Implemented and verified',
        syntax: 'secretvault secret update <name|uuid> [options]',
        arguments: [
          { name: '<name|uuid>', required: true, desc: 'Secret key name or UUID' }
        ],
        options: [
          { flag: '--description, -d <text>', type: 'String', default: 'None', desc: 'Updated secret description' },
          { flag: '--from-file <path>', type: 'String', default: 'None', desc: 'Read new secret value from a file' },
          { flag: '--stdin', type: 'boolean', default: 'false', desc: 'Read new secret value from stdin' },
          { flag: '--reason, -r <msg>', type: 'String', default: 'None', desc: 'Audit reason for this update' }
        ],
        envVars: [],
        permissions: 'Write permission on secret',
        example: 'secretvault secret update DB_PASSWORD --from-file ./new_db.key --reason "Quarterly rotation"',
        exitCodes: '0 on success, 1 on error',
        related: ['cli-secret-set', 'cli-secret-versions']
      },
      {
        id: 'cli-secret-delete',
        name: 'secretvault secret delete',
        summary: 'Soft-delete a secret from an environment',
        verificationStatus: 'Implemented and verified',
        syntax: 'secretvault secret delete <name|uuid> [options]',
        arguments: [
          { name: '<name|uuid>', required: true, desc: 'Secret key name or UUID' }
        ],
        options: [
          { flag: '-y, --yes', type: 'boolean', default: 'false', desc: 'Skip confirmation prompt' }
        ],
        envVars: [],
        permissions: 'Delete permission on secret',
        example: 'secretvault secret delete LEGACY_API_KEY --yes',
        exitCodes: '0 on success, 1 on error',
        related: ['cli-secret-list']
      },
      {
        id: 'cli-secret-versions',
        name: 'secretvault secret versions',
        summary: 'Display immutable version history for a secret',
        verificationStatus: 'Implemented and verified',
        syntax: 'secretvault secret versions <name|uuid> [options]',
        arguments: [
          { name: '<name|uuid>', required: true, desc: 'Secret key name or UUID' }
        ],
        options: [
          { flag: '--page <num>', type: 'int', default: '0', desc: 'Page index' },
          { flag: '--size <num>', type: 'int', default: '20', desc: 'Page size' },
          ...CLI_GLOBAL_FLAGS.slice(5)
        ],
        envVars: [],
        permissions: 'Read permission on secret',
        example: 'secretvault secret versions STRIPE_WEBHOOK_SECRET',
        exitCodes: '0 on success, 1 if not found',
        related: ['cli-secret-rollback', 'cli-secret-reveal']
      },
      {
        id: 'cli-secret-rollback',
        name: 'secretvault secret rollback',
        summary: 'Roll back a secret to a historical version as a brand new version (vN+1)',
        verificationStatus: 'Implemented and verified',
        syntax: 'secretvault secret rollback <name|uuid> --version=<num> [options]',
        arguments: [
          { name: '<name|uuid>', required: true, desc: 'Secret key name or UUID' }
        ],
        options: [
          { flag: '--version, -v <num>', type: 'int', default: 'Required', desc: 'Target historical version number to roll back to' },
          { flag: '--reason, -r <msg>', type: 'String', default: 'None', desc: 'Audit reason for rollback' }
        ],
        envVars: [],
        permissions: 'Write / Rollback permission on secret',
        example: 'secretvault secret rollback DATABASE_URL --version 3 --reason "Reverting to stable connection pool string"',
        exitCodes: '0 on success, 1 if historical version does not exist or unauthorized',
        related: ['cli-secret-versions', 'cli-rotation-rollback']
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // 6. Secret Rotation & Compromise Operations
  // ---------------------------------------------------------------------------
  {
    groupId: 'cli-rotation-group',
    groupTitle: 'Rotation & Incident Operations',
    commands: [
      {
        id: 'cli-rotation-list',
        name: 'secretvault rotation list',
        summary: 'List rotation jobs in current workspace/environment',
        verificationStatus: 'Implemented and verified',
        syntax: 'secretvault rotation list [options]',
        arguments: [],
        options: CLI_GLOBAL_FLAGS.slice(5),
        envVars: [],
        permissions: 'Read permission on workspace',
        example: 'secretvault rotation list',
        exitCodes: '0 on success',
        related: ['cli-rotation-get', 'cli-rotation-start']
      },
      {
        id: 'cli-rotation-get',
        name: 'secretvault rotation get',
        summary: 'Get detailed status and execution attempts of a rotation job',
        verificationStatus: 'Implemented and verified',
        syntax: 'secretvault rotation get <jobId>',
        arguments: [
          { name: '<jobId>', required: true, desc: 'Rotation Job UUID' }
        ],
        options: CLI_GLOBAL_FLAGS.slice(5),
        envVars: [],
        permissions: 'Read permission on workspace',
        example: 'secretvault rotation get 4a8b...',
        exitCodes: '0 on success, 1 if not found',
        related: ['cli-rotation-list']
      },
      {
        id: 'cli-rotation-start',
        name: 'secretvault rotation start',
        summary: 'Trigger a rotation job for a secret with strategy and rollout configuration',
        verificationStatus: 'Implemented and verified',
        syntax: 'secretvault rotation start <name|uuid> [options]',
        arguments: [
          { name: '<name|uuid>', required: true, desc: 'Secret key name or UUID' }
        ],
        options: [
          { flag: '--strategy <type>', type: 'String', default: 'MANUAL', desc: 'Strategy: MANUAL, ON_DEMAND, SCHEDULED, EXPIRY_BASED, EMERGENCY' },
          { flag: '--rollout <type>', type: 'String', default: 'DUAL_CREDENTIAL_GRACE_PERIOD', desc: 'Rollout: IMMEDIATE, STAGED, DUAL_CREDENTIAL_GRACE_PERIOD' },
          { flag: '--emergency', type: 'boolean', default: 'false', desc: 'Execute emergency immediate rotation with old-version invalidation' },
          { flag: '--reason, -r <msg>', type: 'String', default: 'None', desc: 'Audit reason for rotation' }
        ],
        envVars: [],
        permissions: 'Rotate permission on secret',
        example: 'secretvault rotation start DB_ADMIN_PASS --strategy ON_DEMAND --rollout STAGED',
        exitCodes: '0 on success, 1 on failure',
        related: ['cli-rotation-emergency', 'cli-rotation-impact']
      },
      {
        id: 'cli-rotation-cancel',
        name: 'secretvault rotation cancel',
        summary: 'Cancel an active or queued rotation job',
        verificationStatus: 'Implemented and verified',
        syntax: 'secretvault rotation cancel <jobId>',
        arguments: [{ name: '<jobId>', required: true, desc: 'Rotation Job UUID' }],
        options: [],
        envVars: [],
        permissions: 'Admin permission on workspace',
        example: 'secretvault rotation cancel 4a8b...',
        exitCodes: '0 on success',
        related: ['cli-rotation-list']
      },
      {
        id: 'cli-rotation-retry',
        name: 'secretvault rotation retry',
        summary: 'Retry a failed rotation job',
        verificationStatus: 'Implemented and verified',
        syntax: 'secretvault rotation retry <jobId>',
        arguments: [{ name: '<jobId>', required: true, desc: 'Rotation Job UUID' }],
        options: [],
        envVars: [],
        permissions: 'Rotate permission on secret',
        example: 'secretvault rotation retry 4a8b...',
        exitCodes: '0 on success',
        related: ['cli-rotation-get']
      },
      {
        id: 'cli-rotation-rollback',
        name: 'secretvault rotation rollback',
        summary: 'Rollback a secret rotation job to a target or previous version',
        verificationStatus: 'Implemented and verified',
        syntax: 'secretvault rotation rollback <jobId> [options]',
        arguments: [{ name: '<jobId>', required: true, desc: 'Rotation Job UUID to rollback' }],
        options: [
          { flag: '--target-version <num>', type: 'Integer', default: 'Previous version', desc: 'Specific previous version number to rollback to' },
          { flag: '--reason, -r <msg>', type: 'String', default: 'Rollback triggered via CLI', desc: 'Audit reason for rollback' },
          ...CLI_GLOBAL_FLAGS.slice(5)
        ],
        envVars: [],
        permissions: 'Rotate / Admin permission on secret',
        example: 'secretvault rotation rollback 4a8b... --target-version 2 --reason "Canary smoke test failed"',
        exitCodes: '0 on success, 1 on error',
        related: ['cli-rotation-get', 'cli-secret-rollback']
      },
      {
        id: 'cli-rotation-policy-get',
        name: 'secretvault rotation policy get',
        summary: 'Get rotation policy configuration and schedule for a secret',
        verificationStatus: 'Implemented and verified',
        syntax: 'secretvault rotation policy get <name|uuid>',
        arguments: [{ name: '<name|uuid>', required: true, desc: 'Secret key name or UUID' }],
        options: CLI_GLOBAL_FLAGS.slice(5),
        envVars: [],
        permissions: 'Read permission on secret',
        example: 'secretvault rotation policy get DB_ADMIN_PASS',
        exitCodes: '0 on success, 1 if not found',
        related: ['cli-rotation-policy-set', 'cli-rotation-policy-disable']
      },
      {
        id: 'cli-rotation-policy-set',
        name: 'secretvault rotation policy set',
        summary: 'Create or update automated rotation policy for a secret',
        verificationStatus: 'Implemented and verified',
        syntax: 'secretvault rotation policy set <name|uuid> [options]',
        arguments: [{ name: '<name|uuid>', required: true, desc: 'Secret key name or UUID' }],
        options: [
          { flag: '--enabled', type: 'boolean', default: 'true', desc: 'Enable or disable automatic rotation' },
          { flag: '--interval, --interval-days <days>', type: 'int', default: '30', desc: 'Rotation interval in days' },
          { flag: '--window, --window-hours <hours>', type: 'int', default: '24', desc: 'Rotation execution window in hours' },
          { flag: '--grace-period, --grace-minutes <mins>', type: 'int', default: '60', desc: 'Dual-credential grace period in minutes' },
          { flag: '--strategy <type>', type: 'String', default: 'SCHEDULED', desc: 'Strategy: SCHEDULED, ON_DEMAND, EXPIRY_BASED, EVENT_DRIVEN' },
          { flag: '--rollout <type>', type: 'String', default: 'DUAL_CREDENTIAL_GRACE_PERIOD', desc: 'Rollout: IMMEDIATE, STAGED, DUAL_CREDENTIAL_GRACE_PERIOD' },
          { flag: '--validation <type>', type: 'String', default: 'CONNECTIVITY', desc: 'Validation: NONE, CONNECTIVITY, AUTHENTICATION, PROVIDER_API, DATABASE_CONNECTION, APPLICATION_HEALTH' },
          { flag: '--max-retries <num>', type: 'int', default: '3', desc: 'Maximum retry attempts upon failure' },
          { flag: '--auto-revoke', type: 'boolean', default: 'true', desc: 'Automatically revoke previous secret version after grace period' },
          { flag: '--auto-rollback', type: 'boolean', default: 'true', desc: 'Automatically rollback if validation or health checks fail' }
        ],
        envVars: [],
        permissions: 'Admin permission on secret',
        example: 'secretvault rotation policy set DB_ADMIN_PASS --interval 30 --grace-period 60 --strategy SCHEDULED',
        exitCodes: '0 on success, 1 on invalid options',
        related: ['cli-rotation-policy-get', 'cli-rotation-policy-disable']
      },
      {
        id: 'cli-rotation-policy-disable',
        name: 'secretvault rotation policy disable',
        summary: 'Disable automatic rotation policy for a secret',
        verificationStatus: 'Implemented and verified',
        syntax: 'secretvault rotation policy disable <name|uuid>',
        arguments: [{ name: '<name|uuid>', required: true, desc: 'Secret key name or UUID' }],
        options: [],
        envVars: [],
        permissions: 'Admin permission on secret',
        example: 'secretvault rotation policy disable DB_ADMIN_PASS',
        exitCodes: '0 on success, 1 if not found',
        related: ['cli-rotation-policy-get', 'cli-rotation-policy-set']
      },
      {
        id: 'cli-rotation-emergency',
        name: 'secretvault rotation emergency',
        summary: 'Perform emergency rotation and immediate invalidation for a compromised secret',
        verificationStatus: 'Implemented and verified',
        syntax: 'secretvault rotation emergency <name|uuid> [options]',
        arguments: [{ name: '<name|uuid>', required: true, desc: 'Secret key name or UUID' }],
        options: [
          { flag: '--reason, -r <msg>', type: 'String', default: 'None', desc: 'Mandatory breach / compromise incident rationale' }
        ],
        envVars: [],
        permissions: 'Admin / Security Officer permission',
        example: 'secretvault rotation emergency AWS_SECRET_ACCESS_KEY --reason "Found committed in public branch"',
        exitCodes: '0 on success, 1 on failure',
        related: ['cli-secret-compromise', 'cli-incident-create']
      },
      {
        id: 'cli-rotation-impact',
        name: 'secretvault rotation impact',
        summary: 'Analyze runtime dependencies, affected consumers, and machines prior to rotation',
        verificationStatus: 'Implemented and verified',
        syntax: 'secretvault rotation impact <name|uuid>',
        arguments: [{ name: '<name|uuid>', required: true, desc: 'Secret key name or UUID' }],
        options: CLI_GLOBAL_FLAGS.slice(5),
        envVars: [],
        permissions: 'Read permission on secret',
        example: 'secretvault rotation impact OAUTH_SIGNING_KEY',
        exitCodes: '0 on success',
        related: ['cli-consumer-list', 'cli-lease-list']
      },
      {
        id: 'cli-secret-compromise',
        name: 'secretvault secret compromise',
        summary: 'Mark secret compromised, execute immediate emergency rotation, and revoke all active leases',
        verificationStatus: 'Implemented and verified',
        syntax: 'secretvault secret compromise <name|uuid> [options]',
        arguments: [{ name: '<name|uuid>', required: true, desc: 'Secret key name or UUID' }],
        options: [
          { flag: '--reason, -r <msg>', type: 'String', default: 'Secret marked compromised via CLI', desc: 'Incident reason or CVE ID' }
        ],
        envVars: [],
        permissions: 'Security Officer / Workspace Admin',
        example: 'secretvault secret compromise GITHUB_WEBHOOK_SECRET --reason "CVE-2026-4401 exposure in logs"',
        exitCodes: '0 on success, 1 on failure',
        related: ['cli-rotation-emergency', 'cli-incident-create']
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // 7. Runtime Leases & Registered Consumers
  // ---------------------------------------------------------------------------
  {
    groupId: 'cli-runtime-group',
    groupTitle: 'Runtime Leases & Consumers',
    commands: [
      {
        id: 'cli-lease-list',
        name: 'secretvault lease list',
        summary: 'List active and historical secret leases across workloads',
        verificationStatus: 'Implemented and verified',
        syntax: 'secretvault lease list [options]',
        arguments: [],
        options: [
          { flag: '--status <status>', type: 'String', default: 'ACTIVE', desc: 'Filter: ACTIVE, EXPIRED, REVOKED' },
          ...CLI_GLOBAL_FLAGS.slice(5)
        ],
        envVars: [],
        permissions: 'Read permission on environment',
        example: 'secretvault lease list',
        exitCodes: '0 on success',
        related: ['cli-lease-get', 'cli-lease-renew', 'cli-lease-revoke']
      },
      {
        id: 'cli-lease-get',
        name: 'secretvault lease get',
        summary: 'Get detailed information about a secret lease',
        verificationStatus: 'Implemented and verified',
        syntax: 'secretvault lease get <leaseId>',
        arguments: [{ name: '<leaseId>', required: true, desc: 'Lease UUID' }],
        options: CLI_GLOBAL_FLAGS.slice(5),
        envVars: [],
        permissions: 'Read permission on environment',
        example: 'secretvault lease get 8f1e...',
        exitCodes: '0 on success',
        related: ['cli-lease-list']
      },
      {
        id: 'cli-lease-renew',
        name: 'secretvault lease renew',
        summary: 'Renew an active secret lease and extend its TTL duration',
        verificationStatus: 'Implemented and verified',
        syntax: 'secretvault lease renew <leaseId> [options]',
        arguments: [{ name: '<leaseId>', required: true, desc: 'Lease UUID' }],
        options: [
          { flag: '--extend-seconds <sec>', type: 'int', default: '3600', desc: 'Seconds to extend the lease TTL' }
        ],
        envVars: [],
        permissions: 'Workload identity or Lease owner',
        example: 'secretvault lease renew 8f1e... --extend-seconds 7200',
        exitCodes: '0 on success, 1 on expired or unauthorized',
        related: ['cli-lease-revoke']
      },
      {
        id: 'cli-lease-revoke',
        name: 'secretvault lease revoke',
        summary: 'Revoke an active secret lease immediately',
        verificationStatus: 'Implemented and verified',
        syntax: 'secretvault lease revoke <leaseId> [options]',
        arguments: [{ name: '<leaseId>', required: true, desc: 'Lease UUID' }],
        options: [
          { flag: '--reason <msg>', type: 'String', default: 'Revoked via CLI', desc: 'Audit revocation reason' }
        ],
        envVars: [],
        permissions: 'Admin or Lease owner',
        example: 'secretvault lease revoke 8f1e... --reason "Worker node decommissioned"',
        exitCodes: '0 on success',
        related: ['cli-lease-renew']
      },
      {
        id: 'cli-consumer-list',
        name: 'secretvault consumer list',
        summary: 'List registered secret consumers, SDK instances, and heartbeat statuses',
        verificationStatus: 'Implemented and verified',
        syntax: 'secretvault consumer list [options]',
        arguments: [],
        options: CLI_GLOBAL_FLAGS.slice(5),
        envVars: [],
        permissions: 'Read permission on workspace',
        example: 'secretvault consumer list',
        exitCodes: '0 on success',
        related: ['cli-consumer-get', 'cli-consumer-disable']
      },
      {
        id: 'cli-consumer-get',
        name: 'secretvault consumer get',
        summary: 'Get detailed metadata and active leases for a registered consumer',
        verificationStatus: 'Implemented and verified',
        syntax: 'secretvault consumer get <consumerId>',
        arguments: [{ name: '<consumerId>', required: true, desc: 'Consumer UUID or workload client ID' }],
        options: CLI_GLOBAL_FLAGS.slice(5),
        envVars: [],
        permissions: 'Read permission on workspace',
        example: 'secretvault consumer get worker-node-04',
        exitCodes: '0 on success',
        related: ['cli-consumer-list']
      },
      {
        id: 'cli-consumer-disable',
        name: 'secretvault consumer disable',
        summary: 'Disable a consumer from retrieving secrets or renewing leases',
        verificationStatus: 'Implemented and verified',
        syntax: 'secretvault consumer disable <consumerId>',
        arguments: [{ name: '<consumerId>', required: true, desc: 'Consumer UUID' }],
        options: [],
        envVars: [],
        permissions: 'Admin permission on workspace',
        example: 'secretvault consumer disable 5c2d...',
        exitCodes: '0 on success',
        related: ['cli-consumer-list']
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // 8. Runtime Injection & .env File Sync
  // ---------------------------------------------------------------------------
  {
    groupId: 'cli-run-env-group',
    groupTitle: 'Runtime Injection & .env Sync',
    commands: [
      {
        id: 'cli-run',
        name: 'secretvault run',
        summary: 'Execute child commands with SecretVault secrets injected directly into process memory',
        verificationStatus: 'Implemented and verified',
        syntax: 'secretvault run [options] -- <commandToRun>...',
        arguments: [
          { name: '<commandToRun>...', required: true, desc: 'Command and arguments to execute (prefixed with --)' }
        ],
        options: [
          { flag: '-S, --secret <key>', type: 'List<String>', default: 'All', desc: 'Explicit secret keys to inject (can be specified multiple times)' },
          { flag: '--override / --no-override', type: 'boolean', default: 'true', desc: 'Override host environment variables with SecretVault secrets' },
          ...CLI_GLOBAL_FLAGS.slice(0, 5)
        ],
        envVars: [],
        permissions: 'Read access on target project/environment',
        example: 'secretvault run --project backend --env development -- npm run dev',
        exitCodes: 'Forwards child process exit code (0 on clean termination, 1 on injection failure)',
        related: ['cli-env-pull', 'cli-dev-init']
      },
      {
        id: 'cli-env-pull',
        name: 'secretvault env pull',
        summary: 'Pull environment secrets into stdout or safely write to a local .env file',
        verificationStatus: 'Implemented and verified',
        syntax: 'secretvault env pull [options]',
        arguments: [],
        options: [
          { flag: '-o, --output <path>', type: 'String', default: 'stdout', desc: 'Target file path to write (e.g. .env, .env.local)' },
          { flag: '-f, --format <format>', type: 'String', default: 'env', desc: 'Output format: env (KEY=val), json, shell (export KEY=val)' },
          { flag: '--stdout', type: 'boolean', default: 'false', desc: 'Force printing decrypted secrets directly to stdout' },
          { flag: '-y, --yes', type: 'boolean', default: 'false', desc: 'Skip file write warning prompt' },
          ...CLI_GLOBAL_FLAGS.slice(0, 5)
        ],
        envVars: [],
        permissions: 'Read access on target environment',
        example: 'secretvault env pull --output .env.local --yes',
        exitCodes: '0 on success, 1 on error',
        related: ['cli-env-push', 'cli-run']
      },
      {
        id: 'cli-env-push',
        name: 'secretvault env push',
        summary: 'Push local .env key-value pairs to SecretVault environment',
        verificationStatus: 'Implemented and verified',
        syntax: 'secretvault env push [options]',
        arguments: [],
        options: [
          { flag: '-f, --file <path>', type: 'String', default: '.env', desc: 'Path to local .env file' },
          { flag: '--dry-run', type: 'boolean', default: 'false', desc: 'Preview planned changes without mutating remote secrets' },
          { flag: '-y, --yes', type: 'boolean', default: 'false', desc: 'Skip confirmation prompt' },
          { flag: '--overwrite', type: 'boolean', default: 'true', desc: 'Allow updating values for existing secret keys' },
          ...CLI_GLOBAL_FLAGS.slice(0, 5)
        ],
        envVars: [],
        permissions: 'Write access on target environment',
        example: 'secretvault env push --file .env.production --dry-run',
        exitCodes: '0 on success, 1 on error',
        related: ['cli-env-pull']
      },
      {
        id: 'cli-dev-init',
        name: 'secretvault dev init',
        summary: 'Bootstrap .secretvault/project.json in current directory to link workspace and project context',
        verificationStatus: 'Implemented and verified',
        syntax: 'secretvault dev init [options]',
        arguments: [],
        options: CLI_GLOBAL_FLAGS.slice(0, 5),
        envVars: [],
        permissions: 'Read access on target project',
        example: 'secretvault dev init --project auth-service --env development',
        exitCodes: '0 on success, 1 on error',
        related: ['cli-context-set', 'cli-run']
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // 9. Machine Identities & CI/CD Workloads
  // ---------------------------------------------------------------------------
  {
    groupId: 'cli-machine-group',
    groupTitle: 'Machine Identities & CI/CD',
    commands: [
      {
        id: 'cli-machine-list',
        name: 'secretvault machine list',
        summary: 'List all machine identities in the active workspace',
        verificationStatus: 'Implemented and verified',
        syntax: 'secretvault machine list [options]',
        arguments: [],
        options: CLI_GLOBAL_FLAGS.slice(5),
        envVars: [],
        permissions: 'Workspace member',
        example: 'secretvault machine list',
        exitCodes: '0 on success',
        related: ['cli-machine-get', 'cli-machine-status', 'cli-auth-oidc']
      },
      {
        id: 'cli-machine-get',
        name: 'secretvault machine get',
        summary: 'Get detailed information about a machine identity',
        verificationStatus: 'Implemented and verified',
        syntax: 'secretvault machine get <machineId>',
        arguments: [{ name: '<machineId>', required: true, desc: 'Machine Identity UUID or name' }],
        options: CLI_GLOBAL_FLAGS.slice(5),
        envVars: [],
        permissions: 'Workspace member',
        example: 'secretvault machine get github-runner-prod',
        exitCodes: '0 on success',
        related: ['cli-machine-list']
      },
      {
        id: 'cli-machine-status',
        name: 'secretvault machine status',
        summary: 'Display current status and health of a machine identity',
        verificationStatus: 'Implemented and verified',
        syntax: 'secretvault machine status <machineId>',
        arguments: [{ name: '<machineId>', required: true, desc: 'Machine Identity UUID' }],
        options: CLI_GLOBAL_FLAGS.slice(5),
        envVars: [],
        permissions: 'Workspace member',
        example: 'secretvault machine status 9b1c...',
        exitCodes: '0 on success',
        related: ['cli-machine-get']
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // 10. Repository Secret Scanning & Finding Remediation
  // ---------------------------------------------------------------------------
  {
    groupId: 'cli-scan-group',
    groupTitle: 'Repository Scanning & Leaks',
    commands: [
      {
        id: 'cli-scan',
        name: 'secretvault scan',
        summary: 'Scan source code, Git history, and configuration files for exposed secrets and credentials',
        verificationStatus: 'Implemented and verified',
        syntax: 'secretvault scan [options] <path>',
        arguments: [
          { name: '<path>', required: false, desc: "Target directory path to scan (default: current directory '.')" }
        ],
        options: [
          { flag: '--git-history', type: 'boolean', default: 'false', desc: 'Scan Git commit history for previously introduced secrets' },
          { flag: '--staged', type: 'boolean', default: 'false', desc: 'Scan only Git staged files (pre-commit hook mode)' },
          { flag: '--fail-on <severity>', type: 'String', default: 'HIGH', desc: 'Fail CI gate on finding severity: CRITICAL, HIGH, MEDIUM, LOW' },
          { flag: '--sarif', type: 'boolean', default: 'false', desc: 'Output results in standard SARIF v2.1.0 format for CI/CD gates' },
          { flag: '--repository <id>', type: 'UUID', default: 'None', desc: 'Associate scan with registered SecretVault repository ID' },
          ...CLI_GLOBAL_FLAGS.slice(5)
        ],
        envVars: [],
        permissions: 'Valid workspace context',
        example: 'secretvault scan . --git-history --fail-on CRITICAL --sarif > results.sarif',
        exitCodes: '0 = Clean / No blocking findings, 1 = Findings detected above threshold, 2 = Scanner error, 3 = Config error, 4 = Forbidden, 5 = Network error',
        related: ['cli-finding-list', 'cli-repository-connect']
      },
      {
        id: 'cli-repo-list',
        name: 'secretvault repository list',
        aliases: ['secretvault repo list'],
        summary: 'List registered repositories in the active workspace',
        verificationStatus: 'Implemented and verified',
        syntax: 'secretvault repository list [options]',
        arguments: [],
        options: CLI_GLOBAL_FLAGS.slice(5),
        envVars: [],
        permissions: 'Workspace member',
        example: 'secretvault repository list',
        exitCodes: '0 on success',
        related: ['cli-repo-get', 'cli-repo-connect', 'cli-repo-scan']
      },
      {
        id: 'cli-repo-get',
        name: 'secretvault repository get',
        aliases: ['secretvault repo get'],
        summary: 'Get details of a registered repository',
        verificationStatus: 'Implemented and verified',
        syntax: 'secretvault repository get <repoId>',
        arguments: [{ name: '<repoId>', required: true, desc: 'Repository UUID' }],
        options: CLI_GLOBAL_FLAGS.slice(5),
        envVars: [],
        permissions: 'Workspace member',
        example: 'secretvault repository get 1c2d...',
        exitCodes: '0 on success',
        related: ['cli-repo-list']
      },
      {
        id: 'cli-repo-connect',
        name: 'secretvault repository connect',
        aliases: ['secretvault repo connect'],
        summary: 'Connect a code repository for continuous scanning',
        verificationStatus: 'Implemented and verified',
        syntax: 'secretvault repository connect --owner=<owner> --name=<name> [options]',
        arguments: [],
        options: [
          { flag: '--owner <owner>', type: 'String', default: 'Required', desc: 'Repository owner or organization' },
          { flag: '--name <name>', type: 'String', default: 'Required', desc: 'Repository name' },
          { flag: '--provider <provider>', type: 'String', default: 'GITHUB', desc: 'Repository provider: GITHUB, GITLAB, BITBUCKET' },
          { flag: '--branch <branch>', type: 'String', default: 'main', desc: 'Default branch to monitor' },
          { flag: '--clone-url <url>', type: 'String', default: 'None', desc: 'Git clone URL' },
          { flag: '--visibility <type>', type: 'String', default: 'PRIVATE', desc: 'Visibility: PRIVATE, PUBLIC, INTERNAL' }
        ],
        envVars: [],
        permissions: 'Admin permission on workspace',
        example: 'secretvault repository connect --owner AcmeCorp --name payment-service --branch main',
        exitCodes: '0 on success, 1 on error',
        related: ['cli-repo-scan', 'cli-repo-list']
      },
      {
        id: 'cli-repo-scan',
        name: 'secretvault repository scan',
        aliases: ['secretvault repo scan'],
        summary: 'Trigger a remote secret scan on a connected repository',
        verificationStatus: 'Implemented and verified',
        syntax: 'secretvault repository scan <repoId> [options]',
        arguments: [{ name: '<repoId>', required: true, desc: 'Repository UUID' }],
        options: [
          { flag: '--type <type>', type: 'String', default: 'INCREMENTAL', desc: 'Scan type: FULL, INCREMENTAL, GIT_HISTORY' },
          { flag: '--branch <branch>', type: 'String', default: 'Default', desc: 'Target branch to scan' }
        ],
        envVars: [],
        permissions: 'Admin permission on workspace',
        example: 'secretvault repository scan 1c2d... --type FULL',
        exitCodes: '0 on success',
        related: ['cli-repo-get', 'cli-finding-list']
      },
      {
        id: 'cli-finding-list',
        name: 'secretvault finding list',
        summary: 'List secret findings across repositories in active workspace',
        verificationStatus: 'Implemented and verified',
        syntax: 'secretvault finding list [options]',
        arguments: [],
        options: [
          { flag: '--repository <uuid>', type: 'UUID', default: 'None', desc: 'Filter by repository UUID' },
          { flag: '--severity <level>', type: 'String', default: 'None', desc: 'Filter by severity: CRITICAL, HIGH, MEDIUM, LOW' },
          { flag: '--status <status>', type: 'String', default: 'None', desc: 'Filter: DETECTED, CONFIRMED, RESOLVED, FALSE_POSITIVE, IGNORED' },
          { flag: '--search <query>', type: 'String', default: 'None', desc: 'Search query for file path, detector, or fingerprint' },
          ...CLI_GLOBAL_FLAGS.slice(5)
        ],
        envVars: [],
        permissions: 'Workspace member',
        example: 'secretvault finding list --severity CRITICAL --status DETECTED',
        exitCodes: '0 on success',
        related: ['cli-finding-get', 'cli-finding-why', 'cli-finding-remediate']
      },
      {
        id: 'cli-finding-get',
        name: 'secretvault finding get',
        summary: 'View full details and masked evidence for a finding',
        verificationStatus: 'Implemented and verified',
        syntax: 'secretvault finding get <findingId>',
        arguments: [{ name: '<findingId>', required: true, desc: 'Finding UUID' }],
        options: CLI_GLOBAL_FLAGS.slice(5),
        envVars: [],
        permissions: 'Workspace member',
        example: 'secretvault finding get 3a4b...',
        exitCodes: '0 on success',
        related: ['cli-finding-why', 'cli-finding-confirm']
      },
      {
        id: 'cli-finding-why',
        name: 'secretvault finding why-exposed',
        summary: 'Explain why this secret is considered exposed (WhyExposed / Explainability)',
        verificationStatus: 'Implemented and verified',
        syntax: 'secretvault finding why-exposed <findingId>',
        arguments: [{ name: '<findingId>', required: true, desc: 'Finding UUID' }],
        options: [],
        envVars: [],
        permissions: 'Workspace member',
        example: 'secretvault finding why-exposed 3a4b...',
        exitCodes: '0 on success',
        related: ['cli-finding-remediate']
      },
      {
        id: 'cli-finding-confirm',
        name: 'secretvault finding confirm',
        summary: 'Mark a finding as CONFIRMED real credential',
        verificationStatus: 'Implemented and verified',
        syntax: 'secretvault finding confirm <findingId> [options]',
        arguments: [{ name: '<findingId>', required: true, desc: 'Finding UUID' }],
        options: [
          { flag: '--reason <msg>', type: 'String', default: 'Confirmed by CLI user', desc: 'Reason for confirmation' }
        ],
        envVars: [],
        permissions: 'Security Officer / Workspace Admin',
        example: 'secretvault finding confirm 3a4b... --reason "Verified live Stripe secret in commit history"',
        exitCodes: '0 on success',
        related: ['cli-finding-remediate']
      },
      {
        id: 'cli-finding-ignore',
        name: 'secretvault finding ignore',
        summary: 'Mark a finding as IGNORED or FALSE_POSITIVE',
        verificationStatus: 'Implemented and verified',
        syntax: 'secretvault finding ignore <findingId> [options]',
        arguments: [{ name: '<findingId>', required: true, desc: 'Finding UUID' }],
        options: [
          { flag: '--reason <msg>', type: 'String', default: 'Ignored by CLI user', desc: 'Reason for ignoring' },
          { flag: '--false-positive', type: 'boolean', default: 'false', desc: 'Mark specifically as FALSE_POSITIVE' }
        ],
        envVars: [],
        permissions: 'Security Officer / Workspace Admin',
        example: 'secretvault finding ignore 3a4b... --false-positive --reason "Mock secret in unit test"',
        exitCodes: '0 on success',
        related: ['cli-finding-list']
      },
      {
        id: 'cli-finding-remediate',
        name: 'secretvault finding remediate',
        summary: 'Execute automated remediation (ROTATE_SECRET, REVOKE_SECRET, MARK_FALSE_POSITIVE)',
        verificationStatus: 'Implemented and verified',
        syntax: 'secretvault finding remediate <findingId> --action=<action> [options]',
        arguments: [{ name: '<findingId>', required: true, desc: 'Finding UUID' }],
        options: [
          { flag: '--action <action>', type: 'String', default: 'Required', desc: 'Action: ROTATE_SECRET, REVOKE_SECRET, MARK_FALSE_POSITIVE, IGNORE' },
          { flag: '--notes <notes>', type: 'String', default: 'None', desc: 'Remediation audit notes' }
        ],
        envVars: [],
        permissions: 'Security Officer / Workspace Admin',
        example: 'secretvault finding remediate 3a4b... --action ROTATE_SECRET --notes "Auto-rotated via CLI"',
        exitCodes: '0 on success, 1 on failure',
        related: ['cli-rotation-start', 'cli-secret-compromise']
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // 11. Security Automation & Approvals
  // ---------------------------------------------------------------------------
  {
    groupId: 'cli-automation-group',
    groupTitle: 'Security Automation & Approvals',
    commands: [
      {
        id: 'cli-auto-list',
        name: 'secretvault automation policies',
        aliases: ['secretvault auto list'],
        summary: 'List security automation policies and trigger conditions',
        verificationStatus: 'Implemented and verified',
        syntax: 'secretvault automation policies [options]',
        arguments: [],
        options: [
          { flag: '--limit <num>', type: 'int', default: '50', desc: 'Maximum policies to display' },
          ...CLI_GLOBAL_FLAGS.slice(5)
        ],
        envVars: [],
        permissions: 'Workspace member',
        example: 'secretvault automation policies',
        exitCodes: '0 on success',
        related: ['cli-auto-get', 'cli-auto-approvals']
      },
      {
        id: 'cli-auto-get',
        name: 'secretvault automation get',
        aliases: ['secretvault auto get'],
        summary: 'Get automation policy details and trigger conditions',
        verificationStatus: 'Implemented and verified',
        syntax: 'secretvault automation get <policyId>',
        arguments: [{ name: '<policyId>', required: true, desc: 'Policy UUID' }],
        options: CLI_GLOBAL_FLAGS.slice(5),
        envVars: [],
        permissions: 'Workspace member',
        example: 'secretvault automation get 7f8a...',
        exitCodes: '0 on success',
        related: ['cli-auto-list']
      },
      {
        id: 'cli-auto-enable',
        name: 'secretvault automation enable',
        aliases: ['secretvault auto enable'],
        summary: 'Enable an automation policy',
        verificationStatus: 'Implemented and verified',
        syntax: 'secretvault automation enable <policyId>',
        arguments: [{ name: '<policyId>', required: true, desc: 'Policy UUID' }],
        options: [],
        envVars: [],
        permissions: 'Admin permission on workspace',
        example: 'secretvault automation enable 7f8a...',
        exitCodes: '0 on success',
        related: ['cli-auto-disable']
      },
      {
        id: 'cli-auto-disable',
        name: 'secretvault automation disable',
        aliases: ['secretvault auto disable'],
        summary: 'Disable an automation policy',
        verificationStatus: 'Implemented and verified',
        syntax: 'secretvault automation disable <policyId>',
        arguments: [{ name: '<policyId>', required: true, desc: 'Policy UUID' }],
        options: [],
        envVars: [],
        permissions: 'Admin permission on workspace',
        example: 'secretvault automation disable 7f8a...',
        exitCodes: '0 on success',
        related: ['cli-auto-enable']
      },
      {
        id: 'cli-auto-delete',
        name: 'secretvault automation delete',
        aliases: ['secretvault auto delete'],
        summary: 'Permanently remove a security automation policy',
        verificationStatus: 'Implemented and verified',
        syntax: 'secretvault automation delete <policyId> [options]',
        arguments: [{ name: '<policyId>', required: true, desc: 'Automation Policy UUID' }],
        options: [
          { flag: '-y, --yes', type: 'boolean', default: 'false', desc: 'Bypass confirmation prompt' }
        ],
        envVars: [],
        permissions: 'Admin permission on workspace',
        example: 'secretvault automation delete 7f8a... --yes',
        exitCodes: '0 on success, 1 on error',
        related: ['cli-auto-list']
      },
      {
        id: 'cli-auto-approvals',
        name: 'secretvault automation approvals',
        aliases: ['secretvault auto approvals'],
        summary: 'List pending or decided automation approvals',
        verificationStatus: 'Implemented and verified',
        syntax: 'secretvault automation approvals [options]',
        arguments: [],
        options: [
          { flag: '--status <status>', type: 'String', default: 'None', desc: 'Filter: PENDING, APPROVED, REJECTED, EXPIRED' },
          { flag: '--limit <num>', type: 'int', default: '50', desc: 'Maximum approvals to display' }
        ],
        envVars: [],
        permissions: 'Workspace member',
        example: 'secretvault automation approvals --status PENDING',
        exitCodes: '0 on success',
        related: ['cli-auto-approve', 'cli-auto-reject']
      },
      {
        id: 'cli-auto-approve',
        name: 'secretvault automation approve',
        aliases: ['secretvault auto approve'],
        summary: 'Approve a sensitive automation action',
        verificationStatus: 'Implemented and verified',
        syntax: 'secretvault automation approve <approvalId>',
        arguments: [{ name: '<approvalId>', required: true, desc: 'Approval UUID' }],
        options: [],
        envVars: [],
        permissions: 'Approver role on policy',
        example: 'secretvault automation approve 2d3e...',
        exitCodes: '0 on success, 1 on error',
        related: ['cli-auto-reject']
      },
      {
        id: 'cli-auto-reject',
        name: 'secretvault automation reject',
        aliases: ['secretvault auto reject'],
        summary: 'Reject a sensitive automation action',
        verificationStatus: 'Implemented and verified',
        syntax: 'secretvault automation reject <approvalId> [options]',
        arguments: [{ name: '<approvalId>', required: true, desc: 'Approval UUID' }],
        options: [
          { flag: '--reason <msg>', type: 'String', default: 'Rejected via CLI', desc: 'Reason for rejection' }
        ],
        envVars: [],
        permissions: 'Approver role on policy',
        example: 'secretvault automation reject 2d3e... --reason "Outside maintenance window"',
        exitCodes: '0 on success',
        related: ['cli-auto-approve']
      },
      {
        id: 'cli-auto-executions',
        name: 'secretvault automation executions',
        aliases: ['secretvault auto executions'],
        summary: 'List automation policy execution audit logs',
        verificationStatus: 'Implemented and verified',
        syntax: 'secretvault automation executions [options]',
        arguments: [],
        options: [
          { flag: '--limit <num>', type: 'int', default: '50', desc: 'Maximum execution logs to display' }
        ],
        envVars: [],
        permissions: 'Workspace member',
        example: 'secretvault automation executions',
        exitCodes: '0 on success',
        related: ['cli-auto-list']
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // 12. Domain Events, Webhooks & Incidents
  // ---------------------------------------------------------------------------
  {
    groupId: 'cli-events-incidents-group',
    groupTitle: 'Events, Webhooks & Incidents',
    commands: [
      {
        id: 'cli-events-list',
        name: 'secretvault events list',
        aliases: ['secretvault event list'],
        summary: 'List immutable domain events in workspace',
        verificationStatus: 'Implemented and verified',
        syntax: 'secretvault events list [options]',
        arguments: [],
        options: [
          { flag: '--event-type <type>', type: 'String', default: 'None', desc: 'Filter by event type (e.g. SECRET_ROTATED)' },
          { flag: '--limit <num>', type: 'int', default: '50', desc: 'Maximum events to display' },
          ...CLI_GLOBAL_FLAGS.slice(5)
        ],
        envVars: [],
        permissions: 'Workspace audit role',
        example: 'secretvault events list --event-type SECRET_ROTATED',
        exitCodes: '0 on success',
        related: ['cli-events-get', 'cli-events-replay']
      },
      {
        id: 'cli-events-get',
        name: 'secretvault events get',
        aliases: ['secretvault event get'],
        summary: 'Get full payload and metadata for an immutable domain event',
        verificationStatus: 'Implemented and verified',
        syntax: 'secretvault events get <eventId>',
        arguments: [{ name: '<eventId>', required: true, desc: 'Domain Event UUID' }],
        options: CLI_GLOBAL_FLAGS.slice(5),
        envVars: [],
        permissions: 'Workspace audit role',
        example: 'secretvault events get e4b7a120-...',
        exitCodes: '0 on success, 1 if not found',
        related: ['cli-events-list']
      },
      {
        id: 'cli-events-replays',
        name: 'secretvault events replays',
        aliases: ['secretvault event replays'],
        summary: 'List historical and active event replay operations',
        verificationStatus: 'Implemented and verified',
        syntax: 'secretvault events replays [options]',
        arguments: [],
        options: [
          { flag: '--limit <num>', type: 'int', default: '50', desc: 'Maximum replay requests to display' },
          ...CLI_GLOBAL_FLAGS.slice(5)
        ],
        envVars: [],
        permissions: 'Workspace member',
        example: 'secretvault events replays',
        exitCodes: '0 on success',
        related: ['cli-events-replay', 'cli-events-list']
      },
      {
        id: 'cli-events-replay',
        name: 'secretvault events replay',
        aliases: ['secretvault event replay'],
        summary: 'Request replay of domain events to downstream consumers',
        verificationStatus: 'Implemented and verified',
        syntax: 'secretvault events replay [options]',
        arguments: [],
        options: [
          { flag: '--event-type <type>', type: 'String', default: 'None', desc: 'Event type to replay' },
          { flag: '--reason <msg>', type: 'String', default: 'Replay requested via CLI', desc: 'Audit rationale for replay' }
        ],
        envVars: [],
        permissions: 'Admin permission on workspace',
        example: 'secretvault events replay --event-type SECRET_ROTATED --reason "Backfilling analytics"',
        exitCodes: '0 on success',
        related: ['cli-events-list']
      },
      {
        id: 'cli-webhook-list',
        name: 'secretvault webhook list',
        aliases: ['secretvault webhooks list'],
        summary: 'List configured webhook endpoints and health status',
        verificationStatus: 'Implemented and verified',
        syntax: 'secretvault webhook list [options]',
        arguments: [],
        options: [
          { flag: '--limit <num>', type: 'int', default: '50', desc: 'Maximum endpoints to display' },
          ...CLI_GLOBAL_FLAGS.slice(5)
        ],
        envVars: [],
        permissions: 'Workspace member',
        example: 'secretvault webhook list',
        exitCodes: '0 on success',
        related: ['cli-webhook-create', 'cli-webhook-deliveries']
      },
      {
        id: 'cli-webhook-create',
        name: 'secretvault webhook create',
        aliases: ['secretvault webhooks create'],
        summary: 'Register a new webhook endpoint with SSRF protection',
        verificationStatus: 'Implemented and verified',
        syntax: 'secretvault webhook create --url=<url> [options]',
        arguments: [],
        options: [
          { flag: '--url <url>', type: 'String', default: 'Required', desc: 'Destination HTTPS webhook URL (SSRF validated)' },
          { flag: '--description <text>', type: 'String', default: 'None', desc: 'Webhook description' },
          { flag: '--events <types>', type: 'String', default: '*', desc: 'Comma-separated event types or * for all' },
          { flag: '--secret <sharedSecret>', type: 'String', default: 'Auto-generated', desc: 'HMAC signature signing secret' }
        ],
        envVars: [],
        permissions: 'Admin permission on workspace',
        example: 'secretvault webhook create --url https://api.datadoghq.com/v1/events --events SECRET_ROTATED,SECRET_LEAK_DETECTED',
        exitCodes: '0 on success, 1 on SSRF check failure or invalid URL',
        related: ['cli-webhook-list', 'cli-webhook-delete']
      },
      {
        id: 'cli-webhook-get',
        name: 'secretvault webhook get',
        aliases: ['secretvault webhooks get'],
        summary: 'Get details and HMAC signing status for a webhook endpoint',
        verificationStatus: 'Implemented and verified',
        syntax: 'secretvault webhook get <webhookId>',
        arguments: [{ name: '<webhookId>', required: true, desc: 'Webhook Subscription UUID' }],
        options: CLI_GLOBAL_FLAGS.slice(5),
        envVars: [],
        permissions: 'Workspace member',
        example: 'secretvault webhook get 7c8d9e01-...',
        exitCodes: '0 on success, 1 if not found',
        related: ['cli-webhook-list', 'cli-webhook-deliveries']
      },
      {
        id: 'cli-webhook-delete',
        name: 'secretvault webhook delete',
        aliases: ['secretvault webhooks delete'],
        summary: 'Permanently remove an outbound webhook endpoint',
        verificationStatus: 'Implemented and verified',
        syntax: 'secretvault webhook delete <webhookId> [options]',
        arguments: [{ name: '<webhookId>', required: true, desc: 'Webhook Subscription UUID' }],
        options: [
          { flag: '-y, --yes', type: 'boolean', default: 'false', desc: 'Bypass confirmation prompt' }
        ],
        envVars: [],
        permissions: 'Admin permission on workspace',
        example: 'secretvault webhook delete 7c8d9e01-... --yes',
        exitCodes: '0 on success, 1 on error',
        related: ['cli-webhook-list']
      },
      {
        id: 'cli-webhook-deliveries',
        name: 'secretvault webhook deliveries',
        aliases: ['secretvault webhooks deliveries'],
        summary: 'List webhook delivery attempts and HTTP status codes',
        verificationStatus: 'Implemented and verified',
        syntax: 'secretvault webhook deliveries [options]',
        arguments: [],
        options: [
          { flag: '--webhook-id <uuid>', type: 'UUID', default: 'None', desc: 'Filter by specific endpoint' },
          { flag: '--status <status>', type: 'String', default: 'None', desc: 'Filter: DELIVERED, FAILED, RETRYING' },
          { flag: '--limit <num>', type: 'int', default: '50', desc: 'Maximum deliveries to display' }
        ],
        envVars: [],
        permissions: 'Workspace member',
        example: 'secretvault webhook deliveries --status FAILED',
        exitCodes: '0 on success',
        related: ['cli-webhook-replay']
      },
      {
        id: 'cli-webhook-replay',
        name: 'secretvault webhook replay',
        aliases: ['secretvault webhooks replay'],
        summary: 'Replay a failed webhook delivery attempt',
        verificationStatus: 'Implemented and verified',
        syntax: 'secretvault webhook replay <deliveryId>',
        arguments: [{ name: '<deliveryId>', required: true, desc: 'Delivery UUID' }],
        options: [],
        envVars: [],
        permissions: 'Admin permission on workspace',
        example: 'secretvault webhook replay 9c8b...',
        exitCodes: '0 on success',
        related: ['cli-webhook-deliveries']
      },
      {
        id: 'cli-incident-list',
        name: 'secretvault incident list',
        aliases: ['secretvault incidents list'],
        summary: 'List security incidents in workspace',
        verificationStatus: 'Implemented and verified',
        syntax: 'secretvault incident list [options]',
        arguments: [],
        options: [
          { flag: '--status <status>', type: 'String', default: 'None', desc: 'Filter: OPEN, INVESTIGATING, MITIGATED, RESOLVED, FALSE_POSITIVE' },
          { flag: '--limit <num>', type: 'int', default: '50', desc: 'Maximum incidents to display' }
        ],
        envVars: [],
        permissions: 'Security Officer / Workspace member',
        example: 'secretvault incident list --status OPEN',
        exitCodes: '0 on success',
        related: ['cli-incident-create', 'cli-incident-update']
      },
      {
        id: 'cli-incident-create',
        name: 'secretvault incident create',
        aliases: ['secretvault incidents create'],
        summary: 'Report and declare a new security incident',
        verificationStatus: 'Implemented and verified',
        syntax: 'secretvault incident create --title=<title> --severity=<severity> [options]',
        arguments: [],
        options: [
          { flag: '--title <text>', type: 'String', default: 'Required', desc: 'Incident title' },
          { flag: '--severity <severity>', type: 'String', default: 'Required', desc: 'Severity: CRITICAL, HIGH, MEDIUM, LOW' },
          { flag: '--description <text>', type: 'String', default: 'None', desc: 'Incident narrative / evidence' },
          { flag: '--secret-id <uuid>', type: 'UUID', default: 'None', desc: 'Affected secret UUID' }
        ],
        envVars: [],
        permissions: 'Security Officer / Workspace Admin',
        example: 'secretvault incident create --title "Public API Token Leak" --severity CRITICAL',
        exitCodes: '0 on success',
        related: ['cli-incident-update', 'cli-secret-compromise']
      },
      {
        id: 'cli-incident-update',
        name: 'secretvault incident update-status',
        aliases: ['secretvault incidents update-status'],
        summary: 'Transition incident status through triage lifecycle',
        verificationStatus: 'Implemented and verified',
        syntax: 'secretvault incident update-status <incidentId> --status=<status> [options]',
        arguments: [{ name: '<incidentId>', required: true, desc: 'Incident UUID' }],
        options: [
          { flag: '--status <status>', type: 'String', default: 'Required', desc: 'Status: INVESTIGATING, MITIGATED, RESOLVED, FALSE_POSITIVE' },
          { flag: '--resolution <text>', type: 'String', default: 'None', desc: 'Resolution summary' }
        ],
        envVars: [],
        permissions: 'Security Officer / Workspace Admin',
        example: 'secretvault incident update-status 8e7f... --status RESOLVED --resolution "Credential rotated and old token revoked"',
        exitCodes: '0 on success',
        related: ['cli-incident-list']
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // 13. AI Intelligence Copilot
  // ---------------------------------------------------------------------------
  {
    groupId: 'cli-ai-group',
    groupTitle: 'AI Intelligence Copilot',
    commands: [
      {
        id: 'cli-ai-ask',
        name: 'secretvault ai ask',
        summary: 'Submit an advisory query to SecretVault AI Copilot (zero-plaintext enforced)',
        verificationStatus: 'Implemented and verified',
        syntax: 'secretvault ai ask <prompt> [options]',
        arguments: [
          { name: '<prompt>', required: true, desc: 'Natural-language query / inquiry for the AI copilot' }
        ],
        options: [
          { flag: '--intent <intent>', type: 'String', default: 'ADVISORY', desc: 'Inquiry intent: DEPLOYMENT_RCA, DRIFT_ANALYSIS, SECURITY_AUDIT, POSTURE_FORECAST, REMEDIATION_RECOMMENDATION' },
          { flag: '--target-type <type>', type: 'String', default: 'None', desc: 'Target resource type (DEPLOYMENT, SYNC_JOB, SECRET)' },
          { flag: '--target-id <id>', type: 'String', default: 'None', desc: 'Target resource ID' },
          ...CLI_GLOBAL_FLAGS.slice(5)
        ],
        envVars: [],
        permissions: 'AI copilot permission on workspace',
        example: 'secretvault ai ask "Explain our current secret rotation coverage and highlight unrotated credentials"',
        exitCodes: '0 on success, 1 on quota exceeded or provider failure',
        related: ['cli-ai-rca', 'cli-ai-posture', 'cli-ai-plans']
      },
      {
        id: 'cli-ai-rca',
        name: 'secretvault ai rca',
        summary: 'Perform AI root-cause analysis on a failed deployment or sync job',
        verificationStatus: 'Implemented and verified',
        syntax: 'secretvault ai rca <deploymentId|jobId> [options]',
        arguments: [{ name: '<id>', required: true, desc: 'Deployment or sync job identifier' }],
        options: CLI_GLOBAL_FLAGS.slice(5),
        envVars: [],
        permissions: 'AI copilot permission',
        example: 'secretvault ai rca sync-job-402',
        exitCodes: '0 on success',
        related: ['cli-ai-ask', 'cli-ai-plans']
      },
      {
        id: 'cli-ai-posture',
        name: 'secretvault ai posture',
        summary: 'Forecast security posture decay and drift vectors across projects',
        verificationStatus: 'Implemented and verified',
        syntax: 'secretvault ai posture [options]',
        arguments: [],
        options: CLI_GLOBAL_FLAGS.slice(5),
        envVars: [],
        permissions: 'AI copilot permission',
        example: 'secretvault ai posture',
        exitCodes: '0 on success',
        related: ['cli-ai-budget']
      },
      {
        id: 'cli-ai-plans',
        name: 'secretvault ai plans',
        summary: 'Manage AI-generated remediation plans and execution guardrails',
        verificationStatus: 'Implemented and verified',
        syntax: 'secretvault ai plans [options]',
        arguments: [],
        options: CLI_GLOBAL_FLAGS.slice(5),
        envVars: [],
        permissions: 'Admin permission on workspace',
        example: 'secretvault ai plans',
        exitCodes: '0 on success',
        related: ['cli-ai-ask']
      },
      {
        id: 'cli-ai-budget',
        name: 'secretvault ai budget',
        summary: 'Display AI token quota and rate limiting status',
        verificationStatus: 'Implemented and verified',
        syntax: 'secretvault ai budget',
        arguments: [],
        options: CLI_GLOBAL_FLAGS.slice(5),
        envVars: [],
        permissions: 'Workspace member',
        example: 'secretvault ai budget',
        exitCodes: '0 on success',
        related: ['cli-ai-ask']
      }
    ]
  },

  // ---------------------------------------------------------------------------
  // 14. Notifications & Alerts
  // ---------------------------------------------------------------------------
  {
    groupId: 'cli-notification-group',
    groupTitle: 'Notifications & Alerts',
    commands: [
      {
        id: 'cli-notify-list',
        name: 'secretvault notification list',
        aliases: ['secretvault notify list', 'secretvault notifications list'],
        summary: 'View security alerts and in-app notifications',
        verificationStatus: 'Implemented and verified',
        syntax: 'secretvault notification list [options]',
        arguments: [],
        options: [
          { flag: '--unread-only', type: 'boolean', default: 'false', desc: 'Display only unread alerts' },
          { flag: '--limit <num>', type: 'int', default: '50', desc: 'Maximum alerts to display' }
        ],
        envVars: [],
        permissions: 'Authenticated user',
        example: 'secretvault notification list --unread-only',
        exitCodes: '0 on success',
        related: ['cli-notify-read', 'cli-notify-read-all']
      },
      {
        id: 'cli-notify-read',
        name: 'secretvault notification read',
        aliases: ['secretvault notify read'],
        summary: 'Mark a security notification as read',
        verificationStatus: 'Implemented and verified',
        syntax: 'secretvault notification read <alertId>',
        arguments: [{ name: '<alertId>', required: true, desc: 'Notification UUID' }],
        options: [],
        envVars: [],
        permissions: 'Notification recipient',
        example: 'secretvault notification read 5e6f...',
        exitCodes: '0 on success',
        related: ['cli-notify-read-all']
      },
      {
        id: 'cli-notify-read-all',
        name: 'secretvault notification read-all',
        aliases: ['secretvault notify read-all'],
        summary: 'Mark all pending notifications as read',
        verificationStatus: 'Implemented and verified',
        syntax: 'secretvault notification read-all',
        arguments: [],
        options: [],
        envVars: [],
        permissions: 'Authenticated user',
        example: 'secretvault notification read-all',
        exitCodes: '0 on success',
        related: ['cli-notify-list']
      }
    ]
  }
];

// Flat lookup index
export const findCliCommandById = (id) => {
  for (const group of CLI_COMMAND_GROUPS) {
    const cmd = group.commands.find((c) => c.id === id);
    if (cmd) return { command: cmd, group };
  }
  return { command: null, group: null };
};

// Search index helper
export const searchCliCommands = (query) => {
  if (!query || !query.trim()) return [];
  const q = query.toLowerCase().trim();
  const results = [];
  for (const group of CLI_COMMAND_GROUPS) {
    for (const cmd of group.commands) {
      const matchName = cmd.name.toLowerCase().includes(q);
      const matchSummary = cmd.summary.toLowerCase().includes(q);
      const matchSyntax = cmd.syntax.toLowerCase().includes(q);
      const matchAliases = cmd.aliases ? cmd.aliases.some((a) => a.toLowerCase().includes(q)) : false;
      const matchOption = cmd.options.some((o) => o.flag.toLowerCase().includes(q) || o.desc.toLowerCase().includes(q));
      const matchArg = cmd.arguments.some((a) => a.name.toLowerCase().includes(q) || a.desc.toLowerCase().includes(q));

      if (matchName || matchSummary || matchSyntax || matchAliases || matchOption || matchArg) {
        results.push({ command: cmd, group });
      }
    }
  }
  return results;
};
