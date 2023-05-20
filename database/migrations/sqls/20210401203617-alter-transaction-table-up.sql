/* Replace with your SQL commands */

ALTER TABLE transactions
    ADD IF NOT EXISTS client_id VARCHAR DEFAULT NULL;