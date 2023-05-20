/* Replace with your SQL commands */
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE transactions_histories(
    id VARCHAR PRIMARY KEY DEFAULT 'history-' || LOWER(
        REPLACE(
            CAST(uuid_generate_v1mc() As varchar(50))
            , '-','')
        ),
    phone_number VARCHAR,
    message_content TEXT,
    account_number VARCHAR,
    bank_name VARCHAR,
    account_name VARCHAR DEFAULT NULL,
    status VARCHAR DEFAULT 'pending',
    account_resolved_by VARCHAR DEFAULT NULL,
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);