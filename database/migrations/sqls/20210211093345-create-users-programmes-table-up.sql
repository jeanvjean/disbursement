/* Replace with your SQL commands */

CREATE TABLE users_programmes(
    id VARCHAR PRIMARY KEY DEFAULT 'user-programme-' || LOWER(
        REPLACE(
            CAST(uuid_generate_v1mc() As varchar(50))
            , '-','')
        ),
    user_id VARCHAR NOT NULL,
    programme_id VARCHAR NOT NULL,
    programme_name VARCHAR NOT NULL,
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT fk_user
      FOREIGN KEY(user_id) 
	  REFERENCES users(id)
);