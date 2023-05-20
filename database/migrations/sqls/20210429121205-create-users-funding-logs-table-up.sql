/* Replace with your SQL commands */
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE users_funds_logs(
    id VARCHAR PRIMARY KEY DEFAULT 'user-fund-' || LOWER(
        REPLACE(
            CAST(uuid_generate_v1mc() As varchar(50))
            , '-','')
        ),
    fund_id VARCHAR,
    user_id TEXT,
    status VARCHAR,
    amount VARCHAR,
    programme_id VARCHAR,
    programme_name VARCHAR,
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);