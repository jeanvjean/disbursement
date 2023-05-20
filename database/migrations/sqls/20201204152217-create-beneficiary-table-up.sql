/* Replace with your SQL commands */
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE beneficiaries(
    id VARCHAR PRIMARY KEY DEFAULT 'beneficiary-' || LOWER(
        REPLACE(
            CAST(uuid_generate_v1mc() As varchar(50))
            , '-','')
        ),
    phone_number VARCHAR DEFAULT NULL,
    first_name VARCHAR DEFAULT NULL,
    last_name VARCHAR DEFAULT NULL,
    amount_credited NUMERIC,
    date_of_transaction TIMESTAMPTZ DEFAULT NULL,
    account_number VARCHAR  DEFAULT NULL,
    bank_name VARCHAR DEFAULT NULL,
    bank_code VARCHAR DEFAULT NULL,
    status VARCHAR DEFAULT 'pending',
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);