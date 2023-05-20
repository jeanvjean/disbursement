module.exports = {
    apps: [
        {
            name: 'exports-audit-logs-queue',
            script: 'app/queues/consumers/auditLogs/export.js',
            args: '',
            instances: 1,
            autorestart: true,
            exec_mode: 'fork',
            watch: false,
            max_memory_restart: '100M',
            env_development: {
                NODE_ENV: 'development',
                PORT: 5006
            },
            env_production: {
                NODE_ENV: 'production',
                PORT: 5006
            },
            env_staging: {
                NODE_ENV: 'staging',
                PORT: 5006
            }
        },
        {
            name: 'send-exported-audit-logs-queue',
            script: 'app/queues/consumers/auditLogs/send_export.js',
            args: '',
            instances: 1,
            autorestart: true,
            exec_mode: 'fork',
            watch: false,
            max_memory_restart: '100M',
            env_development: {
                NODE_ENV: 'development',
                PORT: 5006
            },
            env_production: {
                NODE_ENV: 'production',
                PORT: 5006
            },
            env_staging: {
                NODE_ENV: 'staging',
                PORT: 5006
            }
        },
        {
            name: 'exports-flagged-approve-queue',
            script: 'app/queues/consumers/flaggedApprove/export.js',
            args: '',
            instances: 1,
            autorestart: true,
            exec_mode: 'fork',
            watch: false,
            max_memory_restart: '100M',
            env_development: {
                NODE_ENV: 'development',
                PORT: 5006
            },
            env_production: {
                NODE_ENV: 'production',
                PORT: 5006
            },
            env_staging: {
                NODE_ENV: 'staging',
                PORT: 5006
            }
        },
        {
            name: 'send-exported-flagged-approve-queue',
            script: 'app/queues/consumers/flaggedApprove/send_export.js',
            args: '',
            instances: 1,
            autorestart: true,
            exec_mode: 'fork',
            watch: false,
            max_memory_restart: '100M',
            env_development: {
                NODE_ENV: 'development',
                PORT: 5006
            },
            env_production: {
                NODE_ENV: 'production',
                PORT: 5006
            },
            env_staging: {
                NODE_ENV: 'staging',
                PORT: 5006
            }
        },
        {
            name: 'exports-pending-resolve-queue',
            script: 'app/queues/consumers/pendingResolve/export.js',
            args: '',
            instances: 1,
            autorestart: true,
            exec_mode: 'fork',
            watch: false,
            max_memory_restart: '100M',
            env_development: {
                NODE_ENV: 'development',
                PORT: 5006
            },
            env_production: {
                NODE_ENV: 'production',
                PORT: 5006
            },
            env_staging: {
                NODE_ENV: 'staging',
                PORT: 5006
            }
        },
        {
            name: 'send-exported-pending-resolve-queue',
            script: 'app/queues/consumers/pendingResolve/send_export.js',
            args: '',
            instances: 1,
            autorestart: true,
            exec_mode: 'fork',
            watch: false,
            max_memory_restart: '100M',
            env_development: {
                NODE_ENV: 'development',
                PORT: 5006
            },
            env_production: {
                NODE_ENV: 'production',
                PORT: 5006
            },
            env_staging: {
                NODE_ENV: 'staging',
                PORT: 5006
            }
        },
    ],

    deploy: {
        production: {
            user: 'node',
            host: '212.83.163.1',
            ref: 'origin/master',
            repo: 'git@github.com:repo.git',
            path: '/var/www/production',
            'post-deploy':
        'npm install && pm2 reload ecosystem.config.js --env production'
        }
    }
};
