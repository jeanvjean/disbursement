/* Replace with your SQL commands */

ALTER TABLE transactions
    ADD IF NOT EXISTS resolved_account_number VARCHAR DEFAULT NULL,
    ADD IF NOT EXISTS resolved_account_name VARCHAR DEFAULT NULL,
    ADD IF NOT EXISTS resolved_bank_name VARCHAR DEFAULT NULL;