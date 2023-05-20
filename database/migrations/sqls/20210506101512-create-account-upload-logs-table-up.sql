/* Replace with your SQL commands */
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE beneficiary_upload_logs(
    id VARCHAR PRIMARY KEY DEFAULT 'beneficiary-upload-log-' || LOWER(
        REPLACE(
            CAST(uuid_generate_v1mc() As varchar(50))
            , '-','')
        ),
    user_id TEXT,
    file_path VARCHAR,
    file_name VARCHAR,
    type VARCHAR,
    programme_id VARCHAR,
    programme_name VARCHAR,
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);