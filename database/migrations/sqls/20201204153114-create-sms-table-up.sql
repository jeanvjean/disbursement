/* Replace with your SQL commands */
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE sms(
    id VARCHAR PRIMARY KEY DEFAULT 'sms-' || LOWER(
        REPLACE(
            CAST(uuid_generate_v1mc() As varchar(50))
            , '-','')
        ),
    phone_number VARCHAR DEFAULT NULL,
    sms_content VARCHAR DEFAULT NULL,
    sms_sent_at VARCHAR DEFAULT NULL,
    type VARCHAR DEFAULT 'inbox',
    status VARCHAR DEFAULT 'pending',
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);