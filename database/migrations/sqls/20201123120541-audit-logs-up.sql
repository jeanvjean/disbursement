/* Replace with your SQL commands */
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE audit_logs(
    id VARCHAR PRIMARY KEY DEFAULT 'audit-' || LOWER(
        REPLACE(
            CAST(uuid_generate_v1mc() As varchar(50)),
            '-',
            ''
        )
    ),
    client_ip VARCHAR NOT NULL,
    req_method VARCHAR NOT NULL,
    host VARCHAR NOT NULL,
    path VARCHAR NOT NULL,
    status_code VARCHAR,
    client_agent VARCHAR,
    response_message VARCHAR,
    referer VARCHAR,
    content_type VARCHAR,
    content_encoding VARCHAR,
    user_agent VARCHAR,
    user_name VARCHAR,
    user_email VARCHAR,
    user_type VARCHAR,
    user_id VARCHAR,
    deleted_at timestamp with time zone DEFAULT null,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);