/* Replace with your SQL commands */
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users_activities(
    id VARCHAR PRIMARY KEY DEFAULT 'user-activities-' || LOWER(
        REPLACE(
            CAST(uuid_generate_v1mc() As varchar(50)),
            '-',
            ''
        )
    ),
    user_id VARCHAR,
    activity TEXT,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);