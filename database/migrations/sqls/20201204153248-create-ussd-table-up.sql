/* Replace with your SQL commands */
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE ussd(
    id VARCHAR PRIMARY KEY DEFAULT 'ussd-' || LOWER(
        REPLACE(
            CAST(uuid_generate_v1mc() As varchar(50))
            , '-','')
        ),
    phone_number VARCHAR DEFAULT NULL,
    service_code VARCHAR DEFAULT NULL,
    duration VARCHAR DEFAULT NULL,
    transaction_date VARCHAR DEFAULT NULL,
    Status VARCHAR DEFAULT 'pending',
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);