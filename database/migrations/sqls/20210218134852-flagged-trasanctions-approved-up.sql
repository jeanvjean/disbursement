/* Replace with your SQL commands */

CREATE TABLE flagged_trasanctions_approved(
    id VARCHAR PRIMARY KEY DEFAULT 'flagged-trans-approve' || LOWER(
        REPLACE(
            CAST(uuid_generate_v1mc() As varchar(50))
            , '-','')
        ),
    user_id VARCHAR NOT NULL,
    account_number VARCHAR NOT NULL,
    account_name VARCHAR NOT NULL,
    bank_name VARCHAR NOT NULL,
    transaction_status VARCHAR NOT NULL,
    transaction_id VARCHAR NOT NULL,
    amount NUMERIC NOT NULL,
    deleted_at TIMESTAMPTZ DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT fk_user
      FOREIGN KEY(user_id) 
	  REFERENCES users(id)
);